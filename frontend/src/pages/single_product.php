<?php
include_once dirname(__FILE__, 2) . '/utils/functions.php';

use function Jegwell\functions\getFileUrl;
use function Jegwell\functions\createOptionsModal;
use Sanity\Client as SanityClient;

$page_css = getFileUrl('/src/css/single_product.css', dirname(__FILE__, 2) . '/css/single_product.css');
$page_js = getFileUrl('/src/js/pages/single_product.js', dirname(__FILE__, 2) . '/js/pages/single_product.js');

$product = null;
$error = null;
// get product based on ID given in get parameter
try {
    if (isset($_GET['slug'])) {

        $sanity = new SanityClient([
            'projectId' => $_ENV['SANITY_PROJECT_ID'],
            'dataset' => 'production',
            'apiVersion' => $_ENV['SANITY_API_VERSION'],
            'token' => $_ENV['SANITY_TOKEN_TO_READ'],
        ]);

        $product_slug_sanitized = htmlspecialchars($_GET['slug']);

        $query = "
                *[_type == 'product' && slug.current == '$product_slug_sanitized']{    
                    name,
                    price,
                    'slug': slug.current,
                    'image_url': image.asset->url,
                    'options': options[]{
                        'name': name,
                        'image_url': image.asset->url,
                    },
                    'id': _id,
                    'categories': categories[]->{
                        name
                    },
                    description,
                    'cross_sells': cross_sells[]->{
                        name,
                        price,
                        'slug': slug.current,
                        'image_url': image.asset->url,
                        options,
                        'id': _id,
                        'categories': categories[]->{
                            name
                        },
                    }
        }
        ";

        $products = $sanity->fetch($query);

        if (count($products) === 1) {
            $product = $products[0];
            $page_title = "Jegwell | $product[name]";
            include '../components/header.php'; // contient le code pour lire les variables d'environnement

        } else {
            throw new Error('Nous ne trouvons pas le produit correspondant a l\'identifiant fourni');
        }
    } else {
        throw new Error('L\'identifiant produit fourni est vide');
    }
} catch (\Throwable $th) {
    $error = $th->getMessage();
}

?>

