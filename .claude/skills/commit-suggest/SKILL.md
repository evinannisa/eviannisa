---
name: commit-suggest
description: Suggest a branch name and commit message(s) from every change in the working tree (staged, unstaged and untracked), following the repo's Conventional Commits style. Read-only - it only suggests; it never stages, commits, creates branches or pushes unless the user asks afterwards. Use when asked for a commit message, a commit name, a branch name, or how to split the current changes into commits.
---

# Commit and branch suggestions

Look at every change in the working tree, then suggest a branch name and
commit message(s) that describe it. Suggest only: the user decides.

## Language
- Every reply to the user is in Indonesian: the explanation, the
  grouping, questions and the summary.
- The suggestions themselves are in English, as the repo's history is:
  branch names, commit subjects and bodies. File paths, code and
  commands stay exactly as they are.

## Rules
- Read-only: do not run `git add`, `commit`, `checkout`, `switch`,
  `branch`, `stash`, `reset` or `push`, and do not edit any file.
- Only after the user picks a suggestion and asks for it may you create
  the branch or commit, and then exactly as agreed. Never push unless
  asked.
- Never suggest committing secrets or local files: `.env`,
  `.session-secret`, uploads, logs, `node_modules`, editor folders. If
  one shows up as untracked, say so and suggest adding it to
  `.gitignore` instead.

## 1. Gather all changes
- `git status --porcelain=v1 -uall` for the full list (staged, unstaged,
  untracked).
- `git diff --stat` and `git diff --cached --stat` for the size of each.
- Read the actual diffs (`git diff`, `git diff --cached`) and the
  untracked files, enough to know *what each change does*, not just
  which files moved. For big files, read the hunks, not the whole file.
- `git log --oneline -15` and `git branch -a` to match the repo's own
  conventions (prefixes, wording, tense, branch style).

## 2. Group the changes
- Group by purpose, not by file: one feature, one fix, one refactor
  each. A single file can belong to two groups when its hunks do
  different things (say so, and show `git add -p` for it).
- Keep a group whole: a model, its route and its view for one feature
  go together, so each commit builds and works on its own.
- Order the groups so each commit only depends on the ones before it
  (for example the model before the routes that use it).
- When everything is one change, suggest one commit. Don't split for
  the sake of it.

## 3. Name them
Commit messages, in Conventional Commits as the history uses:
- `type: subject`, with type one of `feat`, `fix`, `refactor`,
  `style`, `perf`, `docs`, `test`, `chore`, `build`, `ci`; add a scope
  only if the repo already uses scopes (`feat(auth): ...`).
- Subject: imperative, lowercase, no period, at most about 72
  characters, saying what the change does for the app ("add sharing of
  contacts and notes"), not which files changed.
- A body (wrapped at 72) only when the why or the parts aren't obvious
  from the subject: a few `-` bullets.
- Mark breaking changes with `!` and a `BREAKING CHANGE:` line (for
  example a changed password-hash format that old code can't read).

Branch name:
- `type/short-kebab-description`, 2 to 5 words, lowercase, ASCII only,
  from the main theme of all the changes (`feat/user-accounts-sharing`,
  `fix/highlight-menu-clipped`).
- If there are several unrelated groups, give one branch for the whole
  set and mention which groups could go on separate branches instead.

## 4. Report
In this order, short:
1. **Branch:** the suggested name, plus one or two alternatives.
2. **Commits:** for each group, in commit order: the message (in a
   code block, ready to copy), the files in it, and one line in
   Indonesian on what it covers.
3. **Notes:** anything that shouldn't be committed, files that are
   split across commits, or changes that look unfinished (debug logs,
   TODOs, commented-out code).
4. **Commands:** the exact commands to apply the suggestion, in a code
   block, for example:
   ```
   git switch -c feat/user-accounts-sharing
   git add model/user.js utils/password.js app.js views/auth.ejs
   git commit -m "feat: add sign up, sign in and sessions"
   ```
   Use a heredoc or multiple `-m` for a message with a body.
5. End by asking whether to create the branch and commits as suggested,
   change something, or leave it.
