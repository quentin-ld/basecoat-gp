<?php
/**
 * Functions.
 *
 * @package basecoat-gp
 */

/**
 * Load the theme parts.
 *
 * Each include registers its own hooks, so the order here only matters where
 * one depends on another.
 */
require get_stylesheet_directory() . '/inc/theme-supports.php';
require get_stylesheet_directory() . '/inc/theme-assets.php';
require get_stylesheet_directory() . '/inc/theme-functions.php';
