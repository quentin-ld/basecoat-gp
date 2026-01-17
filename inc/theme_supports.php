<?php
/**
 * Theme Supports
 *
 * @package Basecoat
 */

/*	-----------------------------------------------------------------------------------------------
    LOAD TEXT DOMAIN
    Load theme translations.
--------------------------------------------------------------------------------------------------- */
add_action('after_setup_theme', 'basecoat_load_textdomain');
function basecoat_load_textdomain() {
    load_theme_textdomain('basecoat', get_stylesheet_directory() . '/languages');
}
