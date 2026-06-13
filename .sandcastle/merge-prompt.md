# SETUP

!`gh auth setup-git 2>&1`

# TASK

Merge each branch below into local `main`, then remove the `Sandcastle` label from the issue.

Do NOT push to `origin/main`. Do NOT close the issue.

Each entry in PAIRS gives the branch, issue ID, and issue title:

{{PAIRS}}

# INSTRUCTIONS

For each entry, extract the branch name and issue ID. Then:

1. **Merge**: Ensure you are on `main`, then merge the branch:
   ```bash
   git merge --no-edit <branch>
   ```

2. **Remove label**:
   ```bash
   gh issue edit <ID> --remove-label Sandcastle
   ```

3. **Wait briefly** before producing output so GitHub's cache catches up.

If all goes well, output <promise>COMPLETE</promise>.
