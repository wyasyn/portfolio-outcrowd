# Repository Review: `portfolio-outcrowd`

Date: 2026-02-25

This review focuses on structure, performance, maintainability, readability, and future-proofing.

## What is already solid

- The app is modular and split by domains (`components`, `stores`, `data`, `types`) with clear responsibilities.
- Build pipeline includes SEO generation and SEO QA scripts, which is uncommon and strong for a portfolio site.
- Window content uses lazy-loading, so secondary content does not block initial render.
- Accessibility basics are present in multiple places (ARIA labels, tab roles, keyboard support).

## Key findings and recommendations

## 1) Structure and architecture

### Observations

- There are barrel files for top-level components (`src/components/TopNav.tsx`, `src/components/WorkspaceWindows.tsx`) and deeper implementation files (`src/components/topnav/TopNav.tsx`, `src/components/workspace/WorkspaceWindows.tsx`). This is good for import ergonomics, but currently mixed with direct imports in places.
- Business logic is distributed between UI components and stores. For example, theme application side effects (DOM + `localStorage`) are in `TopNav` instead of a dedicated theme module.

### Recommendations

- Introduce a lightweight `features/` boundary for growth:
  - `features/navigation/*`
  - `features/workspace/*`
  - `features/contact/*`
- Move side-effect-heavy logic out of UI components into reusable hooks/services:
  - `hooks/useThemeMode.ts`
  - `lib/theme/applyTheme.ts`
- Add an `env.ts` module to centralize and validate all env usage (site URL, contact endpoint, links).

## 2) Performance

### Observations

- Build output indicates a relatively large main JS bundle and a very large Contact window chunk.
- Build warns that `%VITE_SITE_URL%` is undefined in `index.html`, meaning canonical/OG/JSON-LD URLs can be incorrect when env is not set.

### Recommendations

- Reduce first-load JS:
  - Keep route/window lazy loading (already done) and consider delaying non-critical animation setup.
  - Audit icon imports and consider narrower icon bundles if available.
- Add explicit bundle budgets in CI (e.g., fail if main bundle exceeds threshold).
- Treat missing `VITE_SITE_URL` as CI failure in production pipelines.
- Consider a runtime-safe fallback in `index.html`-injected metadata generation to avoid `%VITE_SITE_URL%` placeholders reaching production.

## 3) Readability and consistency

### Observations

- Formatting style is inconsistent across files (single vs double quotes, differing style conventions).
- Some conditional chains are long and can be made more declarative.

### Recommendations

- Add Prettier + lint integration (`eslint-config-prettier`) to enforce one formatting style.
- Add strict lint rules for maintainability:
  - `import/order`
  - `no-restricted-imports` (to enforce boundaries)
  - `complexity`/`max-lines-per-function` for large components.
- Extract complex conditionals in `workspaceStore` into named helpers/constants (window sizing presets per kind).

## 4) Future-proofing

### Recommendations

- Add test coverage in three layers:
  1. Unit tests for store behavior (`openOrFocusWindow`, maximize/minimize, clamp logic).
  2. Component tests for keyboard navigation and contact validation.
  3. One end-to-end smoke test for opening windows and submitting the form mock.
- Add `persist` middleware for theme mode in Zustand instead of manually writing to `localStorage` inside a component.
- Add a `CONTRIBUTING.md` with conventions:
  - Naming standards
  - Folder structure rules
  - Accessibility checklist
  - PR checklist with performance and SEO checks

## Prioritized action plan

### Quick wins (1-2 days)

1. Add Prettier and enforce formatting in CI.
2. Introduce `src/config/env.ts` with typed env parsing.
3. Move theme side effects into a dedicated hook.
4. Fail CI when `VITE_SITE_URL` is missing in production mode.

### Mid-term (1 week)

1. Add Vitest + React Testing Library.
2. Cover stores and contact form behavior with tests.
3. Add bundle-size budget checks.

### Long-term

1. Migrate to feature-based folders for scalability.
2. Add lightweight observability (web-vitals logging, error boundary reporting).
3. Introduce design tokens/CSS variables governance documentation.

---

If you want, the next step can be implementing the **quick wins** in a dedicated PR sequence so each change stays easy to review.
