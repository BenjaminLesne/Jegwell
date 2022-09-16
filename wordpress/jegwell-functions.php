<?php

namespace Jegwell\functions;

//Import PHPMailer classes into the global namespace
use PHPMailer\PHPMailer\PHPMailer;

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
    $subject = 'JUSTATEST: Erreur lors de l\'initialisation de Sentry.io';

    $emailStatus = emailOurDevAboutError($body, $subject);

    return array("status" => "fail", "email" => $emailStatus);
  }
}

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

function addToLogs($type = "error", $message)
{
  $type = strtolower($type);
  $logPath  = dirname(__DIR__) . "/logs/{$type}-logs.log";
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

  if (fwrite($openedFile, $text) === FALSE) {
    throw new \Exception("Cannot write ${type}-logs.log file");
    exit;
  }

  fclose($openedFile);
}


function getFileUrl($relativePathToFile, $currentDirectoryPath)
{
  // filemtime ne fonctionne uniquement qu'avec un chemin absolue /home/John/path/ et non http://localhost:8080/path/
  // le chemin sans nom de domaine ne fonctionne pas pour le href... donc on utilise un deuxieme chemin.

  $absolute_path = $currentDirectoryPath . $relativePathToFile;
  $domain_path = get_template_directory_uri() . $relativePathToFile;

  return $domain_path . '?' . filemtime($absolute_path);
}
