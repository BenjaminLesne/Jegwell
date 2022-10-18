<?php
require dirname(__FILE__, 3) . '/vendor/autoload.php';
include_once dirname(__FILE__, 2) . '/utils/functions.php';


use function Jegwell\functions\getFileUrl;
use Sanity\Client as SanityClient;

$page_css = getFileUrl('../css/payment.css', dirname(__FILE__, 2) . '/css/payment.css');
$page_js = getFileUrl('../js/pages/payment.js', dirname(__FILE__, 2) . '/js/pages/payment.js');

$js_files_urls = [$page_js, 'https://js.stripe.com/v3/'];

$page_title = 'Jegwell | Paiement';
include '../components/header.php'; // contient le code pour lire les variables d'environnement



// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
\Stripe\Stripe::setApiKey('sk_test_VePHdqKTYQjKNInc7u56JBrQ');

function calculateOrderAmount(array $items): int
{
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1400;
}

header('Content-Type: application/json');

try {
    $jsonStr = $_COOKIE['productsToBasket'];
    echo $jsonStr;
    $jsonObj = json_decode($jsonStr);



    // Create a PaymentIntent with amount and currency
    $paymentIntent = \Stripe\PaymentIntent::create([
        'amount' => calculateOrderAmount([]),
        'currency' => 'eur',
        'automatic_payment_methods' => [
            'enabled' => true,
        ],
    ]);

    $output = [
        'clientSecret' => $paymentIntent->client_secret,
    ];

    echo json_encode($output);
} catch (Error $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

?>

<main>
    <section class="section">
        <h1 class="section__h2">PAIEMENT</h1>
        <!-- Display a payment form -->
        <form id="payment-form">
            <div id="payment-element">
                <!--Stripe.js injects the Payment Element-->
            </div>
            <button id="submit">
                <div class="spinner hidden" id="spinner"></div>
                <span id="button-text">Pay now</span>
            </button>
            <div id="payment-message" class="hidden"></div>
        </form>
    </section>
</main>


<?php
include '../components/footer.php';
