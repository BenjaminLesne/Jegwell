<?php
include_once dirname(__FILE__, 2) . '/utils/functions.php';

use function Jegwell\functions\getFileUrl;
use Sanity\Client as SanityClient;

$page_css = getFileUrl('../css/checkout.css', dirname(__FILE__, 2) . '/css/checkout.css');
$page_js = getFileUrl('../js/pages/checkout.js', dirname(__FILE__, 2) . '/js/pages/checkout.js');

$js_files_urls = ['https://js.stripe.com/v3/', $page_js];

$page_title = 'Jegwell | Paiement';
include '../components/header.php'; // contient le code pour lire les variables d'environnement

$required_inputs = array('lastname', 'email', 'delivery', 'address-line-1', 'country', 'postal-code', 'city');
$required_inputs_exists = true;
$wrong_inputs = array();

foreach ($required_inputs as $name) {
    if (isset($_POST[$name]) == false) {
        $required_inputs_exists = false;
        array_push($wrong_inputs, $name);
    }
};

if ($required_inputs_exists) {
    setcookie(
        'deliveryOption',
        $_POST['delivery'],
        strtotime('+365 days'),
        '/'
    );
    // preg_match();

    // htmlspecialchars();
} else {
}

$sanity = new SanityClient([
    'projectId' => $_ENV['SANITY_PROJECT_ID'],
    'dataset' => 'production',
    'apiVersion' => $_ENV['SANITY_API_VERSION'],
    'token' => $_ENV['SANITY_TOKEN_TO_READ'],
]);
?>

<main>
    <?php
    if ($required_inputs_exists) {

    ?>
        <section class="section">
            <h1 class="section__h2">PAIEMENT</h1>
            <!-- Display a payment form -->
            <form id="payment-form">
                <div id="payment-element">
                    <!--Stripe.js injects the Payment Element-->
                </div>
                <button id="submit" class="main-call-to-action">
                    <div class="spinner hidden" id="spinner"></div>
                    <span id="button-text">Payer</span>
                </button>
                <div id="payment-message" class="hidden"></div>
            </form>
        </section>

    <?php
    } else {
    ?>
        <p class="">Nous manquons d'information vous concernant pour effectuer le paiement !</p>
        <a href="javascript: window.history.go(-1)" class="">Cliquez ici pour revenir au formulaire.</a>
    <?php
    }
    ?>
</main>
<?php
include '../components/footer.php';
