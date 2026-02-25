# Feature-Oriented Architecture (Incremental)

The app is migrating from folder-by-type to feature-oriented boundaries.

## Feature entry points

- `src/features/navigation/index.ts`
- `src/features/workspace/index.ts`
- `src/features/contact/index.ts`

These files expose stable APIs for each feature and reduce cross-feature coupling.

## Migration guideline

- New imports from app-level modules should prefer `src/features/*` entry points.
- Internal feature implementation can remain in existing folders during transition.
- Move files gradually to avoid broad merge conflicts.

## Why incremental

- Keeps PRs smaller and safer.
- Reduces rebasing pain on frequently edited files.
- Allows test coverage and QA checks to continue without disruptive rewrites.
