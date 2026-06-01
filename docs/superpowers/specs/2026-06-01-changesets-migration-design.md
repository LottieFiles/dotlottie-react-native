# Migrate releases from release-it to Changesets

- **Date:** 2026-06-01
- **Status:** Approved design (pending spec review)
- **Package:** `@lottiefiles/dotlottie-react-native` (single published package)
- **Reference setup:** `LottieFiles/dotlottie-web` (already on Changesets)

## 1. Problem

The `Release` workflow has been failing repeatedly. Root cause is a **state desync
between npm and git** caused by `release-it`'s lifecycle ordering combined with the
`main` branch ruleset:

1. `release-it` runs `npm publish` **before** `git push`.
2. On 2026-05-27 (run `26516422780`) it published `0.9.2` to npm, then the
   `git push` to `main` was rejected by the ruleset:
   `GH013 ... 5 of 5 required status checks are expected`.
3. So npm has `0.9.2` (and it is the `latest` dist-tag), but the repo stayed at
   `0.9.1` — no version-bump commit, no `v0.9.2` tag on the remote.
4. The published `0.9.2` was built from commit `1a3986b` (#58) and is **missing the
   #59 iOS navigation-crash fix** (its `podspec` pins `dotlottie-ios 0.15.5`; `main`
   pins `0.15.6`). npm versions are immutable, so it can never be republished.
5. Every later release run recomputes `0.9.1 → 0.9.2` and dies with
   `cannot publish over the previously published versions: 0.9.2`.

This is a recurring, structural failure: any "publish-then-push-to-protected-main"
tool hits it. `release-it` is fundamentally that shape.

## 2. Goals / Non-goals

### Goals
- Eliminate the npm/git desync class of failure structurally.
- Move the version bump through a **PR** (compatible with branch protection) and
  publish **after** that PR merges (git-first, npm-second ordering).
