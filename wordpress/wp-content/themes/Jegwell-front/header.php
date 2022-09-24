<?php

use function Jegwell\functions\getFileUrl;

$currentDirectoryPath = dirname(__FILE__);

// fichiers
$main_css_url = getFileUrl('/src/css/main.css', $currentDirectoryPath, get_template_directory_uri());
$favicon_file_url = getFileUrl('/src/assets/favicon.ico', $currentDirectoryPath, get_template_directory_uri());
$index_js_url = getFileUrl('/src/js/index.js', $currentDirectoryPath, get_template_directory_uri());
$svgs_sprite_url = getFileUrl('/src/assets/svgs-sprite.svg', $currentDirectoryPath, get_template_directory_uri());

// réseaux sociaux
$instagramUrl = "https://www.instagram.com/jegwell/";
$tikTokUrl = "https://www.tiktok.com/@jegwell";
$facebookUrl = "https://www.facebook.com/jegwell";

// pages
$basket_url = $_ENV['WP_HOME'] . '/panier';
$categories_url = $_ENV['WP_HOME'] . '/#catégories';
$home_url = $_ENV['WP_HOME'] . '/';
$products_url = $_ENV['WP_HOME'] . '/produits';

?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="<?php echo $main_css_url ?>">
    <link rel="stylesheet" href="<?php echo $page_css ?>">
    <link rel="icon" type="image/x-icon" href="<?php echo $favicon_file_url ?>">

    <script type="module" src="<?php echo $index_js_url ?>" type="text/html"></script>

    <!-- Wordpress en-dessous-->
    <?php
    wp_head();
    ?>

    <title><?php echo $page_title ?></title>
</head>

<body id="topOfThePage">
    <header class="primary-header-wrapper <?php echo $_SERVER['REQUEST_URI'] == '/' ? 'primary-header-wrapper--home' : '' ?>">
        <nav class="primary-header" aria-labelledby="primary-navigation">
            <div class="main-menu" id="main-menu">
                <button class="close-button" id="main-menu-close-button" value="default">
                    <svg class="close-button__cross-icon">
                        <use href="<?php echo $svgs_sprite_url . '#cross' ?>" />
                    </svg>
                </button>
                <ul class="main-menu__list">
                    <?php
                    $pages = array("accueil" => $home_url, "nos créations" => $products_url, "catégories" => $categories_url, "panier" => $basket_url,);

                    reset($pages);
                    foreach ($pages as $page => $url) {
                        echo "<li class='main-menu__item' data-request-uri='/$page'><a class='main-menu__link' href='$url'>$page</a></li>";
                    }
                    ?>
                </ul>
            </div>
            <button class="burger-button" id="burger-button">
                <span class="burger-button__slice"></span>
                <span class="burger-button__slice"></span>
                <span class="burger-button__slice"></span>
            </button>
            <a class="brand-wrapper" href='<?php echo $_ENV['WP_HOME'] ?>'>
                <div class="brand">
                    <div class="logo">
                        <div class="logo__image">
                            <svg class="logo__svg">
                                <use href="<?php echo $svgs_sprite_url . '#rings' ?>" />
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
                    <use href="<?php echo $svgs_sprite_url . '#basket' ?>" />
                </svg>
            </a>
        </nav>
    </header>