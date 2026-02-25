# Design Tokens & CSS Variables Governance

This document defines how visual tokens are introduced and maintained so styling remains scalable and predictable.

## Scope

- Applies to all global styles and component-level CSS.
- Tokens should represent design intent (e.g., `--color-surface`) rather than implementation detail.

## Naming rules

- Use semantic names: `--color-text-primary`, `--space-md`, `--radius-sm`, `--shadow-soft`.
- Avoid raw value names such as `--blue-500` unless the token is palette-only.
- Keep naming flat and readable; prefer shorter, explicit names over deep nesting.

## Token categories

Define and maintain tokens for:

1. **Color** (text, background, border, accents)
2. **Spacing** (layout rhythm and component padding)
3. **Typography** (font sizes, line heights, letter spacing)
4. **Radius** (surface rounding)
5. **Elevation** (shadows, overlays)
6. **Motion** (durations/easing)

## Where tokens live

- Global tokens: `src/index.css` under `:root` and theme overrides.
- Component-specific variables are allowed only when they cannot be generalized.

## Change policy

When adding a new token:

1. Reuse existing token if possible.
2. If new token is needed, add it at global level with semantic name.
3. Update all impacted components to consume the token.
4. Document the token purpose in the same PR description.

When changing an existing token value:

1. Validate light/dark theme contrast.
2. Check core surfaces (hero, windows, nav, form controls).
3. Include before/after screenshot in UI-affecting PRs.

## Review checklist

- [ ] Semantic token naming is used.
- [ ] No hard-coded duplicate color/spacing values introduced unnecessarily.
- [ ] Theme parity checked (light + dark).
- [ ] Accessibility impact reviewed (contrast/focus states).