- Mirror the `dotlottie-web` release mechanism for org consistency.
- Ship the in-flight `0.9.3` (with the #59 fix) through the new pipeline.

### Non-goals
- No package-manager migration: **keep Yarn 3.6.1** (web uses pnpm; we adapt
  commands to yarn instead of switching).
- No additional registries: **npm only** (web also publishes to GitHub Packages and
  JSR; out of scope here — this package only ships to npm).
- No change to the npm auth model: **keep OIDC trusted publishing + provenance**
  (already in place; see §6).
- No refactor of unrelated CI (`ci.yml` lint/test/build jobs stay as they are).

## 3. Decisions (resolved during brainstorming)

| Decision | Choice |
|---|---|
| Publish trigger | **Auto on Version-PR merge** (fully automated). |
| Changelog formatter | **`@changesets/changelog-github`** (PR links + author credit; diverges from web's basic formatter — intentional). |
| Bot identity / token | **Default `secrets.GITHUB_TOKEN`** (same as web — no PAT, no GitHub App). |
| Branch protection | **Drop only the `required_status_checks` rule** from ruleset `2135846`; keep `non_fast_forward`, `deletion`, `pull_request`. |
| Package manager | **Yarn 3.6.1** (unchanged). |
| Registries | **npm only**. |
| npm auth | **OIDC trusted publishing + provenance** (unchanged). |

### Why the token / protection choices interact
The default `GITHUB_TOKEN` is subject to GitHub's recursion guard: **no workflow is
triggered by actions it performs** (neither the bot's Version PR nor any branch push
it makes). Consequently, on a branch with **required status checks**, a
`GITHUB_TOKEN`-authored Version PR can never get its checks to run and is permanently
unmergeable. `dotlottie-web` avoids this by having **no enforced protection** on
`main`.

The `main` ruleset here (`2135846`) has exactly four rules:
- `deletion`, `non_fast_forward` — safety, keep.
- `pull_request` — `allowed_merge_methods: [squash]`, `required_approving_review_count: 0`.
  The Version PR satisfies this (it *is* a PR; merging it is a PR merge). Keep.
- `required_status_checks` — 5 contexts (`lint`, `test`, `build-android`,
  `build-ios (fabric)`, `build-ios (paper)`), `strict` policy. **This is the only
  hard blocker** for the bot PR. **Remove it.**

Removing only `required_status_checks` is the minimal relaxation that unblocks the
bot while retaining force-push/deletion protection and the PR requirement. CI
(`ci.yml`) still runs on human PRs — it just no longer *gates* merge.

## 4. Release model (new flow)

```
feature PR ──(yarn changeset)──> .changeset/*.md committed
        │
        ▼ merge to main (squash)
changesets/action on push to main:
    has changesets? ──yes──> open/update "Version Packages" PR
                              (bumps package.json, writes CHANGELOG.md,
                               deletes consumed changesets)
        │
        ▼ maintainer merges Version PR (the release decision)
changesets/action on push to main:
    no changesets ──> changeset publish
                      → npm publish (OIDC + provenance)
                      → push tag vX.Y.Z
                      → create GitHub release
                      → (inline) dispatch to docs-content if published
```

The version bump reaches `main` via PR; `npm publish` runs only after it merges.
Desync is structurally impossible — git is updated first, npm second.

## 5. File-by-file changes

### Add
- **`.changeset/config.json`**
  ```json
  {
    "$schema": "https://unpkg.com/@changesets/config@3.1.2/schema.json",
    "changelog": ["@changesets/changelog-github", { "repo": "LottieFiles/dotlottie-react-native" }],
    "commit": false,
    "linked": [],
    "access": "public",
    "baseBranch": "main",
    "updateInternalDependencies": "patch",
    "ignore": ["dotlottie-react-native-example", "dotlottie-react-native-expo-example"],
    "prettier": false
  }
  ```
  (The two `ignore` entries are the private example workspaces, so Changesets never
  tries to version/publish them.)
- **`.changeset/README.md`** — standard Changesets explainer.
- **A patch changeset** for the #59 iOS fix (drives the `0.9.3` bump). Example
  `.changeset/ship-ios-nav-crash-fix.md`:
  ```md
  ---
  "@lottiefiles/dotlottie-react-native": patch
  ---

  Fix crash on navigation away on iOS (bump dotlottie-ios to 0.15.6).
  ```

### Modify
- **`package.json`**
  - devDependencies: add `@changesets/cli`, `@changesets/changelog-github`; remove
    `release-it`, `@release-it/conventional-changelog`.
  - scripts: remove `"release": "release-it"`; add
    `"release:version": "changeset version"` and
    `"release:publish": "yarn prepare && changeset publish"`.
  - remove the entire `"release-it": { ... }` config block.
- **`.github/workflows/release.yml`** — full rewrite (keep the filename; see §6
  OIDC caveat). Shape:
  ```yaml
  name: Release
  on:
    push:
      branches: [main]
    workflow_dispatch:
  concurrency:
    group: release
    cancel-in-progress: false
  permissions: {}
  jobs:
    validate:
      if: github.event_name == 'push'
      permissions: { contents: read }
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@<sha>
        - uses: ./.github/actions/setup
        - run: yarn lint
        - run: yarn typecheck
        - run: yarn prepare
        - run: yarn test
    release:
      needs: validate
      if: github.repository == 'LottieFiles/dotlottie-react-native'
      permissions:
        contents: write
        id-token: write
        pull-requests: write
      runs-on: ubuntu-latest
      outputs:
        published: ${{ steps.changesets.outputs.published }}
        publishedPackages: ${{ steps.changesets.outputs.publishedPackages }}
      steps:
        - uses: actions/checkout@<sha>
          with: { fetch-depth: 0 }
        - uses: ./.github/actions/setup
        - id: changesets
          uses: changesets/action@<sha>   # pin by SHA, like web (v1.8.0)
          with:
            version: yarn release:version
            publish: yarn release:publish
            commit: "chore: release"
            title: "chore: release"
            createGithubReleases: true
          env:
            GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
            NPM_CONFIG_PROVENANCE: "true"
        - name: Notify docs-content
          if: steps.changesets.outputs.published == 'true'
          env:
            GH_TOKEN: ${{ secrets.DOCS_CONTENT_SYNC_TOKEN }}
            PUBLISHED: ${{ steps.changesets.outputs.publishedPackages }}
          run: |
            # for each published package, look up its GitHub release and
            # repository_dispatch to LottieFiles/docs-content (event: dotlottie-docs-eval)
            # — same payload shape as the current notify-docs.yml.
  ```
- **`CONTRIBUTING.md`** — replace the "Publishing to npm" / `yarn release` section
  with the changeset workflow (`yarn changeset` per PR; how releases happen).

### Delete
- **`.github/workflows/notify-docs.yml`** — its `on: release: [published]` trigger
  will **not** fire for releases the bot creates with `GITHUB_TOKEN` (recursion
  guard). The dispatch is moved inline into the `release` job (gated on
  `published == 'true'`), reusing `DOCS_CONTENT_SYNC_TOKEN`.

### Repo settings (maintainer, outside the codebase)
- Edit ruleset `2135846` on `main`: **remove the `required_status_checks` rule**.
  (Via Settings → Rules → Rulesets → `main`, or the REST API.)

## 6. npm auth (OIDC) — already in place

`.github/actions/setup/action.yml` already:
- sets `registry-url: https://registry.npmjs.org`,
- runs `npm install -g npm@latest` (comment: "Upgrade npm for OIDC support").

There is **no npm token secret** anywhere in `.github/` — publishing uses **npm OIDC
trusted publishing** (the `NODE_AUTH_TOKEN: XXXXX-XXXXX-XXXXX-XXXXX` seen in logs is
`setup-node`'s placeholder, not a real secret). `release.yml` already requests
`id-token: write`. `changeset publish` calls `npm publish` under the hood, so OIDC +
`NPM_CONFIG_PROVENANCE=true` carry over unchanged.

**Caveat:** npm trusted publishing is bound to (repository, workflow filename, and
optional environment) on npmjs.com. Keep the workflow file named `release.yml` and do
not add a job `environment:` unless the npm trusted-publisher config is updated to
match — otherwise OIDC auth fails.

## 7. Rollout of the in-flight 0.9.3

1. Merge **PR #60** (`chore: sync version to published 0.9.2`) first, so
   `package.json` is `0.9.2` and Changesets computes the next version from there.
2. This migration PR includes the patch changeset for #59 (§5).
3. Merge the migration PR; apply the protection change (§5 repo settings).
4. `changesets/action` opens a **Version Packages PR** (`0.9.2 → 0.9.3`).
5. Merge it → auto-publish `0.9.3` to npm (provenance), push `v0.9.3`, create the
   GitHub release, dispatch to docs-content. `latest` moves to `0.9.3`,
   superseding the orphaned `0.9.2`.

The previously-created `v0.9.2` tag (at `1a3986b`) is left in place as an accurate
record of what npm `0.9.2` was built from.

## 8. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Dropping `required_status_checks` lets a red human PR merge to `main`. | Accepted trade-off (user chose to relax protection rather than use a token/App). CI still runs and is visible on PRs; `validate` job re-runs checks on push to main before any release. |
| `changeset publish` runs but a package version already exists. | `changeset publish` skips already-published versions instead of hard-failing (unlike release-it). |
| Bot's GitHub release doesn't trigger `on: release` workflows. | Docs notification moved inline into the release job (gated on `published`). `notify-docs.yml` deleted. |
| Contributors forget to add a changeset. | Optional follow-up: add the `changeset-bot` GitHub App (PR comment reminder). Not required for this migration. |
| OIDC trusted publishing breaks. | Keep `release.yml` filename; no job `environment:`; `id-token: write` retained. |
| Workflow uses unpinned actions (supply chain). | Pin `changesets/action` and `actions/*` by SHA, matching web. |

## 9. Acceptance criteria

- `release-it` and its config are fully removed; `@changesets/cli` +
  `@changesets/changelog-github` are present; `yarn install --immutable` succeeds.
- `.changeset/config.json` validates against the schema; example workspaces are in
  `ignore`.
- On push to `main` with a pending changeset, the workflow opens a Version PR that
  bumps `package.json` and updates `CHANGELOG.md` with a PR-linked entry.
- Merging the Version PR publishes to npm with provenance, pushes the tag, creates a
  GitHub release, and dispatches to `docs-content`.
- `0.9.3` is published with the #59 fix and becomes `latest`.
- No direct push to `main` occurs from the release workflow.
