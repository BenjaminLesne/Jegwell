<?php

namespace Jegwell\functions;


/**
 * retourne une url contenant un numéro de version basé sur la date de modification du fichier
 * 
 * type d'url retournée: http://[domaine].[extension]/[votre fichier]?[date de dernière modification].
 * 
 * exemple: http://jegwell.fr/myStyle.css?123456
 * Q: Pourquoi ne pas appeler get_template_uri() dans la fonction plutôt que de le demander en argument ? R: Afin de faciliter les tests unitaires
 *
 * @param string $relativePathToFile 
 * @param string $currentDirectoryPath peut être généré avec dirname(__FILE__)
 * @param string $root_theme_directory peut être généré avec get_template_uri()
 * 
 * @return string URL ex: http://jegwell.fr/myStyle.css?123456
 */
function getFileUrl($relativePathToFile, $currentDirectoryPath, $root_theme_directory)
{
  $version = "";
  try {

    $absolute_path = $currentDirectoryPath . $relativePathToFile;
    $domain_path = $root_theme_directory . $relativePathToFile;
    $version = filemtime($absolute_path); // fonctionne uniquement avec le chemin absolue (ex: /home/John/path/ et non http://localhost:8080/path/)

  } catch (\Exception $exception) {

    if ($_ENV['WORDPRESS_ENV'] == 'production') {

      \Sentry\captureException($exception);
    }

    if ($_ENV['WORDPRESS_ENV'] == 'development') {

      throw $exception;
    }
  }




  // l'url ne fonctionne que si le nom de domaine est inclu
  return $domain_path . '?' . $version;
}
