<?php
session_start();

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
$main_dekstop_css_url = getFileUrl('/src/css/desktop.css', dirname(__FILE__, 2) . '/css/desktop.css');
$favicon_file_url = getFileUrl('/src/assets/favicon.ico', dirname(__FILE__, 2) . '/assets/favicon.ico');
$index_js_url = getFileUrl('/src/js/index.js', dirname(__FILE__, 2) . '/js/index.js');
$svgs_sprite_url = getFileUrl('/src/assets/svgs-sprite.svg', dirname(__FILE__, 2) . '/assets/svgs-sprite.svg');

// réseaux sociaux
$instagramUrl = "https://www.instagram.com/jegwell/";
$tikTokUrl = "https://www.tiktok.com/@jegwell";
$facebookUrl = "https://www.facebook.com/jegwell";

// pages
$basket_url = $_ENV['HOME_PAGE'] . '/panier';
$categories_url = $_SERVER['REQUEST_URI'] == '/' ? '#catégories' : $_ENV['HOME_PAGE'] . '#catégories';
$home_url = $_ENV['HOME_PAGE'] . '/';
$products_url = $_ENV['HOME_PAGE'] . '/creations';
$delivery_url = $_ENV['HOME_PAGE'] . '/panier/livraison';

?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <?php
    if ($_ENV['ENV'] == 'development') {
        echo "<base href=\"$_ENV[HOME_PAGE]/\" />";
    };
    ?>
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
    <link rel="stylesheet" href="<?php echo $main_dekstop_css_url ?>" media="(min-width: 500px)">

    <link rel="icon" type="image/x-icon" href="<?php echo $favicon_file_url ?>">

    <!-- doit être importé en premier car contient l'initialisation de Sentry -->
    <script type="module" src="<?php echo $index_js_url ?>"></script>

    <?php
    if (isset($js_files_urls)) {
        foreach ($js_files_urls as $js_file_url) {
            echo "<script type=\"module\" src=\"$js_file_url\"></script>";
        }
    } elseif (isset($page_js)) {
        echo "<script type=\"module\" src=\"$page_js\"></script>";
    }

    if ($_ENV['ENV'] == 'development') {
        echo '<base href="http://localhost/Jegwell/frontend/" />';
    }
    ?>


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
                    <li class='main-menu__item' data-request-uri='/'>
                        <a class='main-menu__link' href='<?php echo $home_url ?>'>accueil</a>
                    </li>
                    <li class='main-menu__item' data-request-uri='/creations'>
                        <a class='main-menu__link' href='<?php echo $products_url ?>'>Nos créations</a>
                    </li>
                    <li class='main-menu__item' data-request-uri='/#categories'>
                        <a class='main-menu__link' href='<?php echo $categories_url ?>'>catégories</a>
                    </li>

                    <li class='main-menu__item' data-request-uri='/panier'>
                        <a class='main-menu__link' href='<?php echo $basket_url ?>'>Panier</a>
                    </li>
                </ul>
            </div>
            <button class="burger-button" id="burger-button">
                <span class="burger-button__slice"></span>
                <span class="burger-button__slice"></span>
                <span class="burger-button__slice"></span>
            </button>
            <a class="brand-wrapper" href='/'>
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
            <a class="basket-icon-wrapper" href='<?php echo $_ENV['HOME_PAGE'] ?>/panier'>
                <svg class="basket-icon">
                    <use href="<?php echo $svgs_sprite_url . '#basket' ?>" />
                </svg>
            </a>
        </nav>
    </header>