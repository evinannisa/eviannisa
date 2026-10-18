---
name: comment-id
description: Rewrite code comments into concise, clear, and natural Indonesian using common language. Keep the tone professional and formal without sounding stiff. Preserve technical terms, code identifiers, names, values, and directives. Use when asked to fix, simplify, tidy, translate, or rewrite code comments in Indonesian.
---

---

# Indonesian Code Comments

Rewrite code comments using **common, clear, and natural Indonesian** while keeping the tone **formal and professional**.

The comment should be easy to understand on the first read, concise, and focused on the important information.

Use Indonesian for the explanatory language, while keeping technical terms in their commonly used technical form.

Do not use slang or overly casual language.

**Change only comments. Never change the code.**

Talk to the user in Indonesian.

## Writing Principles

Rewrite each comment in this order:

### 1. Understand the Meaning

**Do not translate the original comment word by word.**

Before writing the new comment, understand the **overall meaning and flow** of the original comment and the surrounding code.

Treat the original comment only as a description of the intended behavior. It is not a sentence that must be translated.

Follow this process internally:

1. Read the code around the comment.
2. Read the entire original comment as one piece of information.
3. Identify the actual sequence of actions or behavior.
4. Identify the important reason, condition, or purpose.
5. Ignore awkward or literal wording from the original comment.
6. Reconstruct the meaning in natural Indonesian.
7. Keep only the information that is useful to understand the code.
8. Preserve technical terms without translating them.

**Do not preserve the original sentence structure.**

If the original comment contains awkward English, do not reproduce its structure in Indonesian.

For example, do not transform:

```text
a locked note comes still encrypted
```

into:

```text
catatan terkunci diterima masih terenkripsi
```

Instead, understand the intended meaning:

> The locked note is received in encrypted form.

Then write the natural Indonesian version:

```text
Catatan terkunci diterima dalam bentuk terenkripsi.
```

Likewise, do not translate:

```text
its key is asked here
```

into:

```text
kuncinya diminta di sini
```

First determine what the code actually does with the key.

If the code obtains the key at that point, write:

```text
Kunci diperoleh di sini.
```

The final comment should therefore describe the **meaning and behavior of the code**, not the wording or sentence structure of the original comment.

### Example

Original:

```js
// a locked note comes still encrypted: its key is asked here, it's opened
// into the editor in the browser and locked again before it's saved
```

Do not translate it into:

```js
// Catatan terkunci diterima masih terenkripsi: kuncinya diminta di halaman ini,
// lalu catatan dibuka di editor dan dikunci lagi di browser sebelum disimpan.
```

Instead, understand the complete flow:

- the note is received in encrypted form
- the key is obtained at this point
- the note is opened in the editor
- the note is locked again before saving

Then reconstruct the comment naturally:

```js
// Catatan terkunci diterima dalam bentuk terenkripsi. Kunci diperoleh di sini,
// lalu catatan dibuka dan dikunci kembali sebelum disimpan.
```

**The goal is not translation. The goal is accurate reconstruction of the meaning in natural Indonesian.**

### 2. Common Language

Use Indonesian words that people commonly use.

- Avoid slang.
- Avoid stiff, academic, or overly formal words.
- Use simple words when they communicate the same meaning.
- Keep the tone professional.
- Do not use complicated wording just to sound formal.

Avoid expressions such as:

- `ngecek`
- `nggak`
- `biar`
- `guna`
- `apabila`
- `dikarenakan`
- `dilakukan pengecekan`
- `dilakukan validasi`
- `dilakukan penyimpanan`
- `dilakukan penghapusan`

Prefer direct and natural wording such as:

- `mengecek`
- `jika`
- `karena`
- `menyimpan`
- `menghapus`

Do not force these preferences when they make the sentence less natural or change the meaning.

### 3. Easy to Understand

Write so a junior developer can understand the comment on the first read.

- Use simple sentence structures.
- Keep sentences direct.
- Avoid unnecessary jargon.
- Explain uncommon concepts only when necessary.
- Make the relationship between actions clear.
- Prefer one clear sentence over several complicated sentences when possible.

The comment should explain the behavior or reason clearly without requiring the reader to interpret complicated wording.

### 4. Concise

Keep only the essential information.

- Remove details that are obvious from the code.
- Remove unnecessary technical explanations.
- Remove repetition.
- Avoid explaining every line of code.
- Keep the result the same length or shorter when possible.

