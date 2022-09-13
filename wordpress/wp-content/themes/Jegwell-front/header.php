<?php
include get_template_directory_uri() . '/jegwell-functions.php';

use function Jegwell\functions\getAbsoluteAndDomainPath;

$currentDirectoryPath = dirname(__FILE__);
$main_css_paths = getAbsoluteAndDomainPath('/src/main.css', $currentDirectoryPath);
$favicon_file_paths = getAbsoluteAndDomainPath('/src/assets/favicon.ico', $currentDirectoryPath);
$rings_svg_paths = getAbsoluteAndDomainPath('/src/assets/rings.svg', $currentDirectoryPath);

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="<?php echo $main_css_paths['domain'] . '?' . filemtime($main_css_paths['absolute'])  ?>">
    <link rel="icon" type="image/x-icon" href="<?php echo $favicon_file_paths['domain'] . '?' . filemtime($favicon_file_paths['absolute']); ?>">

    <!-- Wordpress en-dessous-->
    <?php
    wp_head();
    ?>

    <!-- code spécifique à la page courante -->
    <title><?php echo $page_title ?></title>
</head>

<body>
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
                            <img src="<?php echo $rings_svg_paths['domain'] . '?' . filemtime($rings_svg_paths['absolute']); ?>" alt="" role="img">
                        </div>
                    </div>
                    <div class="brand__text">
                        <span class="brand__name">JEGWELL</span>
                        <span class="brand__name brand__name--slogan">BIJOUX FAITS-MAIN</span>
                    </div>
                </div>
            </a>
            <a class="basket-icon-wrapper" href='<?php echo $_ENV['WP_HOME'] ?>/panier'>
                <?php include 'src/assets/basket.svg'; ?>
            </a>
        </nav>
    </header>