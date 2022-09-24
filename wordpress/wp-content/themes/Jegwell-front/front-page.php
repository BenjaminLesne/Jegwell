<?php

use function Jegwell\functions\getFileUrl;

// images
$hero_img_url = getFileUrl('/src/assets/images/hero.webp', $currentDirectoryPath, get_template_directory_uri());
$earing_picture_url = getFileUrl('/src/assets/images/boucle-d-oreilles.webp', $currentDirectoryPath, get_template_directory_uri());
$necklace_picture_url = getFileUrl('/src/assets/images/collier.webp', $currentDirectoryPath, get_template_directory_uri());
$ring_picture_url = getFileUrl('/src/assets/images/bague.webp', $currentDirectoryPath, get_template_directory_uri());
$subscription_picture_url = getFileUrl('/src/assets/images/abonnement.webp', $currentDirectoryPath, get_template_directory_uri());
$bracelet_picture_url = getFileUrl('/src/assets/images/bracelet.webp', $currentDirectoryPath, get_template_directory_uri());
$jewelry_box_picture_url = getFileUrl('/src/assets/images/boite-a-bijoux.webp', $currentDirectoryPath, get_template_directory_uri());

$page_css = getFileUrl('/src/css/home.css', $currentDirectoryPath, get_template_directory_uri());


$page_title = 'Jegwell | Accueil';
include 'header.php';
?>


<main>
    <div class="hero">
        <img class="hero__image" src="<?php echo $hero_img_url ?>" alt="" srcset="">
        <div class="hero__text">
            <h1 class="hero__slogan">BIJOUX FAITS-MAIN</h1>
            <a class="hero__link" href="<?php echo $products_url ?>"><span class="hero__call-to-action">DÉCOUVRIR</span></a>
        </div>

    </div>
    <section class="section about-us">
        <h2 class="section__h2">QUE FAISONS-NOUS ?</h2>
        <p class="about-us__text about-us__text--first">Nous créons nos bijoux à Paris avec de l'acier inoxydable argenté, doré ou doré rose. Ils sont anti-allergéniques, ne noircissent pas la peau, sont insensibles à la rouille et l'eau.</p>
        <p class="about-us__text about-us__text--last">Le dîtes à personne mais nous faisons des commandes sur-mesure également 😉</p>
        <svg class="about-us__svg">
            <use href="<?php echo $svgs_sprite_url . '#rings' ?>" />
        </svg>
    </section>

    <section class="section">
        <h2 class="section__h2">NOS CATÉGORIES</h2>
        <ul class="categories">
            <?php
            $categories = array(
                'boucle d\'oreille' => $earing_picture_url,
                'bracelet' => $bracelet_picture_url,
                'bagues' => $ring_picture_url,
                'collier' => $necklace_picture_url,
                'boites à bijoux' => $jewelry_box_picture_url,
                'abonnement' => $subscription_picture_url
            );

            reset($categories);
            foreach ($categories as $rawCategorie => $picture_url) {
                $categorie_query = str_replace(array(' ', '\''), '-', $rawCategorie);
                $categorie = ucfirst($rawCategorie);

                echo   "<li class='categories__item'>
                            <a class='categories__link' href='$categories_url?$categorie_query'>
                            <figure class='categories__content'>
                                 <img class='categories__image' src='$picture_url' alt='$rawCategorie'>
                                 <figcaption class='categories__description'>$categorie</figcaption>
                              </figure>

                            </a>
                        </li>";
            }
            ?>
        </ul>
    </section>

</main>

<?php
include 'footer.php';
