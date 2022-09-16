<?php

use function Jegwell\functions\getFileUrl;

$currentDirectoryPath = dirname(__FILE__);
$main_css_url = getFileUrl('/src/main.css', $currentDirectoryPath);
$favicon_file_url = getFileUrl('/src/assets/favicon.ico', $currentDirectoryPath);
$index_js_url = getFileUrl('/src/js/index.js', $currentDirectoryPath);
$instagramUrl = "https://www.instagram.com/jegwell/";
$tikTokUrl = "https://www.tiktok.com/@jegwell";
$facebookUrl = "https://www.facebook.com/jegwell";


?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="<?php echo $main_css_url ?>">
    <link rel="icon" type="image/x-icon" href="<?php echo $favicon_file_url ?>">
    <script src="<?php echo $index_js_url ?>"></script>

    <!-- Wordpress en-dessous-->
    <?php
    wp_head();
    ?>

    <title><?php echo $page_title ?></title>
</head>

<body id="topOfThePage">
    <header class="primary-header-wrapper">
        <nav class="primary-header" aria-labelledby="primary-navigation">
            <button class="burger-button">
                <span class="burger-button__slice"></span>
                <span class="burger-button__slice"></span>
                <span class="burger-button__slice"></span>
            </button>
            <a class="brand-wrapper" href='<?php echo $_ENV['WP_HOME'] ?>'>
                <div class="brand">
                    <div class="logo">
                        <div class="logo__image">
                            <svg>
                                <use href="<?php echo get_template_directory_uri() . '/src/assets/svgs-sprite.svg#rings' ?>" />
                            </svg>
                        </div>
                    </div>
                    <div class="brand__text">
                        <span class="brand__name">JEGWELL</span>
                        <span class="brand__name brand__name--slogan">BIJOUX FAITS-MAIN</span>
                    </div>
                </div>
            </a>
            <a class="basket-icon-wrapper" href='<?php echo $_ENV['WP_HOME'] ?>/panier'>
                <svg class="basket-icon">
                    <use href="<?php echo get_template_directory_uri() . '/src/assets/svgs-sprite.svg#basket' ?>" />
                </svg>
            </a>
        </nav>
    </header>