# SETUP

!`gh auth setup-git 2>&1`
!`git fetch origin main 2>&1`

# TASK

Create a release branch from local `main` (which now has all the merged changes), push it to the remote, and create a PR against `origin/main`.

The following issues were implemented and should be listed with `Closes #N` in the PR body:

{{PAIRS}}

# INSTRUCTIONS

For each entry, extract the issue ID and title.

1. **Build the PR body**: Create a string with `Closes #N` on its own line for each issue ID from PAIRS. Example:

   ```
   Closes #35
   Closes #36
   ```

2. **Create and push release branch**:
   ```bash
   release_branch="sandcastle/release-$(date +%Y%m%d%H%M)"
   git checkout -b "$release_branch" main
   git push origin "$release_branch"
   ```

3. **Create PR** using the body you built (substitute the actual body string in the command):
   ```bash
   gh pr create \
     --base main \
     --head "$release_branch" \
     --title "Sandcastle merge: implemented issues" \
     --body "<body>"
   ```

4. Do NOT close the issues — the PR merge will close them automatically.

If all goes well, output the PR URL.
