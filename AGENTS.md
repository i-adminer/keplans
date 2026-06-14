## Project Mission

This project is a production-grade Next.js application built with:

- Next.js 16
- React 19+
- pnpm
- Tailwind CSS v4
- shadcn/ui
- TypeScript
- App Router

All changes must prioritize:

1. Correctness
2. Maintainability
3. Accessibility
4. Performance
5. Type Safety
6. UI Consistency
7. Responsive Design
8. Zero Hallucination Development

---

# Core Development Principles

## 1. Never Guess

If information is unclear:

- Do not invent APIs.
- Do not invent file structures.
- Do not invent environment variables.
- Do not invent database schemas.
- Do not invent routes.
- Do not invent component props.
- Do not invent library capabilities.

Instead:

1. Inspect the codebase.
2. Search project files.
3. Search official documentation.
4. Ask for clarification if uncertainty remains.

### Forbidden

```ts
// WRONG
const users = await getUsersFromMagicApi();
```

when no such API exists.

### Required

```ts
// Verify implementation first
```

---

# 2. Web Search First Policy

When encountering uncertainty:

## Must Search

- Next.js behavior
- React behavior
- Tailwind v4 syntax
- shadcn/ui updates
- pnpm workspace behavior
- TypeScript issues
- Library APIs
- Browser compatibility
- Build errors
- Runtime errors

## Never Assume

If confidence < 95%:

Research first.

---

# 3. Production Quality Only

Every implementation must be production ready.

No:

- TODO placeholders
- Mock implementations
- Fake loading states
- Hardcoded temporary values
- Dummy API responses

Unless explicitly requested.

---

# UI Development Standards

## 4. Preserve Existing Design System

Before editing UI:

Inspect:

- theme variables
- globals.css
- app.css
- shadcn theme
- design tokens
- spacing scale
- typography system

Do not introduce:

- random colors
- random spacing
- random font sizes
- inconsistent border radius

---

## 5. Responsive By Default

Every UI change must support:

### Mobile

```txt
320px+
```

### Tablet

```txt
768px+
```

### Desktop

```txt
1024px+
```

### Large Screens

```txt
1440px+
```

Verify:

- overflow
- wrapping
- navigation
- dialogs
- tables
- forms

---

## 6. Never Break Existing UI

Before changing:

1. Understand component usage.
2. Trace imports.
3. Check dependent pages.
4. Check layout effects.

After changing:

Verify:

- visual consistency
- responsiveness
- accessibility
- dark mode
- loading states

---

# shadcn/ui Standards

## 7. Prefer Existing Components

Always check:

```txt
components/ui/*
```

before creating new components.

Preferred order:

1. Existing project component
2. Existing shadcn component
3. New reusable component
4. One-off implementation

---

## 8. Extend, Don't Duplicate

Bad:

```txt
UserDialog.tsx
CustomerDialog.tsx
MemberDialog.tsx
```

Good:

```txt
EntityDialog.tsx
```

with configurable props.

---

# TypeScript Standards

## 9. Zero Type Errors

Before completing work:

```bash
pnpm tsc --noEmit
```

must pass.

No:

```ts
any;
```

unless unavoidable.

Prefer:

```ts
unknown;
```

then narrow.

---

## 10. Strict Typing

Use:

```ts
type;
```

or

```ts
interface;
```

for:

- props
- responses
- forms
- server actions
- hooks

Example:

```ts
interface User {
  id: string;
  name: string;
  email: string;
}
```

---

# Next.js Standards

## 11. Follow App Router Patterns

Prefer:

```txt
app/
```

architecture.

Use:

- Server Components by default
- Client Components only when necessary

---

## 12. Minimize Client Components

Only add:

```tsx
"use client";
```

when required for:

- state
- browser APIs
- event handlers
- animations

---

## 13. Server First

Prefer:

- Server Components
- Server Actions
- Route Handlers

before client-side fetching.

---

# Performance Rules

## 14. Performance Budget

Avoid:

- unnecessary re-renders
- large client bundles
- duplicate fetching
- expensive effects

---

