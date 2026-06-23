# Spec: Login Page

## Overview

A login page that authenticates users via email and password. The page lives at the `/login` route and is a statically exported Next.js page using the Pages Router.

---

## Route

`/login` → `pages/login.tsx`

---

## UI Elements

### Email Field
- Input type: `email`
- Label: `Email`
- Placeholder: `Enter your email`
- Required: yes
- Validation:
  - Must not be empty → error: `"Email is required"`
  - Must match a valid email pattern (RFC 5322 basic: `x@x.x`) → error: `"Enter a valid email address"`

### Password Field
- Input type: `password`
- Label: `Password`
- Placeholder: `Enter your password`
- Required: yes
- Validation:
  - Must not be empty → error: `"Password is required"`
  - Minimum 8 characters → error: `"Password must be at least 8 characters"`

### Confirm Password Field
- Input type: `password`
- Label: `Confirm Password`
- Placeholder: `Re-enter your password`
- Required: yes
- Validation:
  - Must not be empty → error: `"Please confirm your password"`
  - Must match the `password` field → error: `"Passwords do not match"`

### Submit Button
- Label: `Login`
- Type: `submit`
- Behaviour:
  - Triggers validation on all fields when clicked
  - Disabled while the form is submitting
  - On successful client-side validation, calls the `onSubmit` prop (or a no-op placeholder) with `{ email, password }`

---

## Validation Rules

| Field            | Rule            | Error message                          | Trigger          |
|------------------|-----------------|----------------------------------------|------------------|
| email            | non-empty       | Email is required                      | on submit + blur |
| email            | valid format    | Enter a valid email address            | on submit + blur |
| password         | non-empty       | Password is required                   | on submit + blur |
| password         | min 8 chars     | Password must be at least 8 characters | on submit + blur |
| confirmPassword  | non-empty       | Please confirm your password           | on submit + blur |
| confirmPassword  | matches password| Passwords do not match                 | on submit + blur |

- Errors are shown beneath the relevant field.
- Errors clear when the user begins typing in that field (on change).
- Validation runs on blur and on submit; not on every keystroke.

---

## Component Interface

```typescript
interface ILoginPageProps {
  onSubmit?: (credentials: { email: string; password: string; confirmPassword: string }) => void;
}
```

The page component is the Next.js default export and accepts `onSubmit` as an optional prop to keep it testable without a real API call.

---

## State

```
email: string            // controlled input value
password: string         // controlled input value
confirmPassword: string  // controlled input value
errors: {
  email?: string
  password?: string
  confirmPassword?: string
}
isSubmitting: boolean    // true while onSubmit promise is resolving
```

---

## File Structure to Generate

```
pages/
  login.tsx                        ← Next.js page (default export)
styles/
  Login.module.css                 ← CSS Module for layout and form styles
__tests__/
  pages/
    login.test.tsx                 ← Jest + @testing-library/react unit tests
```

---

## Styles

- Centered card layout (vertically and horizontally centered on the viewport)
- Full-width input fields with visible focus ring
- Error messages in red (`#d32f2f`) displayed directly beneath the input
- Submit button spans the full width of the form
- Responsive: card is `100%` width on mobile, max `400px` on desktop

---

## Unit Tests (required coverage ≥ 80%)

The test file must cover:

1. **Renders correctly** — email field, password field, confirm password field, and login button are present in the DOM
2. **Empty submit** — submitting with all fields empty shows `"Email is required"`, `"Password is required"`, and `"Please confirm your password"` errors
3. **Invalid email** — submitting with `"notanemail"` in the email field shows `"Enter a valid email address"`
4. **Short password** — submitting with a password shorter than 8 characters shows `"Password must be at least 8 characters"`
5. **Passwords do not match** — submitting with mismatched password and confirm password shows `"Passwords do not match"`
6. **Clears error on change** — typing in a field that has an error clears that error
7. **Valid submit** — filling in a valid email, a password ≥ 8 chars, and a matching confirm password calls `onSubmit` with the correct `{ email, password, confirmPassword }` payload
8. **Blur validation** — blurring out of an empty email field shows the email error without pressing submit

---

## Acceptance Criteria

- [ ] `/login` renders the login form with email, password, confirm password, and submit
- [ ] Submitting an empty form shows inline errors under each field
- [ ] Email format is validated
- [ ] Password minimum length is enforced
- [ ] Confirm password must match password
- [ ] Errors clear when the user starts typing in the errored field
- [ ] Valid submission calls `onSubmit` with `{ email, password, confirmPassword }`
- [ ] Page passes `npm run lint` with no errors
- [ ] All unit tests pass (`npm run test`)
- [ ] Test coverage ≥ 80% for `pages/login.tsx`


