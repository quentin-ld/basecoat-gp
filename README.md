<!--
    Generated once, because a project without a README has no onboarding at
    all. Replace every sentence below with the real thing. The harness only
    ever rewrites the section between its markers; everything else in this
    file is yours and will not be touched.
-->

# basecoat-gp

One paragraph on what this is and who it is for. Say what problem it solves
before saying how — the reader decides in the first two lines.

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

**Tests.** This project is a theme, and a theme carries no test layer (ADR 0009): `test`, `integration`, `coverage`, `mutation`, `counterfactual`, `test:js` and `e2e` each print one sentence and exit 0. Lint, the build and the hooks are unchanged.

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

1. Install it from the WordPress dashboard, or copy the directory into a
   WordPress install.
2. Activate it.
3. …

## Support & Contribution

Where to ask questions, and how to contribute.
