<?php

namespace Jegwell\functions;

use Error;
use Sanity\Client as SanityClient;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

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
 * retourne le montant total items + livraison en centimes d'euros, exemple: 14euros = 1400.
 *
 * @param object $order 
 * 
 * @return int le montant total en centime d'euros
 */
function calculateOrderAmountInCents($order, $ENV): int
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
        $delivery_fee = $delivery_option[0]['price'];


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
        if (gettype($subtotal_price) != 'integer' and gettype($delivery_fee) != 'integer') {
            throw new Error('$subtotal_price or $delivery_fee is not an integer');
        }

        $total_price = $subtotal_price + $delivery_fee;
        return ($total_price * 100);
    };
    $error_message = "calculateOrderAmount failed. deliveryOption: $order->deliveryOption | \$wanted_ids: $wanted_ids ";
    throw new Error($error_message);
}

/**
 * 
 *
 * @param string $key 
 * @param string $value 
 * @param string $regexValue 
 * 
 * @return boolean URL ex: http://jegwell.fr/myStyle.css?123456
 */
function handleInputValidation($key, $value, $regexValue)
{

    $required_inputs = array('name', 'email', 'delivery', 'address-line-1', 'country', 'postal-code', 'city');
    $isRequired = in_array($key, $required_inputs, true);

    $additionalCondition = $isRequired ? false : ($value === '');
    $isRegexFollowed = ((preg_match($regexValue, $value) >= 1) or $additionalCondition);

    return $isRegexFollowed;
}

/**
 * @param string $buyer_email 
 * @param string $subject 
 * @param string $html_body 
 * @param string $alt_body 
 * 
 * @return boolean URL ex: http://jegwell.fr/myStyle.css?123456
 */
