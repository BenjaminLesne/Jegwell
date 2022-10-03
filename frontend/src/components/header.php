<?php

/** @desc this loads the composer autoload file */
require_once dirname(__DIR__, 2) . '/vendor/autoload.php';

/** @desc this instantiates Dotenv and passes in our path to .env */
$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 3));
$dotenv->load();

\Sentry\init(['dsn' => $_ENV['SENTRY_PHP_DSN'], 'environment' => $_ENV['ENV'],]);

require_once dirname(__DIR__, 2) . '/src/utils/functions.php';

use function Jegwell\functions\getFileUrl;

// fichiers
$main_css_url = getFileUrl('/src/css/main.css', dirname(__FILE__, 2) . '/css/main.css');
$favicon_file_url = getFileUrl('/src/assets/favicon.ico', dirname(__FILE__, 2) . '/assets/favicon.ico');
$index_js_url = getFileUrl('/src/js/index.js', dirname(__FILE__, 2) . '/js/index.js');
$svgs_sprite_url = getFileUrl('/src/assets/svgs-sprite.svg', dirname(__FILE__, 2) . '/assets/svgs-sprite.svg');

// réseaux sociaux
$instagramUrl = "https://www.instagram.com/jegwell/";
$tikTokUrl = "https://www.tiktok.com/@jegwell";
$facebookUrl = "https://www.facebook.com/jegwell";

// pages
$basket_url = $_ENV['HOME'] . '/panier';
$categories_url = $_SERVER['REQUEST_URI'] == '/' ? '#catégories' : $_ENV['HOME'] . '#catégories';
$home_url = $_ENV['HOME'] . '/';
$products_url = $_ENV['HOME'] . '/creations';

?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="<?php echo $main_css_url ?>">
    <?php
    if (isset($page_css)) { ?>
        <link rel='stylesheet' href="<?php echo $page_css ?>">
    <?php
    }
    ?>
    <link rel="icon" type="image/x-icon" href="<?php echo $favicon_file_url ?>">

    <script type="module" src="<?php echo $index_js_url ?>" type="text/html"></script>

    <title><?php echo $page_title ?? 'Jegwell' ?></title>
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
            <a class="brand-wrapper" href='<?php echo $_ENV['HOME'] ?>'>
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
            <a class="basket-icon-wrapper" href='<?php echo $_ENV['HOME'] ?>/panier'>
                <svg class="basket-icon">
                    <use href="<?php echo $svgs_sprite_url . '#basket' ?>" />
                </svg>
            </a>
        </nav>
    </header>