# basecoat-gp

The GeneratePress counterpart to Basecoat: a starter for building child themes
on GeneratePress, carrying the same conventions and the same toolchain in the
shape a child theme needs.

It is for starting a site that is built on GeneratePress rather than on the
block editor alone — which, among the themes here, is most of them.

<!-- harness:start -->
## Development

### Requirements

- PHP **8.1+** · WordPress **6.8+** · Composer · Node.js LTS + npm
- Docker. Every command runs through `bin/harness`, which resolves the backend
  for you — DDEV first, then LocalWP, then the host. Nothing needs installing.

### Setup

```bash
composer install
npm install
bin/harness setup   # one-time: dependencies and this project's toolchain
```

### Key commands

| Command | What it does |
|---------|--------------|
| `npm run test:all` | every linter, and the suites the project has |
| `npm run build:all` | `test:all`, then the `.pot`, then the bundle |
| `composer run verify:php` | the pre-push gate: standards and static analysis |
| `composer run verify:all` | the same, plus the suites the project has |
| `composer run lint:wpcs` / `npm run lint` / `npm run lint:css` | WPCS, ESLint, Stylelint — the `:fix` variants rewrite |
| `composer run lint:pcp` | Plugin Check, where the project ships through WordPress.org |
| `composer run make:pot` | regenerate `languages/basecoat-gp.pot` |
| `npm run zip` | the distributable archive |

**Tests.** This project is a theme, and the harness carries no test layer for themes: `test`, `integration`, `coverage`, `mutation`, `counterfactual`, `test:js` and `e2e` each print one sentence and exit 0. Lint, the build and the hooks are unchanged.

Assets: `npm start` to watch, `npm run build` for a one-shot bundle.

Anything without a script above goes through the runtime directly:

```bash
bin/harness doctor          # backend, tools, graft, manifest — run this first
bin/harness help            # every command
```

**Never call `php`, `composer`, `node`, `npm` or `wp` directly.** The backend is
resolved per project, and a direct call fails in a way that looks like a broken
project rather than a missing environment.
<!-- harness:end -->

## Installation

This is a child theme of **GeneratePress**, and a starting point rather than a
destination:

1. Install and activate GeneratePress.
2. Copy this directory into `wp-content/themes/` under the name the new site
   will use, and edit the `Theme Name:`, `Text Domain:` and version headers in
   `style.css`. **Leave the `Template:` line alone** — it is what makes the child
   load its parent's styles.
3. Run `composer install`, `npm install` and `bin/harness setup` — see the
   Development section below.
4. Activate it.

## Support & Contribution

basecoat-gp is developed in this repository. Read `AGENTS.md` first: it carries
the project facts and the gates, and it is where the child-theme shape is
recorded for every theme built from this one.