Do not shorten a comment if doing so removes important context.

### 5. Final Polish

After rewriting:

- Check grammar.
- Check word choice.
- Check that the meaning is accurate.
- Remove repetition.
- Make sure the wording sounds natural.
- Make sure the tone is professional.
- Make sure technical terms remain intact.
- Simplify again if the sentence still feels complicated.

Do these steps internally.

Only the final result should be written to the file.

## Tone

Use language that is:

- formal but natural
- professional
- common and easy to understand
- clear
- concise

Avoid:

- slang
- overly casual expressions
- academic language
- overly formal wording
- unnecessary technical jargon
- literal translations
- repetitive explanations
- unnatural Indonesian translations of technical terms

## Use Common Words

Prefer words that are commonly used while keeping the tone professional.

Choose words based on the **meaning and context of the code**, not only the literal meaning of the original wording.

Do not translate word by word.

First understand what the comment means, then choose the Indonesian wording that best describes the actual behavior.

| Avoid                 | Prefer        |
| --------------------- | ------------- |
| melakukan pengecekan  | mengecek      |
| digunakan untuk       | untuk         |
| berfungsi untuk       | untuk         |
| apabila               | jika          |
| dikarenakan           | karena        |
| terlebih dahulu       | terlebih dulu |
| melakukan validasi    | mengecek      |
| melakukan penghapusan | menghapus     |
| melakukan penyimpanan | menyimpan     |

These are general preferences, not mandatory replacements.

Do not force a replacement if it makes the sentence less natural or changes the meaning.

When multiple words are possible, choose the one that is:

- commonly used
- natural in Indonesian
- easy to understand
- appropriate for the context
- accurate to what the code actually does

The final wording should describe the **actual meaning and behavior of the code**, not simply replace words from the original comment.

## Technical Terms

Technical terms should remain in their commonly used technical form.

**Do not translate technical terms into Indonesian.**

Keep terms such as:

- `request`
- `response`
- `get`
- `fetch`
- `retrieve`
- `validate`
- `check`
- `save`
- `delete`
- `create`
- `update`
- `insert`
- `select`
- `query`
- `filter`
- `sort`
- `search`
- `parse`
- `stringify`
- `encode`
- `decode`
- `encrypt`
- `decrypt`
- `hash`
- `cache`
- `timeout`
- `session`
- `token`
- `password`
- `login`
- `logout`
- `route`
- `middleware`
- `handler`
- `controller`
- `service`
- `repository`
- `API`
- `database`
- `browser`
- `editor`
- `frontend`
- `backend`
- `component`
- `props`
- `state`
- `hook`
- `callback`
- `promise`
- `async`
- `await`

Do not translate technical terms such as:

```text
request → permintaan
response → respons
fetch → mengambil
validate → memvalidasi
delete → menghapus
save → menyimpan
create → membuat
update → memperbarui
encrypt → mengenkripsi
decrypt → mendekripsi
cache → tembolok
session → sesi
token → tanda
route → rute
middleware → perantara
```

The surrounding explanation should still be written in natural Indonesian.

For example:

```js id="4j6x9q"
// Fetch data user sebelum menampilkan detail.
```

not:

```js id="7q1v2m"
// Mengambil data user sebelum menampilkan detail.
```

And:

```js id="3p8z4k"
// Validate token sebelum request dilanjutkan.
```

not:

```js id="1f5r7n"
// Memvalidasi token sebelum permintaan dilanjutkan.
```

The goal is:

**Indonesian explanation + familiar technical terminology.**

Do not translate technical terms unless the user explicitly asks for a full translation or the term is clearly being used as normal non-technical language.

## Context-Based Word Choice

Do not use mechanical word replacement.

The same word can have different meanings depending on the code.

Before choosing Indonesian wording, understand what the code actually does.

For example, a comment may use:

- `requested`
- `get`
- `fetch`
- `retrieve`
- `obtain`
- `receive`

These words should not automatically be translated into one fixed Indonesian word.

First determine the actual operation.

For example:

- if the code sends a request to obtain something, describe the operation based on what the code actually does
- if the code receives a value from another function, use wording that describes receiving or obtaining it
- if the code reads a value from storage, describe it as reading or getting the value
- if the code fetches data from an API, keep `fetch` as a technical term
- if the code validates a token, keep `validate`
- if the code deletes a record, keep `delete` when it is being used as a technical operation

