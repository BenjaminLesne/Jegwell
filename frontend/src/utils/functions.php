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