function sendEmail($buyer_email, $subject, $html_body, $alt_body)
{
    //Load Composer's autoloader
    require_once dirname(__DIR__, 2) . '/vendor/autoload.php';

    /** @desc this instantiates Dotenv and passes in our path to .env */
    $dotenv = \Dotenv\Dotenv::createImmutable(dirname(__DIR__, 3));
    $dotenv->load();


    $email_sent = false;

    try {
        //Create an instance; passing `true` enables exceptions
        $mail = new PHPMailer(true);

        //Server settings
        // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
        $mail->isSMTP();                                            //Send using SMTP
        $mail->Host       = $_ENV['MAIL_HOST'];                     //Set the SMTP server to send through
        $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
        $mail->Username   = $_ENV['MAIL_USERNAME'];                     //SMTP username
        $mail->Password   = $_ENV['MAIL_PASSWORD'];                               //SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
        $mail->Port       = $_ENV['MAIL_PORT'];                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

        //Recipients
        $mail->setFrom('jegwell.ne-pas-repondre@gmail.com', 'Jegwell');
        $mail->addAddress($buyer_email);     //Add a recipient
        if ($_ENV['ENV'] === 'production') {
            $mail->addBCC('jegwellparis@gmail.com'); // ajoute jegwell en le cachant dans l'email reçu par l'acheteur
        }

        //Content
        $mail->isHTML(true);                                  //Set email format to HTML
        $mail->Subject = $subject;
        $mail->Body    = $html_body ?? $alt_body;
        $mail->AltBody = $alt_body;

        $mail->send();

        $email_sent = true; // confirme l'envoie de l'email
    } catch (Exception $e) {
        // echo 'Une erreur est survenue, le mail ne confirmation n\'a pas pu être envoyé.';
        // echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }

    return $email_sent;
}


/**
 * @param object $order
 * 
 * @return array l'email sous forme d'html et sous form de 'plain text'
 */
function getOrderConfirmationEmail($order)
{
    $order_price_in_euros = getPriceInEuros($order['price']);
    $delivery_name = $order['delivery']['name'];
    $delivery_price = $order['delivery']['price'];

    // email visible dans src/components/order_confirmation_email.php
    $html_email_part_one = "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>
    <html lang='fr' xmlns:v='urn:schemas-microsoft-com:vml'>
    
    <head>
        <meta charset='UTF-8'>
        <meta http-equiv='content-type' content='text/html; charset=utf-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    </head>
    
    <body leftmargin='0' topmargin='0' marginwidth='0' marginheight='0'>
        <!-- header -->
        <table align='center' bgcolor='#fff' width='100%' border='0' cellpadding='0' cellspacing='0'>
            <tbody>
                <tr>
                    <td height='30' style='font-size: 30px; line-height: 30px;'>&nbsp;</td>
                </tr>
                <tr>
                    <td align='center' style='text-align: center;'>
                        <a href='https://jegwell.fr' style='font-size: 30px; line-height: 30px; color: rgb(172, 140, 48)'>
                            JEGWELL
                        </a>
                    </td>
                </tr>
                <tr>
                    <td height='30' style='font-size: 30px; line-height: 30px;'>&nbsp;</td>
                </tr>
                <tr>
                    <td align='center' style='text-align: center;'>
                        Confirmation de votre commande : $order[_id]
                    </td>
                </tr>
                <tr>
                    <td height='30' style='font-size: 30px; line-height: 30px;'>&nbsp;</td>
                </tr>
            </tbody>
        </table>
        <!-- fin header -->
    
        <!-- récapitulatif -->
        <table align='center' bgcolor='#fff' width='100%' border='0' cellpadding='0' cellspacing='0'>
            <tbody>
                <tr>
                    <td height='30' style='font-size: 30px; line-height: 30px;'>&nbsp;</td>
                </tr>
                <tr>
                    <td align='center' style='text-align: center;'>
                        Récapitulatif:
                    </td>
                </tr>
                <tr>
                    <td height='30' style='font-size: 30px; line-height: 30px;'>&nbsp;</td>
                </tr>
                <table align='center' bgcolor='#fff' width='100%' border='0' cellpadding='0' cellspacing='0'>
                    <tbody>";

    $html_email_part_two = '';

    foreach ($order['productsToBasket'] as $product) {
        $unit_price_time_quantity = $product['price'] * $product['quantity'];
        // $price_in_euros = getPriceInEuros($unit_price_time_quantity);

        $html_email_part_two .= "
                                    <tr>
                                        <td width='55%' align='right' style='text-align: right; width: 55%;'>$product[name] - $product[option] x $product[quantity] &nbsp; &nbsp;</td>
                                        <td>
                                            <table bgcolor='#333' align='center' width='2px' height='30' style='text-align: center; font-size: 30px; line-height: 30px; width: 2px;'></table>
                                        </td>
                                        <td  width='45%'; align='left' style='text-align: left; width: 45%;'>&nbsp; &nbsp;$unit_price_time_quantity euros</td>
                                    </tr>
                                    ";
    }


    $html_email_part_three = "
                        <tr>
                            <td width='55%'; align='right' style='text-align: right; width:55%;'>Livraison - $delivery_name &nbsp; &nbsp;</td>
                            <td>
                                <table bgcolor='#333' align='center' width='2px' height='30' style='text-align: center; font-size: 30px; line-height: 30px; width: 2px;'></table>
                            </td>
                            <td width='45%'; align='left' style='text-align: left; width:45%;'> &nbsp; &nbsp;$delivery_price euros</td>
                        </tr>
                        
                        <tr>
                            <td height='30' style='font-size: 30px; line-height: 30px;'>&nbsp;</td>
                        </tr>
                        <tr>
                            <td align='right' style='text-align: right;'>TOTAL TTC : &nbsp; &nbsp;</td>
                            <td>
                                <table align='center' width='2px' height='30' style='text-align: center; font-size: 30px; line-height: 30px; width: 2px;'></table>
                            </td>
                            <td align='left' style='text-align: left;'> &nbsp; &nbsp;$order_price_in_euros euros</td>
                        </tr>
                        <tr>
                            <td height='30' style='font-size: 30px; line-height: 30px;'>&nbsp;</td>
                        </tr>
                    </tbody>
                </table>
            </tbody>
    
        </table>
        <!-- fin récapitulatif -->
        <!-- Adresse de livraison -->
        <table align='center' bgcolor='#fff' width='100%' border='0' cellpadding='0' cellspacing='0'>
            <tbody>
                <tr>
                    <td height='30' style='font-size: 30px; line-height: 30px;'>&nbsp;</td>
                </tr>
                <tr>
                    <td align='center' style='text-align: center;'>
                        Adresse de livraison :
                    </td>
                </tr>
                <tr>
                    <td height='30' style='font-size: 30px; line-height: 30px;'>&nbsp;</td>
                </tr>
                <tr>
                    <td align='center' style='text-align: center;'>
                    $order[addressLine1], $order[postalCode], $order[city], $order[country]
                    </td>
                </tr>
                <tr>
                    <td align='center' style='text-align: center;'>
                        $order[addressLine2]
                    </td>
                </tr>
                <tr>
                    <td height='30' style='font-size: 30px; line-height: 30px;'>&nbsp;</td>
                </tr>
                <tr>
                    <td height='30' style='font-size: 30px; line-height: 30px;'>&nbsp;</td>
                </tr>
                <tr>
                    <td align='center' style='text-align: center;'>
                        Au nom de :
                    </td>
                </tr>
                <tr>
                    <td height='30' style='font-size: 30px; line-height: 30px;'>&nbsp;</td>
                </tr>
                <tr>
                    <td align='center' style='text-align: center;'>
                        $order[lastname]
                    </td>
                </tr>
                <tr>
                    <td align='center' style='text-align: center;'>
                        $order[firstname]
                    </td>
                </tr>
                <tr>
                    <td height='30' style='font-size: 30px; line-height: 30px;'>&nbsp;</td>
                </tr>
            </tbody>
        </table>
        <!-- fin adresse de livraison -->
        <!-- conctact -->
        <table align='center' bgcolor='#fff' width='100%' border='0' cellpadding='0' cellspacing='0'>
            <tbody>
                <tr>
                    <td height='30' style='font-size: 30px; line-height: 30px;'>&nbsp;</td>
                </tr>
                <tr>
                    <td align='center' style='text-align: center;'>
                        Un soucis ? Contactez-nous !
                    </td>
                </tr>
                <tr>
                    <td height='30' style='font-size: 30px; line-height: 30px;'>&nbsp;</td>
                </tr>
                <tr>
                    <td align='center' style='text-align: center;'>
                        jegwellparis@gmail.com
                    </td>
                </tr>
                <tr>
                    <td height='30' style='font-size: 30px; line-height: 30px;'>&nbsp;</td>
                </tr>
            </tbody>
        </table>
        <!-- fin contact -->
    </body>
    
    </html>";
    $html_email_raw = $html_email_part_one . $html_email_part_two . $html_email_part_three;
    $html_email = remove_accents($html_email_raw);
    $plain_text_email = $html_email; // todo: html version of email

    return array('plain_text' => $plain_text_email, 'html' => $html_email,);
}

function getPriceInEuros($priceInCents)
{
    $priceInCentsStringified = strval($priceInCents);

    $lastTwoCharacters = substr($priceInCentsStringified, -2); // returns "ef"

    $priceInEuros = substr_replace($priceInCentsStringified, ('.' . $lastTwoCharacters), -2,);

    return $priceInEuros;
}

function remove_accents($string)
{
    if (!preg_match('/[\x80-\xff]/', $string))
        return $string;

    $chars = array(
        // Decompositions for Latin-1 Supplement
        chr(195) . chr(128) => 'A', chr(195) . chr(129) => 'A',
        chr(195) . chr(130) => 'A', chr(195) . chr(131) => 'A',
        chr(195) . chr(132) => 'A', chr(195) . chr(133) => 'A',
        chr(195) . chr(135) => 'C', chr(195) . chr(136) => 'E',
        chr(195) . chr(137) => 'E', chr(195) . chr(138) => 'E',
        chr(195) . chr(139) => 'E', chr(195) . chr(140) => 'I',
        chr(195) . chr(141) => 'I', chr(195) . chr(142) => 'I',
        chr(195) . chr(143) => 'I', chr(195) . chr(145) => 'N',
        chr(195) . chr(146) => 'O', chr(195) . chr(147) => 'O',
        chr(195) . chr(148) => 'O', chr(195) . chr(149) => 'O',
        chr(195) . chr(150) => 'O', chr(195) . chr(153) => 'U',
        chr(195) . chr(154) => 'U', chr(195) . chr(155) => 'U',
        chr(195) . chr(156) => 'U', chr(195) . chr(157) => 'Y',
        chr(195) . chr(159) => 's', chr(195) . chr(160) => 'a',
        chr(195) . chr(161) => 'a', chr(195) . chr(162) => 'a',
        chr(195) . chr(163) => 'a', chr(195) . chr(164) => 'a',
        chr(195) . chr(165) => 'a', chr(195) . chr(167) => 'c',
        chr(195) . chr(168) => 'e', chr(195) . chr(169) => 'e',
        chr(195) . chr(170) => 'e', chr(195) . chr(171) => 'e',
        chr(195) . chr(172) => 'i', chr(195) . chr(173) => 'i',
        chr(195) . chr(174) => 'i', chr(195) . chr(175) => 'i',
        chr(195) . chr(177) => 'n', chr(195) . chr(178) => 'o',
        chr(195) . chr(179) => 'o', chr(195) . chr(180) => 'o',
        chr(195) . chr(181) => 'o', chr(195) . chr(182) => 'o',
        chr(195) . chr(182) => 'o', chr(195) . chr(185) => 'u',
        chr(195) . chr(186) => 'u', chr(195) . chr(187) => 'u',
        chr(195) . chr(188) => 'u', chr(195) . chr(189) => 'y',
        chr(195) . chr(191) => 'y',
        // Decompositions for Latin Extended-A
        chr(196) . chr(128) => 'A', chr(196) . chr(129) => 'a',
        chr(196) . chr(130) => 'A', chr(196) . chr(131) => 'a',
        chr(196) . chr(132) => 'A', chr(196) . chr(133) => 'a',
        chr(196) . chr(134) => 'C', chr(196) . chr(135) => 'c',
        chr(196) . chr(136) => 'C', chr(196) . chr(137) => 'c',
        chr(196) . chr(138) => 'C', chr(196) . chr(139) => 'c',
        chr(196) . chr(140) => 'C', chr(196) . chr(141) => 'c',
        chr(196) . chr(142) => 'D', chr(196) . chr(143) => 'd',
        chr(196) . chr(144) => 'D', chr(196) . chr(145) => 'd',
        chr(196) . chr(146) => 'E', chr(196) . chr(147) => 'e',
        chr(196) . chr(148) => 'E', chr(196) . chr(149) => 'e',
        chr(196) . chr(150) => 'E', chr(196) . chr(151) => 'e',
        chr(196) . chr(152) => 'E', chr(196) . chr(153) => 'e',
        chr(196) . chr(154) => 'E', chr(196) . chr(155) => 'e',
        chr(196) . chr(156) => 'G', chr(196) . chr(157) => 'g',
        chr(196) . chr(158) => 'G', chr(196) . chr(159) => 'g',
        chr(196) . chr(160) => 'G', chr(196) . chr(161) => 'g',
        chr(196) . chr(162) => 'G', chr(196) . chr(163) => 'g',
        chr(196) . chr(164) => 'H', chr(196) . chr(165) => 'h',
        chr(196) . chr(166) => 'H', chr(196) . chr(167) => 'h',
        chr(196) . chr(168) => 'I', chr(196) . chr(169) => 'i',
        chr(196) . chr(170) => 'I', chr(196) . chr(171) => 'i',
        chr(196) . chr(172) => 'I', chr(196) . chr(173) => 'i',
        chr(196) . chr(174) => 'I', chr(196) . chr(175) => 'i',
        chr(196) . chr(176) => 'I', chr(196) . chr(177) => 'i',
        chr(196) . chr(178) => 'IJ', chr(196) . chr(179) => 'ij',
        chr(196) . chr(180) => 'J', chr(196) . chr(181) => 'j',
        chr(196) . chr(182) => 'K', chr(196) . chr(183) => 'k',
        chr(196) . chr(184) => 'k', chr(196) . chr(185) => 'L',
        chr(196) . chr(186) => 'l', chr(196) . chr(187) => 'L',
        chr(196) . chr(188) => 'l', chr(196) . chr(189) => 'L',
        chr(196) . chr(190) => 'l', chr(196) . chr(191) => 'L',
        chr(197) . chr(128) => 'l', chr(197) . chr(129) => 'L',
        chr(197) . chr(130) => 'l', chr(197) . chr(131) => 'N',
        chr(197) . chr(132) => 'n', chr(197) . chr(133) => 'N',
        chr(197) . chr(134) => 'n', chr(197) . chr(135) => 'N',
        chr(197) . chr(136) => 'n', chr(197) . chr(137) => 'N',
        chr(197) . chr(138) => 'n', chr(197) . chr(139) => 'N',
        chr(197) . chr(140) => 'O', chr(197) . chr(141) => 'o',
        chr(197) . chr(142) => 'O', chr(197) . chr(143) => 'o',
        chr(197) . chr(144) => 'O', chr(197) . chr(145) => 'o',
        chr(197) . chr(146) => 'OE', chr(197) . chr(147) => 'oe',
        chr(197) . chr(148) => 'R', chr(197) . chr(149) => 'r',
        chr(197) . chr(150) => 'R', chr(197) . chr(151) => 'r',
        chr(197) . chr(152) => 'R', chr(197) . chr(153) => 'r',
        chr(197) . chr(154) => 'S', chr(197) . chr(155) => 's',
        chr(197) . chr(156) => 'S', chr(197) . chr(157) => 's',
        chr(197) . chr(158) => 'S', chr(197) . chr(159) => 's',
        chr(197) . chr(160) => 'S', chr(197) . chr(161) => 's',
        chr(197) . chr(162) => 'T', chr(197) . chr(163) => 't',
        chr(197) . chr(164) => 'T', chr(197) . chr(165) => 't',
        chr(197) . chr(166) => 'T', chr(197) . chr(167) => 't',
        chr(197) . chr(168) => 'U', chr(197) . chr(169) => 'u',
        chr(197) . chr(170) => 'U', chr(197) . chr(171) => 'u',
        chr(197) . chr(172) => 'U', chr(197) . chr(173) => 'u',
        chr(197) . chr(174) => 'U', chr(197) . chr(175) => 'u',
        chr(197) . chr(176) => 'U', chr(197) . chr(177) => 'u',
        chr(197) . chr(178) => 'U', chr(197) . chr(179) => 'u',
        chr(197) . chr(180) => 'W', chr(197) . chr(181) => 'w',
        chr(197) . chr(182) => 'Y', chr(197) . chr(183) => 'y',
        chr(197) . chr(184) => 'Y', chr(197) . chr(185) => 'Z',
        chr(197) . chr(186) => 'z', chr(197) . chr(187) => 'Z',
        chr(197) . chr(188) => 'z', chr(197) . chr(189) => 'Z',
        chr(197) . chr(190) => 'z', chr(197) . chr(191) => 's'
    );

    $string = strtr($string, $chars);

    return $string;
}
