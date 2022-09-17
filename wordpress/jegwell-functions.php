<?php

namespace Jegwell\functions;

//Import PHPMailer classes into the global namespace
use PHPMailer\PHPMailer\PHPMailer;

$root_level = 2;

/**
 * Initialise Sentry.io
 * 
 *
 * @param string $dsn string fourni par sentry
 * @param string $environment production ou development
 * 
 * @return array array("status" => "success/fail", "email?" => "success/fail")
 */
function initializeSentry($dsn, $environment)
{

  try {
    if (gettype($dsn) !== "string" or strlen($dsn) < 1) {
      throw new \Error("The Sentry dsn given is not a string");
    }

    // Initialise Sentry.io
    \Sentry\init(['dsn' => $dsn, 'environment' => $environment,]);

    return array("status" => "success");
  } catch (\Throwable $th) {

    $body = "
    <div>Message:{$th->getMessage()}</div></br>
    <div>File:{$th->getFile()}</div></br>
    <div>Line:{$th->getLine()}</div></br>
    <div>Code:{$th->getCode()}</div>
     ";
    $subject = 'Erreur lors de l\'initialisation de Sentry.io';

    $emailStatus = emailOurDevAboutError($body, $subject);

    return array("status" => "fail", "email" => $emailStatus);
  }
}

/**
 * ajoute/crée un fichier de log avec le message fourni en argument
 * 
 *
 * @param string $subject sujet du mail
 * @param string $body le message à envoyer 
 * 
 * @return string 'success' ou 'fail'
 */

function emailOurDevAboutError($body, $subject)
{
  //Create a new PHPMailer instance
  $mail = new PHPMailer(true);

  try {
    //Server settings
    $mail->SMTPDebug = 0; // 0 désactive l'output verbeux de debug et SMTP::DEBUG_SERVER l'active.
    $mail->isSMTP(); //Send using SMTP
    $mail->Host       = 'smtp.gmail.com'; //Set the SMTP server to send through
    $mail->SMTPAuth   = true; //Enable SMTP authentication
    $mail->Username   = $_ENV['MAIL_USERNAME']; //SMTP username
    $mail->Password   = $_ENV['MAIL_PASSWORD']; //SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; //Enable implicit TLS encryption
    $mail->Port       = 465; //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

    //Recipients
    $mail->setFrom($_ENV['MAIL_USERNAME'], 'Jegwell Bot');
    $mail->addAddress($_ENV['MAIL_USERNAME'], 'Myself');     //Add a recipient

    //Content
    $mail->isHTML(true); //Set email format to HTML
    $mail->Subject = $subject;
    $mail->Body    = $body;

    $mail->send();
    return "success";
  } catch (\Exception $e) {
    addToLogs("error", $mail->ErrorInfo);
    return "fail";
  }
}

/**
 * ajoute/créer un fichier de log avec le message fourni en argument
 * 
 *
 * @param string $type si vous savez pas mettez null
 * @param string $message à ajouter aux logs
 * @param string $root_level 
 * 
 * @return void
 */

function addToLogs($type = "error", $message, $root_level = 2)
{
  $type = strtolower($type);
  $logPath  = dirname(__DIR__, $root_level) . "/code/logs/{$type}-logs.log";
  date_default_timezone_set('Europe/Paris');
  $todayRaw = new \DateTime;
  $today = $todayRaw->format('d-m-Y H:i:s');
  $previousContent = file_exists($logPath) ? file_get_contents($logPath) : '';
  $text = "${today} | {$todayRaw->getTimezone()->getName()} time:-----------------------------\n$message \n" . $previousContent;

  // vu que le mode w de fopen tronque le contenu du fichier, on doit l'ouvrir après file_get_contents()
  if (!$openedFile = fopen($logPath, 'w')) {
    throw new \Exception("Cannot open ${type}-logs.log file");
    exit;
  }

  if (fwrite($openedFile, $text) == FALSE) {
    throw new \Exception("Cannot write ${type}-logs.log file");
    exit;
  }

  fclose($openedFile);
}


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
