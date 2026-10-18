```md
---
name: ui-copywriting
description: Improve UI text, labels, messages, notifications, validation errors, and other user-facing content to make them clear, user-friendly, natural, formal, and professional without changing their meaning.
---

# UI Copywriting

## Purpose

Improve user-facing text throughout the application so it is easy to understand, natural, user-friendly, and professional.

The goal is to help users understand what is happening, what they need to do, and what happens next without unnecessary explanation.

## Language

Use the language already established by the project.

For Indonesian text, use language that is:

- User-friendly and easy to understand.
- Formal and professional.
- Natural and familiar.
- Concise and clear.
- Consistent throughout the application.

Avoid language that is too casual, overly formal, academic, robotic, or difficult to understand.

## Writing Principles

### 1. Understand the Context

Before rewriting text:

- Understand the purpose of the text.
- Identify who will read it.
- Understand the UI context and user action.
- Check the surrounding component or flow when available.
- Preserve the original meaning and intended behavior.

Do not rewrite text based on its wording alone.

### 2. Use Natural Language

Write as a professional product would communicate with its users.

Prefer familiar words and natural sentence structures.

Avoid literal translations, awkward phrasing, and wording that sounds machine-generated.

### 3. Keep It User-Friendly

- Explain information from the user's perspective.
- Use clear and direct instructions.
- Tell users what happened and what they can do next when relevant.
- Avoid unnecessary technical details.
- Do not blame users for errors.
- Do not use vague messages when more specific information is available.

### 4. Maintain a Professional Tone

Use polite and respectful language without sounding stiff or overly formal.

Avoid slang, excessive exclamation marks, unnecessary filler, and overly friendly expressions that do not fit the product.

### 5. Be Concise

- Keep labels short and recognizable.
- Keep button text action-oriented.
- Keep notifications focused on the outcome.
- Keep validation messages specific.
- Remove redundant words and repeated information.

Do not shorten text if doing so makes the meaning unclear.

## UI Writing Guidelines

### Labels

Use short, familiar terms that clearly identify a field or section.

### Buttons

Use clear action verbs that describe what will happen.

Examples:

- "Simpan"
- "Batalkan"
- "Coba Lagi"
- "Unduh Laporan"

Avoid vague labels such as "OK" when a more meaningful action label is appropriate.

### Success Messages

State what has successfully happened.

Example:

- "Perubahan berhasil disimpan."

Do not show a success message unless the operation actually succeeded.

### Error Messages

Explain the problem in language the user can understand.

When appropriate, include a practical next step.

Example:

- "Gagal menyimpan perubahan. Silakan coba lagi."

Do not expose stack traces, internal errors, or sensitive technical details.

### Validation Messages

Identify what needs to be corrected.

Example:

- "Masukkan alamat email yang valid."

Avoid vague messages such as "Input tidak valid" when the specific problem is known.

### Confirmation Dialogs

Clearly explain the action and its consequences, especially for destructive or irreversible actions.

Use specific action labels instead of ambiguous confirmation buttons when possible.

### Empty States

Explain why the section has no content when that information is known, and provide a next action when useful.

Do not add unnecessary instructions to simple empty states.

### Loading States

Use short, clear descriptions of the ongoing action when a label is needed.

Do not imply that an operation has completed before it has finished.

## Consistency

- Follow existing product terminology.
- Use the same term for the same concept throughout the application.
- Follow the project's language and localization conventions.
- Preserve established technical terms when they are commonly understood by the target users.
- Do not introduce alternative terms without a clear reason.

## Rules

- Do not change application behavior.
- Do not change business logic or validation rules.
- Do not change API contracts, identifiers, or technical values.
- Do not modify unrelated code.
- Do not rewrite text that is already clear and appropriate without a reason.
- Do not invent product behavior or promises.
- Preserve interpolation variables, placeholders, localization keys, and formatting.
- Keep changes focused on user-facing text.
- Follow the existing project structure and coding conventions.

## Workflow

Before making changes:

1. Locate the relevant user-facing text.
2. Understand its context and intended meaning.
3. Identify unclear, awkward, inconsistent, or overly technical wording.
4. Rewrite only when improvement is necessary.
5. Review the result for clarity, tone, brevity, and consistency.
6. Verify that the changes do not affect functionality.

## Final Review

Before finishing, check:

- Is the meaning accurate?
- Is the text easy to understand on the first read?
- Does it sound natural when read aloud?
- Is the tone formal and professional without being stiff?
- Can unnecessary words be removed?
- Is the terminology consistent with the rest of the application?
- Are all placeholders and localization keys preserved?

## Report

After making changes, briefly report:

- Which files were updated.
- What types of wording were improved.
- Whether any checks were performed.

Do not claim that tests passed unless they were actually run and passed.
```
