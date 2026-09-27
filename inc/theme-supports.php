<?php
/**
 * Theme supports and text domain.
 *
 * @package basecoat-gp
 */

/**
 * Load the theme text domain.
 *
 * The domain is `basecoat-gp`, matching the `Text Domain:` header and the
 * slug. It was `basecoat` — the parent's — which would have loaded the parent's
 * translations for the child's strings and found none of them.
 *
 * @return void
 */
function basecoat_gp_load_textdomain() {
	load_theme_textdomain( 'basecoat-gp', get_stylesheet_directory() . '/languages' );
}
add_action( 'after_setup_theme', 'basecoat_gp_load_textdomain' );
