<?php

namespace Jegwell\functions;

use Error;
use Sanity\Client as SanityClient;

/**
 * retourne une url contenant un numéro de version basé sur la date de modification du fichier, cela permet d'optimiser le cache navigateur.
 * 
 * type d'url retournée: http://[domaine].[extension]/[votre fichier]?[date de dernière modification].
 *
 * @param string $relativePathToFile 
 * 
 * @return string URL ex: http://jegwell.fr/myStyle.css?123456
 */
function getFileUrl($relativePathToFile, $absolutePath)
{
    try {

        return $relativePathToFile . '?' . filemtime($absolutePath);
    } catch (\Exception $exception) {

        if ($_ENV['ENV'] == 'production') {

            \Sentry\captureException($exception);
        }

        if ($_ENV['ENV'] == 'development') {

            throw $exception;
        }
    }




    // l'url ne fonctionne que si le nom de domaine est inclu

}

/**
 * retourne le html de la modal sous forme de string.
 *
 * @param string $modalId 
 * @param string $title 
 * @param array $items 
 * 
 * @return string le html de la modal
 */
function createProductsPageModal($modalId, $title, $items, $url_key)
{

    $svgs_sprite_url = getFileUrl('../assets/svgs-sprite.svg', dirname(__FILE__, 2) . '/assets/svgs-sprite.svg');

    $first_part = "
    <dialog class=\"modal\" id=\"$modalId\">
        <button class=\"close-button close-button--modal\">
        <svg class=\"close-button__cross-icon close-button__cross-icon--modal\">
            <use href=\"$svgs_sprite_url#cross\" />
        </svg>
        </button>
        <section>
            <h2 class=\"modal__title\">$title</h2>
            <ul>
                ";
    $second_part = '';
    foreach ($items as $item) {
        $url_parameters = http_build_query(array_merge($_GET, array($url_key => $item['slug'])));
        $current_url = explode("?", $_SERVER['REQUEST_URI'])[0];
        $second_part = $second_part . "
            <li class=\"modal__item\"><a class=\"modal__link\" href=\"$current_url?$url_parameters\">$item[name]</a></li>
            ";
    }
    $third_part = '      
            </ul>
        </section>
    </dialog>';

    return $first_part . $second_part . $third_part;
}


/**
 * retourne le html de la modal des options sous forme de string.
 *
 * @param string $productId 
 * @param array $productOptions 
 * @param string $alt 
 * @param string $svgs_sprite_url 
 * 
 * @return string le html de la modal
 */
function createOptionsModal($productId, $product_default_image_url, $productOptions, $alt, $svgs_sprite_url)
{
    $first_part = "
    <dialog class=\"modal optionsModal\" data-product-id=\"$productId\">
        <button class=\"close-button close-button--modal\">
            <svg class=\"close-button__cross-icon close-button__cross-icon--modal\">
                <use href=\"$svgs_sprite_url#cross\" />
            </svg>
        </button>
        <section>
            <h2 class=\"modal__title\">Choisissez votre option :</h2>
            <ul class=\"product-options-wrapper\">
                <li>
                    <button class=\"product-option-wrapper\" data-product-option=\"default\" data-product-id=\"$productId\">
                        <article class=\"product-option\" data-product-option=\"default\">
                            <div class=\"product-option__image-wrapper\">
                                <img src=\"$product_default_image_url\" alt=\"Défaut\">
                            </div>
                            <h3 class=\"product-option__name\">Défaut</h3>
                        </article>
                    </button>
                </li>
            ";

    $second_part = "";
    foreach ($productOptions as $option) {
        $second_part = $second_part . "
                <li>
                    <button  class=\"product-option-wrapper\" data-product-option=\"$option[name]\" data-product-id=\"$productId\">
                        <article class=\"product-option\">
                            <div class=\"product-option__image-wrapper\">
                                <img src=\"$option[image_url]\" alt=\"$alt\">
                            </div>
                            <h3 class=\"product-option__name\">$option[name]</h3>
                        </article>
                    </button>
                </li>
                    ";
    }
    $third_part = "  
            </ul>
            <button class=\"main-call-to-action\">Confirmer</button>
        </section>
    </dialog>";

    return $first_part . $second_part . $third_part;
}

/**
 * retourne le montant total items + livraison en centimes d'euros, exemple: 14€ = 1400.
 *
 * @param object $order 
 * 
 * @return int le montant total en centime d'euros
 */
function calculateOrderAmount($order, $ENV): int
{
    $products_to_basket = $order->products;

    $wanted_ids = '';

    foreach ($products_to_basket as $wanted_product) {
        $wanted_id = $wanted_product->id;

        if (str_contains($wanted_ids, $wanted_id) == false) {
            $previous_ids = $wanted_ids === '' ? '' : ", $wanted_id";
            $wanted_ids = "'$wanted_id' $previous_ids";
        }
    }

    if ($wanted_ids !== '' and isset($order->deliveryOption)) {
        $sanity = new SanityClient([
            'projectId' => $ENV['SANITY_PROJECT_ID'],
            'dataset' => 'production',
            'apiVersion' => $ENV['SANITY_API_VERSION'],
            'token' => $ENV['SANITY_TOKEN_TO_READ'],
        ]);

        $query_products = "
                *[_id in [$wanted_ids]]{    
                    name,
                    price,
                    'slug': slug.current,
                    'image_url': image.asset->url,
                    'options': options[]{'name': name, 'image_url': image.asset->url},
                    'id': _id,
                    categories,
                    'categories4': *[_type=='category' && _id==categories[]._ref]{ 
                        name,
                      }
                }
            ";
        $query_delivery_option = "
                *[_type == 'deliveryOption' && _id == '$order->deliveryOption']{    
                    price,
                    }
            ";



        $products = $sanity->fetch($query_products);
        $delivery_option = $sanity->fetch($query_delivery_option);

        $subtotal_price = 0;
        $delivery_fee = $delivery_option['price'];


        foreach ($products as $product) {

            foreach ($products_to_basket as $basket_product) {
                // récupère la position des objets dans le panier contenant l'id du produit
                if ($basket_product->id === $product['id']) {

                    $quantity = $basket_product->quantity;
                    // prix total = subtotal + frais de livraison
                    $subtotal_price += ($product['price'] * $quantity);
                }
            }
        }

        $total_price = $subtotal_price + $delivery_fee;
        return ($total_price * 100);
    };
    $error_message = "calculateOrderAmount failed. deliveryOption: $order->deliveryOption | \$wanted_ids: $wanted_ids ";
    throw new Error($error_message);
}
