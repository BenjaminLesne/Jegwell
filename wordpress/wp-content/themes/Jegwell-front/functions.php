<?php

if (is_admin() === false) {
    add_filter('wp_enqueue_scripts', 'remove_the_bloat', PHP_INT_MAX);
    add_filter('woocommerce_enqueue_styles', '__return_empty_array'); // enlève une portion du css de woocommerce 1/2
}

function remove_the_bloat()
{
    wp_deregister_script('jquery');
    wp_dequeue_style('wc-blocks-style'); // enlève une partie du css de woocommerce 2/2
    wp_deregister_style('dashicons');
    remove_action('wp_head', 'print_emoji_detection_script', 7); // enlève twemoji.js et wp-emoji.js
}
