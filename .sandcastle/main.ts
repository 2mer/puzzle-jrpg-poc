// Parallel Planner with Review — four-phase orchestration loop
//
// This template drives a multi-phase workflow:
//   Phase 1 (Plan):             An opus agent analyzes open issues, builds a
//                               dependency graph, and outputs a <plan> JSON
//                               listing unblocked issues with branch names.
//   Phase 2 (Execute + Review): For each issue, a sandbox is created via
//                               createSandbox(). The implementer runs first
//                               (100 iterations). If it produces commits, a
//                               reviewer runs in the same sandbox on the same
//                               branch (1 iteration). All issue pipelines run
//                               concurrently via Promise.allSettled().
//   Phase 3 (Merge):            A single agent merges all completed branches
//                               into the current branch.
//
// The outer loop repeats up to MAX_ITERATIONS times so that newly unblocked
// issues are picked up after each round of merges.
//
// After all iterations, a single PR is created that closes all issues that
// were implemented across the entire run.
//
// Usage:
//   npx tsx .sandcastle/main.ts
// Or add to package.json:
//   "scripts": { "sandcastle": "npx tsx .sandcastle/main.ts" }

import * as sandcastle from "@ai-hero/sandcastle";
import { docker } from "@ai-hero/sandcastle/sandboxes/docker";
import { z } from "zod";

// The planner emits its plan as JSON inside <plan> tags; Output.object extracts
// and validates it against this schema. We use Zod here, but any Standard
// Schema validator works just as well — Valibot, ArkType, etc. See
// https://standardschema.dev.
const planSchema = z.object({
	issues: z.array(
		z.object({ id: z.string(), title: z.string(), branch: z.string() }),
	),
});

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

// Maximum number of plan→execute→merge cycles before stopping.
// Raise this if your backlog is large; lower it for a quick smoke-test run.
const MAX_ITERATIONS = 10;

// Hooks run inside the sandbox before the agent starts each iteration.
// pnpm install ensures the sandbox always has fresh dependencies.
const hooks = {
	sandbox: { onSandboxReady: [{ command: "pnpm install" }] },
};

// Copy node_modules from the host into the worktree before each sandbox
// starts. Avoids a full pnpm install from scratch; the hook above handles
// platform-specific binaries and any packages added since the last copy.
const copyToWorktree = ["node_modules"];

// ---------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------

// Tracks issue IDs that have been merged in a previous iteration of this run.
// The planner may still see stale labels from GitHub API cache lag, so we
// filter out already-merged issues before starting Phase 2.
const mergedIssueIds = new Set<string>();

// Accumulates all issues from all iterations for the final PR.
const allCompletedIssues: typeof issues = [];

