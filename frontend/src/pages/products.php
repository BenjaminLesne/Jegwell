<?php
include_once dirname(__FILE__, 2) . '/utils/functions.php';

use function Jegwell\functions\getFileUrl;
use function Jegwell\functions\createProductsPageModal;
use Sanity\Client as SanityClient;

$page_css = getFileUrl('/src/css/products.css', dirname(__FILE__, 2) . '/css/products.css');
$page_js = getFileUrl('/src/js/pages/products.js', dirname(__FILE__, 2) . '/js/pages/products.js');

$page_title = 'Jegwell | Créations';
include '../components/header.php'; // contient le code pour lire les variables d'environnement

$sanity = new SanityClient([
    'projectId' => $_ENV['SANITY_PROJECT_ID'],
    'dataset' => 'production',
    'apiVersion' => $_ENV['SANITY_API_VERSION'],
    'token' => $_ENV['SANITY_TOKEN_TO_READ'],
]);

$current_categorie = 'Toutes';
if (isset($_GET['categories'])) {

    $sanitized_GET_categorie = htmlspecialchars($_GET['categories']);
    switch ($sanitized_GET_categorie) {
        case 'boucles-d-oreilles':
            $current_categorie = 'Boucles d\'oreilles';
            break;

        case 'boite-a-bijoux':
            $current_categorie = 'Boite à bijoux';
            break;

        default:
            $current_categorie = $sanitized_GET_categorie;

            break;
    }
}

$current_sort = 'Popularité';
if (isset($_GET['trier'])) {

    $sanitized_GET_sort = htmlspecialchars($_GET['trier']);
    switch ($sanitized_GET_sort) {
        case 'nom-a-z':
            $current_sort = 'Nom A-Z';
            break;

        case 'nom-z-a':
            $current_sort = 'Nom Z-A';
            break;

        case 'prix-le-plus-bas':
            $current_sort = 'prix le + bas';
            break;

        case 'prix-le-plus-haut':
            $current_sort = 'prix le + haut';
            break;

        default:
            $current_sort = $sanitized_GET_sort;

            break;
    }
}
?>