Do not change technical terminology just to make the comment fully Indonesian.

### Example: Choosing the Correct Indonesian Wording

Original:

```js id="6k2m9x"
// catatan terkunci datang masih terenkripsi: kuncinya diminta di sini,
// dibuka ke editor di browser, lalu dikunci lagi sebelum disimpan
```

Do not translate the wording literally.

First understand the flow:

1. The locked note is received in encrypted form.
2. The key is obtained at this point.
3. The note is opened in the editor.
4. The note is locked again before being saved.

A natural result is:

```js id="8w4p1c"
// Catatan terkunci diterima dalam bentuk terenkripsi. Kunci diperoleh di sini,
// lalu catatan dibuka dan dikunci kembali sebelum disimpan.
```

The word `diminta` is not preserved because the actual meaning of the code is better described by `diperoleh`.

Do not make this decision based only on a word-to-word translation.

## Explain the Important Part

A comment should explain information that is useful but not obvious from the code.

Good:

```js id="9k3m7p"
// Session yang sudah expired dihapus otomatis oleh Mongo.
```

Avoid:

```js id="2r8x5n"
// Menghapus session.
```

when the code already clearly shows the deletion.

Focus on:

- why the code is needed
- why a specific approach is used
- important edge cases
- security reasons
- limitations
- behavior that is not obvious from the code
- important side effects
- dependencies on external behavior

Do not explain code that is already self-explanatory.

## Preserve Code and Technical Content

Never change technical identifiers or values inside comments.

Keep exactly as they are:

- function names
- variable names
- field names
- routes
- file names
- environment variables
- CSS classes
- commands
- error messages
- example values
- code inside comments
- technical identifiers
- tool directives
- shebangs
- license headers
- commented-out code
- `TODO`
- `FIXME`
- `HACK`
- `NOTE`
- `@deprecated`
- doc tags such as `@param`, `@returns`, `@throws`, `Args:`, and `Returns:`

Only rewrite the explanatory text inside comments.

Do not change:

- strings
- regexes
- user-facing text
- generated files
- files marked `generated`
- files marked `DO NOT EDIT`

If a technical term appears inside an explanatory comment, preserve the technical term.

For example:

```js
// Fetch user data before rendering the detail page.
```

may become:

```js
// Fetch data user sebelum menampilkan halaman detail.
```

but not:

```js
// Mengambil data pengguna sebelum menampilkan halaman rincian.
```

The first version preserves the technical term and changes only the explanatory language.

## Before Editing

Before changing any comment:

1. Read the code around each comment.
2. Understand what the code actually does.
3. Determine what information the comment is trying to explain.
4. Check whether the existing comment matches the code.
5. Identify technical terms and preserve them.
6. Choose Indonesian wording based on the actual meaning.
7. Rewrite only the explanatory text.
8. Do not assume the existing comment is correct.
9. Do not change the code.

If the comment does not match the code, write the comment based on the actual behavior and report the `file:line` to the user.

## Files

If the user names files, use those files.

If no files are named:

1. Check changed files with:

```bash
git diff --name-only
```

2. Include relevant untracked files.
3. Skip:

- `node_modules/`
- build output
- minified files
- generated files
- lock files
- built CSS such as `output.css`

If there are no relevant changed files, ask which files to edit.

## Editing Rules

When editing:

- Change only comments.
- Do not modify code formatting unless required to preserve the comment.
- Do not rename identifiers.
- Do not change logic.
- Do not change strings.
- Do not change imports.
- Do not change configuration.
- Do not add unrelated improvements.
- Do not translate technical terms.
- Do not rewrite code inside comments.
- Do not change directives or doc tags.

If a comment needs to be split into multiple lines, keep the formatting readable and consistent with the surrounding code.

## Check After Editing

After editing:

1. Run:

```bash
git diff
```

2. Verify that only comments changed.
3. Check that no identifiers, strings, or code logic were modified.
4. Check that technical terms remain unchanged.
5. Run the project's existing formatter, linter, or relevant checks when appropriate.
6. For JavaScript files, run `node --check` when applicable.
7. Do not fix unrelated existing errors.
8. Do not commit changes.

If a check cannot be run, report that briefly.

## Report

Report briefly in Indonesian:

- files changed
- number of comments changed
- 2–3 before/after examples
- comments that did not match the code
- anything intentionally left unchanged
- check results

Keep the report concise.

Do not include unnecessary implementation details.
