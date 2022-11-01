<?php
include_once dirname(__FILE__, 2) . '/utils/functions.php';

use function Jegwell\functions\getFileUrl;
use function Jegwell\functions\sendEmail;
use function Jegwell\functions\getOrderConfirmationEmail;

use Sanity\Client as SanityClient;
use Sanity\Exception\BaseException;

$page_css = getFileUrl('/src/css/success.css', dirname(__FILE__, 2) . '/css/success.css');
// $page_js = getFileUrl('../js/pages/success.js', dirname(__FILE__, 2) . '/js/pages/success.js');

$page_title = 'Jegwell | Paiement réussi';
include '../components/header.php'; // contient le code pour lire les variables d'environnement

$was_email_sent = null;
$message = 'Une confirmation vous sera envoyée par mail.';

if (
    $_SERVER['REQUEST_METHOD'] == 'GET' and
    isset($_GET['payment_intent']) and
    isset($_GET['payment_intent_client_secret']) and
    isset($_SESSION["order_id"])
) {
    $sanity = new SanityClient([
        'projectId' => $_ENV['SANITY_PROJECT_ID'],
        'dataset' => 'production',
        'apiVersion' => $_ENV['SANITY_API_VERSION'],
        'token' => $_ENV['SANITY_TOKEN_TO_WRITE'],
    ]);

    try {
        // met à jour les informations concernant le paiement de la commande (payé ou non, le prix, etc)
        $updatedOrder = $sanity
            ->patch($_SESSION['order_id']) // Document ID to patch
            ->set([
                'paymentIntentClientSecret' => htmlspecialchars($_GET['payment_intent_client_secret']),
                'paid' => true,
            ]) // Shallow merge
            ->commit(); // Perform the patch and return the modified documentt

        // call sanity to get the deliveryOption details (name and price)
        // sanity get $_SESSION['order_id'] (or $updatedOrder[_id]?) deliveryOption-> and productsToBasket->
        $query = "
        *[_type == 'order' && _id == '$updatedOrder[_id]']{    
            price,
            'productsToBasket': productsToBasket[]{
                quantity,
                option,
                ...
                id->{
                    name,
                    price,
                    'image_url': image.asset->url,
                }
            },
            firstname,
            lastname,
            phoneNumber,
            delivery->{
                name,
                price
            },
            addressLine1,
            addressLine2,
            country,
            postalCode,
            city,
            email,
            _id
          }";


        $order = $sanity->fetch($query)[0];

        $email_bodies = getOrderConfirmationEmail($order);
        $email_to = htmlspecialchars($order['email']);

        // send email to customer and forward to jegwell
        $was_email_sent = sendEmail($email_to, 'Confirmation de votre commande', $email_bodies['html'], $email_bodies['plain_text']);

        if ($was_email_sent === false or $was_email_sent === true) {
            $sanity
                ->patch($updatedOrder['_id']) // Document ID to patch
                ->set(['emailSent' => $was_email_sent]) // Shallow merge
                ->commit(); // Perform the patch and return the modified documentt
        } elseif ($_ENV['ENV'] === 'development') {
            echo '$was_email_sent is not a boolean';
        }
    } catch (BaseException $error) {
        echo 'Nous n\'avons pas réussi a créé votre commande. Veuillez contacter: jegwellparis@gmail.com';
        var_dump($error);
    }

    if ($was_email_sent === false) {
        $message = "Une erreur est survenue, le mail ne confirmation n'a pas pu être envoyé. Veuillez contacter jegwellparis@gmail.com en fournissant ce code: $_SESSION[order_id]";
    }


    // détruit la variable de session afin d'empêcher l'utilisateur de modifier la commande en modifiant la variable $_GET 
    unset($_SESSION["order_id"]);

    // paiement effectué, on réinitialise le panier et l'option choisi dans les cookies
    setcookie('productsToBasket', '', 1);
    setcookie('deliveryOption', '', 1);
} else {

    // echo 'get parameters or session payment id not found';
}

?>

<main>

    <section class="section">
        <h1 class="section__h2 success__heading">PAIEMENT RÉUSSI</h1>
        <div class="success__checked-icon">&#10003;</div>
        <div class="success__message">
            <span>Merci !</span>
            <p><?php echo $message ?></p>
        </div>
        <a class="main-call-to-action" href="/creations">Continuer votre shopping</a>
    </section>
</main>
<?php
include '../components/footer.php';
