# Git Usage Restrictions
<!-- BEGIN:git-restriction-rule -->
**CRITICAL RULE:** Do not execute ANY `git` commands (e.g., `git add`, `git commit`, `git push`, `git fetch`) via terminal commands under any circumstances. Do not modify, read, or interact with the `.git` directory or `.git/config` files. The user has explicitly revoked the agent's permission to interact with version control. All Git operations and deployments MUST be left entirely to the user to perform manually via their own UI tools (like GitHub Desktop).
<!-- END:git-restriction-rule -->
