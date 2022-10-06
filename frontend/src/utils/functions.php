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
