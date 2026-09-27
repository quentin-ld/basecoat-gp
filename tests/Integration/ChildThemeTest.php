<?php
/**
 * What basecoat-gp guarantees as a child of GeneratePress.
 *
 * @package basecoat-gp
 */

declare(strict_types=1);

/**
 * A child theme is two directories, and almost every mistake it can make is
 * confusing one for the other: loading assets from the parent, reading the
 * parent's version, or taking the parent's text domain.
 *
 * `inc/theme-supports.php` did exactly the last of those. It called
 * `load_theme_textdomain` with `basecoat`, the parent's domain, so the child's
 * strings would have been looked up in a catalogue that does not contain them
 * and rendered untranslated — with no error anywhere, and nothing to notice
 * until a user switched language. That is the class of bug these tests exist
 * for: silent, and invisible until it is not.
 *
 * What would make them fail: pointing an enqueue or a path at
 * `get_template_directory()` instead of `get_stylesheet_directory()`, or
 * restoring the parent's text domain.
 */
class ChildThemeTest extends WP_UnitTestCase {

	/**
	 * The child is the stylesheet, the parent is the template, and they differ.
	 */
	public function test_it_resolves_to_two_directories(): void {
		$this->assertNotSame(
			get_template_directory(),
			get_stylesheet_directory(),
			'basecoat-gp must resolve to a different template directory than stylesheet directory'
		);

		$this->assertStringEndsWith( 'basecoat-gp', get_stylesheet_directory() );
	}

	/**
	 * Every file the theme enqueues exists, and lives in the child.
	 */
	public function test_enqueued_assets_come_from_the_child(): void {
		$expected = array(
			'basecoat-gp'       => 'style.css',
			'basecoat-gp-theme' => 'assets/build/index.css',
		);

		foreach ( $expected as $handle => $relative ) {
			// get_stylesheet_directory() and not get_template_directory():
			// these files belong to basecoat-gp and the parent has no copy.
			$file = get_stylesheet_directory() . '/' . $relative;

			$this->assertFileExists( $file, "{$handle} points at {$relative}, which does not exist" );
			$this->assertGreaterThan( 0, filesize( $file ), "{$handle} points at an empty {$relative}" );
		}
	}

	/**
	 * The child's stylesheet loads after the parent's.
	 *
	 * A child that enqueues without declaring the parent handles can have its
	 * rules applied before the ones it means to override, which looks like the
	 * child being ignored.
	 */
	public function test_the_child_stylesheet_depends_on_the_parent(): void {
		// The theme enqueues on `wp_enqueue_scripts`, which does not run in a
		// unit test unless it is fired.
		do_action( 'wp_enqueue_scripts' );

		$styles = wp_styles();

		$this->assertArrayHasKey( 'basecoat-gp-theme', $styles->registered );

		$dependencies = $styles->registered['basecoat-gp-theme']->deps;

		$this->assertContains( 'generate-style', $dependencies );
		$this->assertContains( 'basecoat-gp', $dependencies );
	}

	/**
	 * The theme declares its own text domain, and loads the same one.
	 *
	 * Two separate declarations that nothing in WordPress compares: the
	 * `Text Domain:` header, and the string passed to
	 * `load_theme_textdomain()`. Disagreement is silent.
	 */
	public function test_it_declares_and_loads_its_own_text_domain(): void {
		$style = $this->read( get_stylesheet_directory() . '/style.css' );

		$this->assertMatchesRegularExpression(
			'/^Text Domain:\s*basecoat-gp\s*$/m',
			$style,
			'the child must declare its own text domain'
		);

		$supports = $this->read( get_stylesheet_directory() . '/inc/theme-supports.php' );

		$this->assertStringContainsString(
			"load_theme_textdomain( 'basecoat-gp'",
			$supports,
			'the domain passed to load_theme_textdomain must match the header'
		);

		// has_action() answers with the priority, not true, so assert on the
		// value it actually returns.
		$this->assertNotFalse(
			has_action( 'after_setup_theme', 'basecoat_gp_load_textdomain' ),
			'the text domain loader must be hooked'
		);
	}

	/**
	 * The bundle declares its own version.
	 */
	public function test_the_bundle_declares_its_own_version(): void {
		$asset_file = get_stylesheet_directory() . '/assets/build/index.asset.php';

		$this->assertFileExists( $asset_file );

		$asset = require $asset_file;

		$this->assertIsArray( $asset );
		$this->assertArrayHasKey( 'version', $asset );
		$this->assertNotEmpty( $asset['version'], 'an empty version defeats cache busting' );
	}

	/**
	 * Read a file in the theme's own tree.
	 *
	 * @param string $path Absolute path.
	 * @return string
	 */
	private function read( string $path ): string {
		$this->assertFileExists( $path );

		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- local file in the theme's own tree, not a remote request.
		return (string) file_get_contents( $path );
	}
}
