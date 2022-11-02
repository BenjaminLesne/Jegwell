<?php
include_once dirname(__FILE__, 2) . '/utils/functions.php';

use function Jegwell\functions\getFileUrl;
use function Jegwell\functions\createOptionsModal;
use Sanity\Client as SanityClient;

$page_css = getFileUrl('/src/css/basket.css', dirname(__FILE__, 2) . '/css/basket.css');
$page_js = getFileUrl('/src/js/pages/basket.js', dirname(__FILE__, 2) . '/js/pages/basket.js');

$page_title = 'Jegwell | Panier';
include '../components/header.php'; // contient le code pour lire les variables d'environnement
?>

<main>
    <section class="section section--basket">
        <h1 class="section__h2">VOTRE PANIER</h1>
        <section>
            <h2 class="screenreader">VOS ITEMS</h2>
            <ul class="basket">
                <?php
                $wanted_ids = '';
                $products_to_basket = null;
                if (isset($_COOKIE["productsToBasket"])) {

                    $products_to_basket = json_decode($_COOKIE["productsToBasket"]);

                    foreach ($products_to_basket as $wanted_product) {
                        $wanted_id = $wanted_product->id;

                        if (str_contains($wanted_ids, $wanted_id) == false) {
                            $previous_ids = $wanted_ids === '' ? '' : ", $wanted_id";
                            $wanted_ids = "'$wanted_id' $previous_ids";
                        }
                    }
                }

                if ($wanted_ids !== '') {
                    $sanity = new SanityClient([
                        'projectId' => $_ENV['SANITY_PROJECT_ID'],
                        'dataset' => 'production',
                        'apiVersion' => $_ENV['SANITY_API_VERSION'],
                        'token' => $_ENV['SANITY_TOKEN_TO_READ'],
                    ]);

                    $query = "
                            *[_id in [$wanted_ids]]{    
                                name,
                                price,
                                'slug': slug.current,
                                'image_url': image.asset->url,
                                'options': options[]{'name': name, 'image_url': image.asset->url},
                                'id': _id,
                                'categories': categories[]->{
                                    name
                                },
                            }
                        ";
                    //  sanity doc: https://www.sanity.io/docs/reference-type

                    $products = $sanity->fetch($query);
                    $subtotal_price = 0;
                    $total_quantity = 0;


                    foreach ($products as $product) {
                        $option_image_alternative = "$product[name]";

                        // generate options modal
                        echo createOptionsModal($product['id'], $product['image_url'], $product['options'], $option_image_alternative, $svgs_sprite_url);

                        foreach ($products_to_basket as $basket_product) {
                            // récupère la position des objets dans le panier contenant l'id du produit
                            if ($basket_product->id === $product['id']) {



                                // ajoute la quantité trouvé dans les cookies aux produits retournés par sanity
                                $quantity = $basket_product->quantity;
                                $total_quantity += $quantity;
                                $subtotal_price += ($product['price'] * $quantity);


                                $option_index = null;

                                foreach ($product['options'] as $key => $option) {

                                    if ($option['name'] == $basket_product->option) {
                                        $option_index = $key;

                                        break;
                                    }
                                }

                                $image = $product['image_url'];
                                $option_selected = ['name' => 'default'];

                                if (gettype($option_index) == 'integer') {
                                    $option_selected = $product['options'][$option_index];
                                    $image = $option_selected['image_url'];
                                }

                                $option_name = $basket_product->option === 'default' ? 'Défaut' : $basket_product->option;

                                $price_exploded =  explode('.', $product['price']);
                                $price_integer = $price_exploded[0];
                                $price_decimal = isset($price_exploded[1]) ? "<span class=\"price__decimal\">,$price_exploded[1]</span>" : '';
                                $price_html = $price_integer . $price_decimal . ' €';

                                $product_random_category = $product['categories'][0]['name'];

                                echo "
                        <li>
                            <article class=\"item\">
                                <div class=\"item__main\">
                                    <div class=\"item__image-wrapper\">
                                        <img class=\"item__image\" src=\"$image\" loading=\"lazy\" alt=\"$product_random_category $product[name]\">
                                    </div>
                                    <div class=\"item__information\">
                                        <div class=\"item__top-information\">
                                            <h3 class=\"item__name\">$product[name]</h3>
                                            <button class=\"item__remove\" data-product-id=\"$product[id]\" data-product-option=\"$option_selected[name]\">";
                ?>
                                <svg class="close-button__cross-icon close-button__cross-icon--small">
                                    <use href="<?php echo $svgs_sprite_url . '#cross' ?>" />
                                </svg>
                    <?php
                                echo "</button>
                                        </div>
                                        <button class=\"setting setting--option\" data-product-id='$product[id]' data-product-option='$option_selected[name]'>
                                            <span class=\"setting__key\">Option:</span>
                                            <div class=\"setting__value\">
                                                <span>$option_name</span>
                                                <div class=\"caret caret--basket\"></div>
                                            </div>
                                        </button>
                                        <button class=\"setting setting--quantity\" data-quantity='$quantity' data-product-id='$product[id]' data-product-option='$option_selected[name]'>
                                        <span class=\"setting__key\">Quantité:</span>
                                        <div class=\"setting__value\">
                                            <span>$quantity</span>
                                            <div class=\"caret caret--basket\"></div>
                                        </div>
                                    </button>
                                    </div>
                                </div>
                                <span class=\"item__price price\">
                                $price_html
                                </span>
                            </article>
                        </li>
                        ";
                            }
                        }
                    }


                    $subtotal_price_exploded =  explode('.', $subtotal_price);
                    $subtotal_price_integer = $subtotal_price_exploded[0];
                    $subtotal_price_decimal = isset($subtotal_price_exploded[1]) ? "<span class=\"price__decimal\">,$price_exploded[1]</span>" : '';
                    $subtotal_price_html = $subtotal_price_integer . $subtotal_price_decimal . ' €';
                    ?>
            </ul>
        </section>

        <section class="subtotal">
            <div class="subtotal__top-information">
                <h2 class="subtotal__heading">sous-total</h2>
                <?php
                    echo "
                <span class=\"price\">
                 $subtotal_price_html
                </span>
            </div>
            <span class=\"subtotal__number-of-articles\">($total_quantity articles)</span>
            ";
                ?>
        </section>
        <a href="<?php echo $delivery_url ?>" class="main-call-to-action">Passer la commande</a>
    <?php
                } else { // la suite de la condition: $wanted_ids !== '' l.30

                    echo "
                        <div class=\"center-content\">
                            <span>Vous n'avez pas d'article dans votre panier.</span>
                            <a href=\"$products_url\">Cliquez-ici pour voir nos créations !</a>
                        </div>
                        
                    ";
                }
    ?>
</main>
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



<?php
include '../components/footer.php';
