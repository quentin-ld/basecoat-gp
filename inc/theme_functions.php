<?php

/*	-----------------------------------------------------------------------------------------------
    ADD PAGE SLUG TO BODY CLASS
--------------------------------------------------------------------------------------------------- */
add_filter('body_class', 'basecoat_add_slug_body_class');
function basecoat_add_slug_body_class($classes) {
    global $post;
    if (isset($post)) {
        $classes[] = $post->post_type . '-' . $post->post_name;
    }

    return $classes;
}

/*  -----------------------------------------------------------------------------------------------
    EDIT GENERATEBLOCKS BREAKPOINTS
--------------------------------------------------------------------------------------------------- */
add_action('wp', function () {
    add_filter('generateblocks_media_query', function ($query) {
        $query['desktop'] = '(min-width: 1024px)';
        $query['tablet'] = '(max-width: 768px)';
        $query['tablet_only'] = '(max-width: 1025px) and (min-width: 769px)';
        $query['mobile'] = '(max-width: 576px)';

        return $query;
    });
}, 20);
