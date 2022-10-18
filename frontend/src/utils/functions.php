<?php

namespace Jegwell\functions;


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
