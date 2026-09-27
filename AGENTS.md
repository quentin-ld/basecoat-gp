<!-- harness:start -->
## Harness runtime (0.1.0)

Every tool goes through `bin/harness`. It resolves the execution backend for
you, in this order: **DDEV**, then **LocalWP**, then the host.

```bash
bin/harness doctor          # backend, tools, graft, manifest — run this first
bin/harness env             # resolved paths
bin/harness help            # every command
```

**Never call `php`, `composer`, `node`, `npm` or `wp` directly.** The host has
neither Node nor PHP installed; a direct call fails in a way that looks like a
broken project rather than a broken environment.

| need | command |
|---|---|
| standards + static analysis | `bin/harness lint` |
| autofix | `bin/harness lint:fix` |
| code graph | `bin/harness graft ask "<question>" --source` |
| translations | `bin/harness pot` |
| distributable | `bin/harness zip` / `bin/harness package` |

**Tests.** This project is a theme, and a theme carries no test layer (ADR 0009): `test`, `integration`, `coverage`, `mutation`, `counterfactual`, `test:js` and `e2e` each print one sentence and exit 0. Lint, the build and the hooks are unchanged.

`bin/harness graft` is the one exception to the container rule: graft is an
nvm-installed Node binary, so it runs on the host. The runner resolves the nvm
toolchain explicitly, because an agent shell that never sourced nvm cannot see
`graft` on `PATH` at all.

## Git hooks

Enable once per clone:

```bash
git config core.hooksPath .githooks
```

| stage | budget | contents |
|---|---|---|
| `pre-commit` | target < 10 s | staged-file lint and the anti-pattern scan |
| `pre-push` | target < 90 s | full lint |
| `pre-release` | unbounded | full lint, i18n, packaging |

The budgets are targets, not guarantees, and the hook prints what it actually
took. A suite that isolates every test in its own process costs roughly PHP
startup times the number of tests — `updatronix-pro` measures 38 s that way —
and the honest response is to move that suite to `pre-push`, never to lower the
number the gate claims.

Bypassing a hook with `--no-verify` is a hard rule violation, not a
convenience. If a gate is wrong, fix the gate and say so.

## Generated files

`bin/harness`, `bin/check-test-antipatterns.php`, `.githooks/*` and this section
are **generated** and carry a manifest in `.harness/manifest.json`. Edits are
overwritten by the next sync. Everything else in this repository is
hand-written and never touched by the generator.
<!-- harness:end -->
