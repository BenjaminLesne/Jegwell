<?php
include_once dirname(__FILE__, 2) . '/utils/functions.php';

use function Jegwell\functions\getFileUrl;
use function Jegwell\functions\handleInputValidation;
use Sanity\Exception\BaseException;


use Sanity\Client as SanityClient;

$page_css = getFileUrl('/src/css/checkout.css', dirname(__FILE__, 2) . '/css/checkout.css');
$page_js = getFileUrl('/src/js/pages/checkout.js', dirname(__FILE__, 2) . '/js/pages/checkout.js');

$js_files_urls = ['https://js.stripe.com/v3/', $page_js];

$page_title = 'Jegwell | Paiement';
include '../components/header.php'; // contient le code pour lire les variables d'environnement

$stripe_publishable_key = $_ENV['ENV'] == 'development' ? $_ENV['STRIPE_PUBLISHABLE_TOKEN_DEV'] : $_ENV['STRIPE_PUBLISHABLE_TOKEN_PROD'];
$required_inputs = array('lastname', 'email', 'delivery', 'addressLine1', 'country', 'postalCode', 'city', 'phoneNumber');
$required_inputs_exists = true;
$wrong_inputs = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST' and empty($_POST) === false) {
    foreach ($required_inputs as $name) {
        if (isset($_POST[$name]) == false) {
            $required_inputs_exists = false;
            array_push($wrong_inputs, $name);
        }
    };
} else {
    $required_inputs_exists = false;
    array_push($wrong_inputs, 'request method not post or empty $_POST');
}

if ($required_inputs_exists) {

    // checks all inputs value

    foreach ($_POST as $key => $value) {

        $regex = null;

        switch ($key) {
            case "phoneNumber":
                $regex = "/^[0-9]{10,}$/";
            case "delivery":
                $regex = $regex ?? '/^054d9226-3128-49b5-a458-deab4705847f|1a77a19f-74a5-419f-8c1d-d63555ab2720$/';
            case "addressLine1":
            case "addressLine2":
                $regex = $regex ?? '/[a-z0-9]+/i';
            case "postalCode":
                $regex = $regex ?? '/^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/';
            case "email":
                $regex = $regex ?? '/^[a-z0-9!-~]+(?:\.[a-z0-9!-~]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/';
            case "firstname":
            case "lastname":
            case "city":
                $regex = $regex ?? '/^[a-z]+$/i';
                $result = handleInputValidation($key, $value, $regex);

                if ($result == false) {
                    array_push($wrong_inputs, $key);
                }
                break;

            default:

                break;
        }
    };

    // aucun mauvais input, on crée une commande sur sanity (sans les info
    // de paiement qui seront rajouté à la création du payement intent dans create.php)
    if (count($wrong_inputs) == 0) {
        $sanity = new SanityClient([
            'projectId' => $_ENV['SANITY_PROJECT_ID'],
            'dataset' => 'production',
            'apiVersion' => $_ENV['SANITY_API_VERSION'],
            'token' => $_ENV['SANITY_TOKEN_TO_WRITE'],
        ]);

        if (isset($_COOKIE["productsToBasket"])) {

            $products_to_basket = json_decode($_COOKIE["productsToBasket"]);

            $deliveryReference = (object) [
                '_type' => 'reference',
                '_ref' => htmlspecialchars($_POST['delivery']),
            ];


            for ($index = 0; $index < count($products_to_basket); $index++) {
                // On formate les variables pour Sanity 
                $products_to_basket[$index]->_key = strval($index);
                $products_to_basket[$index]->_type = 'productToBasket';
                $products_to_basket[$index]->id = (object) [
                    '_type' => 'reference',
                    '_ref' => htmlspecialchars($products_to_basket[$index]->id),
                ];
            }






            $order = [
                '_type' => 'order',
                'paid' => false,
                // 'price' => htmlspecialchars(valueGivenByUser),
                // 'paymentIntentId' => htmlspecialchars(valueGivenByUser),
                'productsToBasket' => $products_to_basket,
                'firstname'  => htmlspecialchars($_POST['firstname']),
                'lastname' => htmlspecialchars($_POST['lastname']),
                'email' => htmlspecialchars($_POST['email']),
                'phoneNumber' => htmlspecialchars($_POST['phoneNumber']),
                'delivery' => $deliveryReference,
                'addressLine1' => htmlspecialchars($_POST['addressLine1']),
                'addressLine2' => htmlspecialchars($_POST['addressLine2']),
                'country' => htmlspecialchars($_POST['country']),
                'postalCode' => htmlspecialchars($_POST['postalCode']),
                'city' => htmlspecialchars($_POST['city']),
                'comment' => htmlspecialchars($_POST['comment']),
            ];

            try {
                $newOrder = $sanity->create($order);
            } catch (BaseException $error) {
                array_push($wrong_inputs, 'order creation failed');
                var_dump($error);
            }



            // Afin que JavaScript puisse utiliser deliveryOption coté client
            setcookie(
                'deliveryOption',
                htmlspecialchars($_POST['delivery']),
                strtotime('+365 days'),
                '/'
            );

            $_SESSION['order_id'] = $newOrder['_id'];
        }
    }
}



?>

<main>
    <?php
    if ($required_inputs_exists && count($wrong_inputs) == 0) {

    ?>
        <section class="section">
            <h1 class="section__h2">PAIEMENT</h1>
            <!-- Display a payment form -->
            <form id="payment-form">
                <div id="payment-element">
                    <!--Stripe.js injects the Payment Element-->
                </div>
                <button id="submit" class="main-call-to-action" data-token="<?php echo $stripe_publishable_key ?>" data-success-url="<?php echo $_ENV['HOME_PAGE'] . '/panier/livraison/paiement/reussi' ?>">
                    <div class="spinner hidden" id="spinner"></div>
                    <span id="button-text">Chargement en cours</span>
                </button>
                <div id="payment-message" class="hidden"></div>
            </form>
        </section>

    <?php
    } else {
        // echo '<pre>';
        // echo 'Les entrées nécessaire existent :';
        // echo $required_inputs_exists ? 'true' : 'false';
        // echo '</pre>';

        // echo '<pre>';
        // echo 'entrées erronées :';
        // echo var_dump($wrong_inputs);
        // echo '</pre>';

    ?>
        <p class="" style="margin: 40px auto 0 auto; text-align: center;width:100%">Nous manquons d'information vous concernant pour effectuer le paiement !</p>
        <a href="<?php echo $_ENV['HOME_PAGE'] . '/panier/livraison' ?>" style="margin: 40px auto 0 auto; text-align: center;width:100%" class="">Cliquez ici pour revenir au formulaire.</a>
    <?php
    }
    ?>
</main>
<?php
include '../components/footer.php';