<main>
    <?php
    if ($product != null && $error === null) {
        $categorie = $product['categories'][0]['name'];
        $main_image_alt = $categorie . ' ' . $product['name'];
        $total_slides = 1;
        $option_images_html = '';
        $number_of_options = $product['options'] ? count($product['options']) : 0;
        if ($number_of_options > 0) {

            foreach ($product['options'] as $option) {
                $total_slides += 1;
                $option_images_html .= "<div class=\"media-element\" data-product-option=\"$option[name]\">
                <img src=\"$option[image_url]\" alt=\"$categorie $product[name] option $option[name]\">
            </div>";
            }
        }

        $option_image_alternative = $categorie . $product['name'];

        $price_exploded =  explode('.', $product['price']);
        $price_integer = $price_exploded[0];
        $price_decimal = isset($price_exploded[1]) ? "<span class=\"price__decimal\">,$price_exploded[1]</span>" : '';
        $price_html = $price_integer . $price_decimal . ' €';

        $option_selected_sanitized = isset($_GET['option']) ? htmlspecialchars($_GET['option']) : 'default';

        // generate options modal
        echo createOptionsModal($product['id'], $product['image_url'], $product['options'], $option_image_alternative, $svgs_sprite_url);
    ?>
        <section class="">
            <h1 class="section__h2 screenreader"><?php echo $product['name'] ?></h1>
            <div class="content">
                <div class="media-scroller-wrapper" data-current-slide-index="1" data-total-slides="<?php echo $total_slides ?>">
                    <div class="media-scroller snaps-inline">
                        <div class="media-element" data-product-option="default">
                            <img src="<?php echo $product['image_url'] ?>" alt="<?php echo $main_image_alt ?>">
                        </div>

                        <?php
                        echo $option_images_html;
                        ?>
                    </div>
                    <div class="media-scroller-wrapper__buttons">
                        <button class="media-scroller-wrapper__button media-scroller-wrapper__button--left">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                            </svg>
                        </button>
                        <button class="media-scroller-wrapper__button media-scroller-wrapper__button--right">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="section information-wrapper">
                    <div class="information section--basket">
                        <div class="information__top">
                            <span class="information__product-name"><?php echo $product['name'] ?></span>
                            <span class="information__product-price"><?php echo $price_html ?></span>
                        </div>
                        <div class="description">
                            <p><?php echo $product['description'] ?></p>
                            <!-- <div class="description__see-more-wrapper">
                            <div>
                                <button class="description__see-more">
                                    <span class="description__inner-button">VOIR PLUS<span>
                                </button>
                            </div>
                        </div> -->
                        </div>

                        <div class="information__settings">
                            <button class="setting setting--option" data-product-id='<?php echo $product['id'] ?>' data-product-option='<?php echo $option_selected_sanitized ?>'>
                                <span class="setting__key">Option:</span>
                                <div class="setting__value">
                                    <span class="setting__value-span"><?php echo $option_selected_sanitized ?></span>
                                    <div class="caret caret--basket"></div>
                                </div>
                            </button>
                            <button class="setting setting--quantity" data-quantity='1' data-product-id='<?php echo $product['id'] ?>' data-product-option='<?php echo $option_selected_sanitized ?>'>
                                <span class="setting__key">Quantité:</span>
                                <div class="setting__value">
                                    <span class="setting__value-span">1</span>
                                    <div class="caret caret--basket"></div>
                                </div>
                            </button>
                        </div>

                        <button class="product__call-to-action-wrapper main-call-to-action information__add-to-basket" data-product-id='<?php echo $product['id'] ?>' data-product-option='<?php echo $option_selected_sanitized ?>' data-product-quantity="1">
                            <span>Ajouter au panier<span class="product__success-message">Ajouté ✓</span></span>
                        </button>

                    </div>
                </div>
            </div>
            <?php
            $number_of_cross = $product['cross_sells'] ? $product['cross_sells'] : 0;
            if ($number_of_cross > 0) {

            ?>
                <section class="cross-sells section">
                    <h2 class="section__h2 cross-sells__heading">Produits similaires</h2>
                    <ul class="cross-sells__products products">
                        <?php
                        foreach ($product['cross_sells'] as $cross_product) {
                            $cross_product_link = $_ENV['HOME_PAGE'] . '/creations/' . $cross_product['slug'];
                            $cross_product_options_amount = $cross_product['options'] ? count($cross_product['options']) : 0;
                            $cross_product_image_alt = $cross_product['categories'][0]['name'] . ' ' . $cross_product['name'];
                            $dataOptionHtml = $cross_product_options_amount > 0 ? "data-options='$cross_product_options_amount'" : '';
                        ?>
                            <li class="cross-sells__product-wrapper">
                                <article class="product cross-sells__product">
                                    <a class="product__image-wrapper" href="<?php echo $cross_product_link ?>" <?php echo $dataOptionHtml ?>>
                                        <img class="product__image" src="<?php echo $cross_product['image_url'] ?>" alt="<?php echo $cross_product_image_alt ?>">
                                    </a>
                                    <div class="product__information">
                                        <a class="product__name" href="<?php echo $_ENV['HOME_PAGE'] . '/creations/' . $cross_product['slug'] ?>">
                                            <span><?php echo $cross_product['name'] ?></span>
                                        </a>
                                        <span class="product__price"><?php echo $cross_product['price'] ?> €</span>
                                        <button class="product__call-to-action-wrapper" data-product-id="<?php echo $cross_product['id'] ?>" data-product-option="default">
                                            <span class="product__call-to-action">Ajouter au panier<span class="product__success-message">Ajouté ✓</span></span>
                                        </button>
                                    </div>
                                </article>
                            </li>
                        <?php
                        }
                        ?>
                    </ul>


                </section>

            <?php
            }
            ?>

        </section>

    <?php
    } else {
        echo "<div class=\"error\">
            <p>Une erreur est survenue !</p>
            <p>$error</p>
        </div>";
    }
    ?>
    <dialog class="modal" id="quantityModal">
        <button class="close-button close-button--modal">
            <svg class="close-button__cross-icon close-button__cross-icon--modal">
                <use href="<?php echo $svgs_sprite_url . '#cross' ?>" />
            </svg>
        </button>
        <section>
            <h2 class="modal__title">Choisissez votre quantité:</h2>
            <div class="quantity-setter">
                <button>
                    <div class="quantity-setter__button">
                        <div class="minus"></div>
                    </div>
                </button>
                <span class="quantity-setter__value" data-quantity="1">1</span>
                <button>
                    <div class="quantity-setter__button">
                        <svg class="close-button__cross-icon close-button__cross-icon--modal plus">
                            <use href="<?php echo $svgs_sprite_url . '#cross' ?>" />
                        </svg>
                    </div>
                </button>
            </div>
            <button class="main-call-to-action">Confirmer</button>
        </section>
    </dialog>

</main>

<?php
include '../components/footer.php';