<main>
    <section class="section">
        <h1 class="section__h2">NOS CRÉATIONS</h1>
        <div class="filters">
            <button class="input-wrapper filter" id="categoriesButton" data-modal="categoriesModal">
                <div class="input filter__content-wrapper" data-label="Catégories">
                    <span class="filter__text"><?php echo $current_categorie; ?></span>
                    <div class="caret"></div>
                </div>
            </button>

            <button class="input-wrapper filter" id="sort" data-modal="sortModal">
                <div class="input filter__content-wrapper" data-label="Trier">
                    <span class="filter__text"><?php echo $current_sort; ?></span>
                    <div class="caret"></div>
                </div>
            </button>
        </div>

        <div class="products">
            <?php

            $sortValue = '';
            if (isset($_GET['trier'])) {
                switch ($_GET['trier']) {
                        // case 'nom-a-z':
                        //     $sortValue = " | order(name)";
                        //     break;
                    case 'nom-z-a':
                        $sortValue = 'name desc';
                        break;
                    case 'prix-le-plus-bas':
                        $sortValue = 'price';
                        break;
                    case 'prix-le-plus-haut':
                        $sortValue = 'price desc';
                        break;

                    default:
                        // trier par ordre alphabétique par défaut
                        $sortValue = 'name';
                        break;
                }
            }
            $categoriesFilter = '';
            if (isset($_GET['categories'])) {

                $categoriesFilter = " && count((categories[]->slug.current)[@ in [\"$_GET[categories]\"]]) > 0";
            }

            $sortFilter = $sortValue == '' ? '' : " | order($sortValue)";

            $query = "
                    *[_type == 'product' $categoriesFilter] $sortFilter{    
                        name,
                        'slug': slug.current,
                        'image_url': image.asset->url,
                        price,
                        options,
                        _id
                    }";


            $products = $sanity->fetch($query);

            $products_amount = $products ? count($products) : 0;
            if ($products_amount > 0) {

                foreach ($products as $product) {
                    $options_amount = $product['options'] ? count($product['options']) : 0;
                    $options_html = $options_amount > 0 ? "data-options='$options_amount'" : '';
                    $product_page_url = $_ENV['HOME_PAGE'] . '/creations/' . $product['slug'];
                    $image_url =  $product['image_url'];
                    $product_name = $product['name'];
                    $price = $product['price'];
                    $product_id = $product['_id'];

                    echo "<article class='product'>
                    <a class='product__image-wrapper' href='$product_page_url' $options_html>
                        <img class='product__image' src='$image_url' alt='$product_name'>
                    </a>
                    <div class='product__information'>
                        <a class='product__name' href='$product_page_url'>
                            <span>$product_name</span>
                        </a>
                        <span class='product__price'>$price €</span>
                        <button class='product__call-to-action-wrapper' data-product-id=\"$product_id\" data-product-option=\"default\">
                        <span class='product__call-to-action'>Ajouter au panier<span class='product__success-message'>Ajouté &#10003;</span></span>
                        
                        </button>
                    </div>
                  </article>";
                }
            } else {
            ?>
                <div class="no-product">
                    <p class="no-product__message">Il n'y en a pas pour l'instant mais c'est pour bientôt !</p>
                </div>
            <?php
            }
            ?>

    </section>
    <?php
    // bloc concernant la pagination
    $total_pages = ceil(count($products) / 10);

    if (false && $total_pages > 1) {

    ?>


        <div class="pagination">
            <?php
            $previous_page = 1;
            $next_page = 1;
            $current_page_index = 1;
            if (isset($_GET['page'])) {
                $theoretical_previous_page = $_GET['page'] - 1;
                $previous_page =  $theoretical_previous_page < 1 ? 1 : $theoretical_previous_page;

                $theoretical_next_page = $_GET['page'] - 1;
                $next_page =  $theoretical_next_page > $total_pages  ? 1 : $next_previous_page;

                $current_page_index = $_GET['page'];
            }


            $url_parameters = http_build_query(array_merge($_GET, array('page' => 'new_page_to_set')));
            $current_url = explode("?", $_SERVER['REQUEST_URI'])[0];
            $previous_page_link = $current_url . '?' . str_replace('new_page_to_set', $previous_page, $url_parameters);
            $next_page_link = $current_url . '?' . str_replace('new_page_to_set', $next_page, $url_parameters);
            ?>
            <a href="<?php echo $previous_page_link ?>" class="pagination__item-wrapper pagination__arrow-wrapper">
                <div class="pagination__arrow pagination__arrow--left pagination__item"></div>
            </a>

            <?php
            for ($page_index = 1; $page_index <= $total_pages; $page_index++) {
                $page_link = $current_url . '?' . str_replace('new_page_to_set', $page_index, $url_parameters);
                $additional_class = $current_page_index == $page_index ? 'pagination__item--active' : '';
                echo "<a href=\"$page_link\" class=\"pagination__item-wrapper\"><span class=\"pagination__item $additional_class\">$page_index</span></a>";
            }
            ?>

            <a href="<?php echo $next_page_link ?>" class="pagination__item-wrapper pagination__arrow-wrapper">
                <div class="pagination__arrow pagination__arrow--right pagination__item"></div>
            </a>
        </div>

    <?php
    }
    // modals de la page :

    $categories = $sanity->fetch('
    *[_type == "category"]{    
        name,
        "slug": slug.current,
    }
');

    $sort_options = array(
        array('name' => 'Nom A-Z', 'slug' => 'nom-a-z'),
        array('name' => 'Nom Z-A', 'slug' => 'nom-z-a'),
        array('name' => 'Prix le plus bas', 'slug' => 'prix-le-plus-bas'),
        array('name' => 'Prix le plus haut', 'slug' => 'prix-le-plus-haut'),

    );

    // on affiche le html retourné par la fonction. Nous avons maintenant 2 magnifiques modal dans notre DOM.
    echo createProductsPageModal('categoriesModal', 'Choisissez une catégorie :', $categories, 'categories');
    echo createProductsPageModal('sortModal', 'Trier par :', $sort_options, 'trier');
    ?>




</main>

<?php
include '../components/footer.php';
