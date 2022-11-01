<?php
include_once 'src/utils/functions.php';

use function Jegwell\functions\getFileUrl;
use Sanity\Client as SanityClient;

// images
$hero_img_url = getFileUrl('/src/assets/images/hero.webp', dirname(__FILE__) . '/src/assets/images/hero.webp');
$earing_picture_url = getFileUrl('/src/assets/images/boucle-d-oreilles.webp', dirname(__FILE__) . '/src/assets/images/boucle-d-oreilles.webp');
$necklace_picture_url = getFileUrl('/src/assets/images/collier.webp', dirname(__FILE__) . '/src/assets/images/collier.webp');
$ring_picture_url = getFileUrl('/src/assets/images/bague.webp', dirname(__FILE__) . '/src/assets/images/bague.webp');
$subscription_picture_url = getFileUrl('/src/assets/images/abonnement.webp', dirname(__FILE__) . '/src/assets/images/abonnement.webp');
$bracelet_picture_url = getFileUrl('/src/assets/images/bracelet.webp', dirname(__FILE__) . '/src/assets/images/bracelet.webp');
$jewelry_box_picture_url = getFileUrl('/src/assets/images/boite-a-bijoux.webp', dirname(__FILE__) . '/src/assets/images/boite-a-bijoux.webp');

$page_css = getFileUrl('/src/css/home.css', dirname(__FILE__) . '/src/css/home.css');


$page_title = 'Jegwell | Accueil';
include 'src/components/header.php'; // contient le code pour lire les variables d'environnement

$sanity = new SanityClient([
    'projectId' => $_ENV['SANITY_PROJECT_ID'],
    'dataset' => 'production',
    'apiVersion' => $_ENV['SANITY_API_VERSION'],
    'token' => $_ENV['SANITY_TOKEN_TO_READ'],
]);
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

    <section class="section" id="catégories">
        <h2 class="section__h2">NOS CATÉGORIES</h2>
        <ul class="categories">
            <?php
            $categories = $sanity->fetch('
                *[_type == "category"]{    
                    name,
                    "slug": slug.current,
                    "image_url": image.asset->url
                }
            ');

            foreach ($categories as $category) {
                $name = $category['name'];
                $category_url = $_ENV['HOME'] . '/creations?categories=' . $category['slug'];
                $picture_url = $category['image_url'] . '?h=200&w=200&fit=crop';

                echo "<li class=\"categories__item\">
                        <a class=\"categories__link\" href=\"$category_url\">
                        <figure class=\"categories__content\">
                            <img class=\"categories__image\" src=\"$picture_url\" alt=\"$name\">
                            <figcaption class=\"categories__description\">$name</figcaption>
                        </figure>
                        </a>
                     </li>";
            }
            ?>
        </ul>
    </section>

</main>

<?php
include 'src/components/footer.php';
