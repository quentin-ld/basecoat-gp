<?php
/*	-----------------------------------------------------------------------------------------------
    ENQUEUE ASSETS IN GUTENBERG EDITOR
--------------------------------------------------------------------------------------------------- */
add_action('after_setup_theme', 'basecoat_editor_styles');
function basecoat_editor_styles() {
    add_editor_style(get_stylesheet_directory_uri() . '/assets/css/theme.css');
}

add_action('enqueue_block_assets', 'basecoat_enqueue_gutenberg_editor_assets');
function basecoat_enqueue_gutenberg_editor_assets() {
    // Here you can add CSS files to gutenberg editor
}

add_action('enqueue_block_editor_assets', 'basecoat_enqueue_block_variations');
function basecoat_enqueue_block_variations() {
    // Here you can add JS files to gutenberg editor
}

/*	-----------------------------------------------------------------------------------------------
    ENQUEUE STYLESHEETS
--------------------------------------------------------------------------------------------------- */
add_action('wp_enqueue_scripts', 'basecoat_enqueue_styles');
function basecoat_enqueue_styles() {
    wp_enqueue_style('baseboat-gp', get_stylesheet_directory_uri() . '/style.css', ['generate-style', 'generate-child']);
    wp_enqueue_style('baseboat-gp-theme', get_stylesheet_directory_uri() . '/assets/css/theme.css', ['generate-style', 'generate-child', 'baseboat-gp'], wp_get_theme()->get('Version'));
}

/*	-----------------------------------------------------------------------------------------------
    ENQUEUE JAVASCRIPTS
--------------------------------------------------------------------------------------------------- */
add_action('wp_enqueue_scripts', 'basecoat_enqueue_scripts');
function basecoat_enqueue_scripts() {
    wp_enqueue_script('baseboat-gp-theme', get_stylesheet_directory_uri() . '/assets/js/theme.js', [], wp_get_theme()->get('Version'), true);
}
