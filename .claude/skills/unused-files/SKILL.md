---
name: unused-files
description: Find files and folders in the project that are no longer used or never were - modules nobody requires, views nobody renders or includes, public assets no page loads, unused npm packages, leftover backups and empty folders. Read-only while scanning - every candidate is checked for all the ways it could still be reached before it is reported. Deletes or moves nothing unless the user approves it afterwards. Use when asked to find, list or clean up unused, dead, orphaned or leftover files, folders or dependencies.
---

# Unused files and folders

Find what the project no longer uses, prove it for each candidate, and
report it. Removing anything comes only after the user approves it.

## Language
- Every reply to the user is in Indonesian: the report, the reasons,
  questions and the summary.
- File paths, code, package names and commands stay exactly as they
  are.

## Rules
- Read-only while scanning: do not delete, move, rename or edit any
  file, do not touch `.gitignore`, and do not install or uninstall
  packages.
- Never run the app against the real database to check usage. A
  throwaway copy on another port with a throwaway database is fine if a
  runtime check is really needed.
- Never report, and never suggest deleting, anything the app needs at
  runtime but nothing in the code names: `.env`, `.session-secret` and
  other secrets, `public/uploads/` and what's in it (user data),
  `node_modules/`, `.git/`, `.claude/`, lockfiles, and config read by
  tools (`package.json`, `eslint.config.*`, `.prettierrc*`,
  `postcss.config.*`, `tailwind` config, `.gitignore`, `.editorconfig`).

## 1. Map the project and its entry points
- List the files git sees: `git ls-files` plus untracked files from
  `git status --porcelain -uall` (skip ignored ones unless they're
  clearly leftovers, like `*.bak` or `*.orig`).
- Find the entry points: `main` and `scripts` in `package.json`, the
  file run to start the app (e.g. `node app.js`), anything run by
  tooling (CSS build input such as `public/css/tailwind.css`, its
  output, test files, config files).
- Note how this kind of app reaches files, so nothing is missed. For an
  Express + EJS app:
  - modules: `require("./…")` / `import` (with or without extension,
    `index.js` in a folder)
  - views: `res.render("name")`, `include("partials/…")`,
    `layout: "layouts/…"`, and the `layout` option of
    `express-ejs-layouts`
  - static files under `public/`: served as `/…` paths, so look for
    `"/css/…"`, `"/js/…"`, `"/img/…"` in views, CSS (`url(…)`,
    `@import`), JS (`fetch`, `src`, `href`, `new URL`), and the
    manifest/favicon tags in the layout
  - data the code reads with `fs` by path

## 2. Find candidates
- Build the set of files reachable from the entry points by following
  every reference above, and list what's left over.
- Also look for:
  - npm packages in `dependencies` / `devDependencies` that nothing
    requires and no script, config or CLI uses
  - leftovers: `*.bak`, `*.old`, `*.orig`, `*copy*`, `*-old.*`,
    `*.log`, `.DS_Store`, stray screenshots or exports
  - empty folders, and folders whose every file is a candidate
  - generated files that are committed but rebuilt anyway (say so, and
    say what rebuilds them)

## 3. Verify every candidate
For each one, try to prove it *is* used before calling it unused:
- Search the whole repo for its name, with and without extension, and
  for its served path for public files (`grep -rn` excluding
  `node_modules` and `.git`).
- Look for names built at runtime: string concatenation or templates
  (`"partials/" + name`, `` `/img/${kind}.png` ``), lists of names
  (icon or mood names mapped to files), and folders read whole
  (`fs.readdir`, `express.static`).
- Check `git log -1 --format='%ar %s' -- <path>` for when it was last
  touched, which helps tell recent work in progress from old leftovers.
- When a file is untracked, recent and partly wired in, it may be work
  in progress: report it as such instead of as unused.
- Mark each one:
  - **Unused**: no reference anywhere, and not built dynamically.
  - **Probably unused**: only referenced from other unused files,
    from commented-out code, or by a dynamic pattern that never matches
    it.
  - **Unsure**: might be built at runtime or used by a tool; say why.

## 4. Report
In Indonesian, short, grouped:
1. **Bisa dihapus**: the Unused ones. Per item: the path, its size,
   one line on why it's unused, and when it was last changed.
2. **Kemungkinan tidak terpakai**: the Probably unused ones, with the
   one reference that keeps them in doubt.
3. **Perlu dicek manual**: the Unsure ones, with what to check.
4. **Package npm yang tidak dipakai**: the name, dependency or
   devDependency, and why.
5. **Folder kosong / sisa**: empty folders and leftover files.
6. A line on what was skipped on purpose (uploads, secrets, configs).

End with the exact commands to remove the "Bisa dihapus" group, in a
code block: `git rm` for tracked files, `rm` for untracked ones,
`npm uninstall` for packages. Then ask which to remove: all, some (by
number) or none.

## 5. After approval
- Remove only what the user picked, exactly as listed.
- Then prove nothing broke: start a throwaway copy of the app (another
  port, throwaway database), load the main pages, run the build (e.g.
  the Tailwind script, once) and the linter if the project has them, and
  check the server log for missing-module or missing-view errors.
- Report what was removed, the check results, and remind the user it
  is not committed. Never commit unless asked.