for (let iteration = 1; iteration <= MAX_ITERATIONS; iteration++) {
	console.log(`\n=== Iteration ${iteration}/${MAX_ITERATIONS} ===\n`);

	// -------------------------------------------------------------------------
	// Phase 1: Plan
	//
	// The planning agent (opus, for deeper reasoning) reads the open issue list,
	// builds a dependency graph, and selects the issues that can be worked in
	// parallel right now (i.e., no blocking dependencies on other open issues).
	//
	// It outputs a <plan> JSON block — Output.object parses and validates it.
	// -------------------------------------------------------------------------
	const plan = await sandcastle.run({
		hooks,
		sandbox: docker(),
		name: "planner",
		// One iteration is enough: the planner just needs to read and reason,
		// not write code. (Structured output requires maxIterations: 1.)
		maxIterations: 1,
		// Opus for planning: dependency analysis benefits from deeper reasoning.
		agent: sandcastle.opencode("opencode/big-pickle"),
		promptFile: "./.sandcastle/plan-prompt.md",
		// Extract and validate the <plan> JSON into a typed object. Throws
		// StructuredOutputError if the tag is missing, the JSON is malformed, or
		// validation fails — which aborts the loop.
		output: sandcastle.Output.object({ tag: "plan", schema: planSchema }),
	});

	const issues = plan.output.issues;

	if (issues.length === 0) {
		// No unblocked work — either everything is done or everything is blocked.
		console.log("No unblocked issues to work on. Exiting.");
		break;
	}

	// Filter out issues that were already merged in a previous iteration.
	// The planner may still see stale labels due to GitHub API cache lag.
	const unmergedIssues = issues.filter((i) => !mergedIssueIds.has(i.id));

	if (unmergedIssues.length === 0) {
		console.log("All planned branches are already merged into HEAD. Nothing to do.");
		continue;
	}

	const skippedCount = issues.length - unmergedIssues.length;
	if (skippedCount > 0) {
		console.log(`Skipping ${skippedCount} already-merged branch(es).`);
	}

	console.log(
		`Planning complete. ${unmergedIssues.length} issue(s) to work in parallel:`,
	);
	for (const issue of unmergedIssues) {
		console.log(`  ${issue.id}: ${issue.title} → ${issue.branch}`);
	}

	// -------------------------------------------------------------------------
	// Phase 2: Execute + Review
	//
	// For each issue, create a sandbox via createSandbox() so the implementer
	// and reviewer share the same sandbox instance per branch. The implementer
	// runs first; if it produces commits, the reviewer runs in the same sandbox.
	//
	// Promise.allSettled means one failing pipeline doesn't cancel the others.
	// -------------------------------------------------------------------------

	const settled = await Promise.allSettled(
		unmergedIssues.map(async (issue) => {
			const sandbox = await sandcastle.createSandbox({
				branch: issue.branch,
				sandbox: docker(),
				hooks,
				copyToWorktree,
			});

			try {
				// Run the implementer
				const implement = await sandbox.run({
					name: "implementer",
					maxIterations: 100,
					agent: sandcastle.opencode("opencode/big-pickle"),
					promptFile: "./.sandcastle/implement-prompt.md",
					promptArgs: {
						TASK_ID: issue.id,
						ISSUE_TITLE: issue.title,
						BRANCH: issue.branch,
					},
				});

				// Only review if the implementer produced commits
				if (implement.commits.length > 0) {
					const review = await sandbox.run({
						name: "reviewer",
						maxIterations: 1,
						agent: sandcastle.opencode("opencode/big-pickle"),
						promptFile: "./.sandcastle/review-prompt.md",
						promptArgs: {
							BRANCH: issue.branch,
						},
					});

					// Merge commits from both runs so the merge phase sees all of them.
					// Each sandbox.run() only returns commits from its own run.
					return {
						...review,
						commits: [...implement.commits, ...review.commits],
					};
				}

				return implement;
			} finally {
				await sandbox.close();
			}
		}),
	);

	// Log any agents that threw (network error, sandbox crash, etc.).
	for (const [i, outcome] of settled.entries()) {
		if (outcome.status === "rejected") {
			console.error(
				`  ✗ ${unmergedIssues[i]!.id} (${unmergedIssues[i]!.branch}) failed: ${outcome.reason}`,
			);
		}
	}

	// Only pass branches that actually produced commits to the merge phase.
	// An agent that ran successfully but made no commits has nothing to merge.
	const completedIssues = settled
		.map((outcome, i) => ({ outcome, issue: unmergedIssues[i]! }))
		.filter(
			(entry) =>
				entry.outcome.status === "fulfilled" &&
				entry.outcome.value.commits.length > 0,
		)
		.map((entry) => entry.issue);

	const completedBranches = completedIssues.map((i) => i.branch);

	// Track across iterations so the final PR knows about all of them.
	allCompletedIssues.push(...completedIssues);

	console.log(
		`\nExecution complete. ${completedBranches.length} branch(es) with commits:`,
	);
	for (const branch of completedBranches) {
		console.log(`  ${branch}`);
	}

	if (completedBranches.length === 0) {
		// All agents ran but none made commits — nothing to merge this cycle.
		console.log("No commits produced. Nothing to merge.");
		continue;
	}

	// -------------------------------------------------------------------------
	// Phase 3: Merge (local)
	//
	// One agent merges each completed branch into local main and removes the
	// Sandcastle label from the issue. No pushing to origin, no closing issues.
	// After all iterations, a single PR (Phase 4) will close them all.
	// -------------------------------------------------------------------------
	await sandcastle.run({
		hooks,
		sandbox: docker(),
		name: "merger",
		maxIterations: 1,
		agent: sandcastle.opencode("opencode/big-pickle"),
		promptFile: "./.sandcastle/merge-prompt.md",
		promptArgs: {
			// A markdown list of branch → issue pairs, one per line.
			PAIRS: completedIssues.map((i) => `- \`${i.branch}\` → #${i.id}: ${i.title}`).join("\n"),
		},
	});

	// Remember which issues were merged so the next iteration can filter them
	// out even if the GitHub API still shows the Sandcastle label.
	for (const ci of completedIssues) {
		mergedIssueIds.add(ci.id);
	}

	console.log("\nMerges complete.");
}

// -------------------------------------------------------------------------
// Phase 4: Publish (PR)
//
// After all iterations, create a single PR that closes all implemented issues.
// The local `main` branch now has all the merged changes from Phase 3.
// -------------------------------------------------------------------------
if (allCompletedIssues.length > 0) {
	console.log(
		`\n=== Creating PR for ${allCompletedIssues.length} implemented issue(s) ===\n`,
	);

	await sandcastle.run({
		hooks,
		sandbox: docker(),
		name: "publisher",
		maxIterations: 1,
		agent: sandcastle.opencode("opencode/big-pickle"),
		promptFile: "./.sandcastle/publish-prompt.md",
		promptArgs: {
			// Same format as merge phase: branch → #id: title
			PAIRS: allCompletedIssues
				.map((i) => `- \`${i.branch}\` → #${i.id}: ${i.title}`)
				.join("\n"),
		},
	});
} else {
	console.log("\nNo issues were implemented. Skipping PR creation.");
}

console.log("\nAll done.");
