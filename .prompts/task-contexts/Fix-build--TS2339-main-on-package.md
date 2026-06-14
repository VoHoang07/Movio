id: 3c3441f2-7305-4619-9381-1dc2caa53c19
sessionId: ee7da272-8ac2-4a68-92c6-5555013d370f
date: '2026-06-14T17:38:17.990Z'
label: >-
  Fix build: TS2339 main on package json type and TS6053 missing expo
  tsconfig.base
---
# HANDOFF — Fix Vercel build failures (TS2339 + TS6053)

> Coder: do **not** re-explore the codebase. Both root causes and exact edits are listed below. Apply the two minimal edits, then run the build.

## Failing Scenario (Given / When / Then)

**Given** the repository at commit `8dda42c` on `main`, where Expo was moved out of the root project into `mobile/` (root `package.json` no longer depends on `expo`)
**And** the root `tsconfig.json` still contains `"extends": "expo/tsconfig.base"`
**And** `src/test/unit/packageScripts.test.ts` types `mobilePackageJson` as `{ scripts?: ...; dependencies?: ... }` but reads `mobilePackageJson.main` on line 33
**When** Vercel runs `npm run build` (which runs `tsc -b && vite build`)
**Then** TypeScript fails with:
- `src/test/unit/packageScripts.test.ts(33,30): error TS2339: Property 'main' does not exist on type '{ scripts?: Record<string, string> | undefined; dependencies?: Record<string, string> | undefined; }'.`
- `tsconfig.json(34,14): error TS6053: File 'expo/tsconfig.base' not found.`

A regression test should verify both that `tsc -b` succeeds with no `expo` package present at the root, and that `mobilePackageJson.main` is statically typed as `string` in `packageScripts.test.ts`.

## Root Causes

### Cause 1 — Stale `extends` in root `tsconfig.json` (TS6053)
Root `package.json` does not list `expo` in `dependencies` or `devDependencies` (and the test on lines 27–29 asserts it must not). But root `tsconfig.json:34` still extends `expo/tsconfig.base`, which TypeScript cannot resolve because the package isn't installed at the root. The `extends` line is a leftover from when the root WAS the Expo app; today the Expo app lives in `mobile/` (which has its own `tsconfig.json` correctly extending `expo/tsconfig.base` because `mobile/package.json` lists `expo` as a dependency).

### Cause 2 — Incomplete type for `mobilePackageJson` (TS2339)
In `src/test/unit/packageScripts.test.ts`, `rootPackageJson` is typed with `scripts`, `dependencies`, `devDependencies`. `mobilePackageJson` is typed with only `scripts` and `dependencies`. Line 33 reads `mobilePackageJson.main` (asserting it equals `'expo/AppEntry.js'`), but `main` is not declared in the type cast, so `tsc` rejects it. The mobile `package.json` does have a real `main` field (`"main": "expo/AppEntry.js"`); only the type cast is wrong.

## Exact Edits (Minimal)

### Edit 1 — `tsconfig.json`
Remove the `extends` line. Keep everything else identical.

Current (lines 30–35):
```json
  "references": [
    {
      "path": "./tsconfig.node.json"
    }
  ],
  "extends": "expo/tsconfig.base"
}
```

Replace with:
```json
  "references": [
    {
      "path": "./tsconfig.node.json"
    }
  ]
}
```

(Delete the comma after the `]` on the `references` line and remove the `"extends": "expo/tsconfig.base"` line. Result is a valid root `tsconfig.json` whose `compilerOptions` already cover everything Vite + React + tests need; nothing in the tree imports anything that depended on the Expo base.)

### Edit 2 — `src/test/unit/packageScripts.test.ts`
Add `main?: string` to the `mobilePackageJson` type cast (lines 13–18).

Current:
```ts
const mobilePackageJson = JSON.parse(
  readFileSync(resolve(process.cwd(), 'mobile/package.json'), 'utf-8'),
) as {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
};
```

Replace with:
```ts
const mobilePackageJson = JSON.parse(
  readFileSync(resolve(process.cwd(), 'mobile/package.json'), 'utf-8'),
) as {
  main?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
};
```

## Constraints on the Fix
- **Keep it minimal.** Do not touch any other file. Do not modify `mobile/tsconfig.json` (it correctly extends `expo/tsconfig.base` because `expo` is a real dependency in `mobile/package.json`).
- Do not change `mobile/package.json` — its `main: "expo/AppEntry.js"` is intentional and asserted by the test.
- Do not add `expo` to root dependencies — `packageScripts.test.ts` lines 27–29 assert it must not be there.
- Do not delete the `.expo/` directory at the repo root as part of this fix; the test on line 56 that checks for its absence is a separate concern at runtime (`vitest run`), not at build time (`tsc -b`).
- Do not change other test logic; only widen the type cast.

## Verification

Run from the repo root:
```bash
npm run build
```
Expected: `tsc -b` exits 0, then `vite build` produces output in `dist/`. Both TS2339 and TS6053 must be gone.

Optional smoke check (doesn't gate the build):
```bash
npm test -- src/test/unit/packageScripts.test.ts
```
Note: this test file also asserts the absence of `.expo/` at the repo root and the absence of root scripts that invoke `expo start`. Those runtime assertions are not part of the build error and are out of scope here.

---

# Supporting Analysis

## Error Propagation Path

```
Vercel CI
  └── npm run build
        └── tsc -b              ← fails here, halts before vite build
              ├── reads tsconfig.json
              │     └── extends "expo/tsconfig.base"
              │           └── module resolution: ./node_modules/expo/tsconfig.base.json  → NOT FOUND
              │                 (expo removed from root deps; only mobile/node_modules/expo/ exists)
              │                 → TS6053
              └── type-checks src/test/unit/packageScripts.test.ts
                    └── line 33: mobilePackageJson.main
                          └── cast type lacks `main` field
                                → TS2339
        └── vite build           ← never runs
```

## Affected Modules

| File | Role | Action |
|---|---|---|
| `tsconfig.json` | Root TS config; `extends` an unresolved package | **Edit:** remove `extends` |
| `src/test/unit/packageScripts.test.ts` | Test that asserts mobile package layout | **Edit:** widen type cast to include `main?: string` |
| `mobile/tsconfig.json` | Mobile TS config; correctly extends `expo/tsconfig.base` | No change (expo is in `mobile/node_modules`) |
| `mobile/package.json` | Has `main: expo/AppEntry.js` (asserted by test) | No change |
| `package.json` (root) | Confirms `expo` is not (and must not be) a root dep | No change |
| `tsconfig.node.json` | Referenced project for vite/tailwind configs | No change |

## Why this slipped past local builds
A previous local run likely had a stale `node_modules/expo/` at the root (before the refactor) and an older `tsconfig.tsbuildinfo`. Vercel cloned fresh, ran a clean install (`added 7 packages, and removed 576 packages` shows aggressive pruning of stale deps), so the unresolved `extends` and the incomplete type cast both surfaced for the first time.
