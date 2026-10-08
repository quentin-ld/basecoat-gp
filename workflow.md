# Basecoat GeneratePress — workflow

The workflow is the harness's, and the block at the end of this file is its
authoritative description. That block is generated, so it cannot drift from the
tooling it describes.

Everything that used to be written above it described a toolchain this project
no longer has: **PHP-CS-Fixer**, **esbuild**, a private **ESLint** and
**Prettier** config, a `local-wp-cli.sh` shim reaching into Local's `sites.json`,
and a hand-written zip step. All of it was replaced by **WordPress Coding
Standards**, **`@wordpress/scripts`** and **`wp dist-archive`**, and it was
removed rather than updated because a stale instruction is worse than none.

For the commands themselves, run `bin/harness help`, or read `AGENTS.md`.

<!-- harness:start -->
## Harness commands (0.1.0)

The canonical entry point is `bin/harness`. It resolves DDEV, then LocalWP,
then the host, so the same command works in every environment:

```bash
bin/harness doctor     # backend, tools, graft, manifest
bin/harness verify     # the pre-push gate
bin/harness pot        # pot + mo + json + php
bin/harness zip        # distributable archive
bin/harness package    # build + pot + zip
bin/harness help       # everything else
```

**Tests.** This project is a theme, and the harness carries no test layer for themes: `test`, `integration`, `coverage`, `mutation`, `counterfactual`, `test:js` and `e2e` each print one sentence and exit 0. Lint, the build and the hooks are unchanged.

Enable the hooks once per clone:

```bash
git config core.hooksPath .githooks
```

The tables in this file describe what each gate runs; `bin/harness` is what
actually runs it. When the two disagree, `bin/harness` wins and this file is
wrong.
<!-- harness:end -->

## License

basecoat-gp is licensed under the GPL-2.0-or-later license. See the [LICENSE](LICENSE) file for more details.
