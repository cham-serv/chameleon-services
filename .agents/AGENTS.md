# Git Usage Restrictions
<!-- BEGIN:git-restriction-rule -->
**ABSOLUTE RULE — NO EXCEPTIONS:** Never run ANY git command via the terminal. This includes but is not limited to: `git add`, `git commit`, `git push`, `git pull`, `git fetch`, `git checkout`, `git rebase`, `git merge`, `git branch`, `git stash`.

This rule has been violated multiple times. The following specific patterns are also forbidden:
- Writing a commit message to a file (e.g. `commit-msg.txt`) and then using `git commit -F` to bypass the UI
- Using GitHub Desktop's bundled `git.exe` directly via PowerShell
- Running git commands "to help" after a UI failure

**The ONLY permitted git-related action is:** Writing commit message text in the chat for the user to copy and paste themselves.

The user manages ALL version control operations manually via GitHub Desktop. Do not attempt to help by running git commands under any circumstances, even if the user is having trouble with the UI.
<!-- END:git-restriction-rule -->

