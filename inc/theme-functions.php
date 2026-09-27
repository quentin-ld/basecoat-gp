<?php
/**
 * Functions.
 *
 * @package basecoat-gp
 */

/**
 * Add the page slug to the body class list.
 *
 * Lets CSS and JS target `.<post-type>-<slug>` for a specific page — useful for
 * one-off layout on a landing page without adding a template for it.
 *
 * @param string[] $classes Existing body classes.
 * @return string[] The classes, with the slug one appended.
 */
function basecoat_add_slug_body_class( $classes ) {
	global $post;

	if ( isset( $post ) ) {
		$classes[] = $post->post_type . '-' . $post->post_name;
	}

	return $classes;
}
add_filter( 'body_class', 'basecoat_add_slug_body_class' );

/**
 * Retune GenerateBlocks' breakpoints.
 *
 * GenerateBlocks ships its own media query set, which does not match the
 * breakpoints the theme's SCSS uses. This aligns them, so a class that switches
 * at `1024px` in CSS switches at `1024px` in the block editor too.
 *
 * Hooked to `wp` at priority 20, after GenerateBlocks registers its own filter.
 *
 * @return void
 */
function basecoat_gp_blocks_breakpoints() {
	add_filter(
		'generateblocks_media_query',
		static function ( $query ) {
			$query['desktop']     = '(min-width: 1024px)';
			$query['tablet']      = '(max-width: 768px)';
			$query['tablet_only'] = '(max-width: 1025px) and (min-width: 769px)';
			$query['mobile']      = '(max-width: 576px)';

			return $query;
		}
	);
}
add_action( 'wp', 'basecoat_gp_blocks_breakpoints', 20 );