## 15. Optimize Images

Always use:

```tsx
next / image;
```

unless impossible.

---

## 16. Lazy Load When Appropriate

Use:

```ts
dynamic();
```

for:

- charts
- editors
- heavy components

---

# Accessibility Standards

## 17. WCAG Compliance

All UI must support:

- keyboard navigation
- screen readers
- focus states
- aria labels

---

## 18. Semantic HTML

Prefer:

```html
button nav main section article header footer
```

over generic divs.

---

# Tailwind v4 Standards

## 19. Use Existing Design Tokens

Prefer:

```tsx
bg - background;
text - foreground;
border - border;
```

instead of hardcoded values.

---

## 20. Avoid Utility Chaos

Bad:

```tsx
className="
text-[13px]
px-[11px]
mt-[7px]
"
```

Good:

Use established spacing scale.

---

# State Management

## 21. Keep State Local

Priority:

1. Local state
2. Context
3. Global store

Do not create global state unnecessarily.

---

# Forms

## 22. Form Standards

Prefer:

- React Hook Form
- Zod validation

if already used in project.

Validate:

- client side
- server side

---

# API Standards

## 23. Never Trust Client Input

Validate all incoming data.

Use:

```ts
zod;
```

or equivalent schema validation.

---

## 24. Error Handling Required

Every async operation must handle:

```ts
try {
} catch {}
```

or typed error boundaries.

---

# Database Changes

## 25. Schema Safety

Before changing schema:

1. Inspect existing relations.
2. Check migrations.
3. Verify indexes.
4. Verify constraints.

Never remove fields without impact analysis.

---

# File Modification Protocol

## 26. Full Impact Analysis Required

Before editing any file:

Identify:

- imports
- exports
- consumers
- routes affected
- components affected

Document impact.

---

## 27. Diagnose Before Modify

For every changed file:

### Step 1

Analyze current implementation.

### Step 2

Identify risks.

### Step 3

Implement changes.

### Step 4

Verify affected areas.

---

Example:

```txt
File:
components/dashboard/sidebar.tsx

Dependencies:
- dashboard layout
- mobile nav
- user menu

Risk:
navigation regression

Verification:
✓ desktop
✓ tablet
✓ mobile
✓ dark mode
```

---

# Testing Requirements

## 28. Required Checks

Before completion run:

```bash
pnpm lint
pnpm tsc --noEmit
pnpm build
```

All must pass.

---

## 29. New Features

Must verify:

- loading states
- empty states
- error states
- success states

---

# Hallucination Prevention Protocol

## 30. Evidence-Based Development

Every technical claim must come from one of:

1. Existing code
2. Official documentation
3. Verified implementation
4. User-provided requirements

Never from assumption.

---

## 31. Confidence Threshold

If confidence is below 95%:

Stop.

Investigate.

Search documentation.

Inspect code.

Ask questions.

---

## 32. Library Verification Rule

Before using any library API:

Verify:

- version compatibility
- documentation
- current syntax
- deprecations

Especially for:

- Next.js
- React
- Tailwind
- shadcn/ui
- Prisma
- Drizzle
- Zustand
- TanStack Query

---

# Completion Checklist

Before marking work complete:

- [ ] Requirements understood
- [ ] Impact analysis performed
- [ ] Existing patterns followed
- [ ] Responsive design verified
- [ ] Dark mode verified
- [ ] Accessibility checked
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] No build errors
- [ ] No duplicated components
- [ ] No dead code
- [ ] No hardcoded temporary values
- [ ] Performance considered
- [ ] Documentation updated if needed

---

# Agent Execution Rule

When implementing any request:

1. Understand the goal.
2. Inspect relevant files.
3. Analyze dependencies.
4. Search documentation if uncertain.
5. Create implementation plan.
6. Implement minimally and correctly.
7. Verify responsiveness.
8. Verify accessibility.
9. Verify TypeScript.
10. Verify build.
11. Summarize modified files and impacts.

Never skip investigation.
Never assume.
Never hallucinate.
Never break existing UI.
Always leave the codebase in a better state than it was found.
