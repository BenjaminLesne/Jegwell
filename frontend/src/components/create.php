<?php
session_start();

require dirname(__FILE__, 3) . '/vendor/autoload.php';
include_once dirname(__FILE__, 2) . '/utils/functions.php';

/** @desc this instantiates Dotenv and passes in our path to .env */
$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 3));
$dotenv->load();

use function Jegwell\functions\calculateOrderAmountInCents;
use Sanity\Client as SanityClient;

$api_key = $_ENV['ENV'] === 'development' ? $_ENV['STRIPE_API_KEY_DEV'] : $_ENV['STRIPE_API_KEY_PROD'];

// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
\Stripe\Stripe::setApiKey($api_key);


header('Content-Type: application/json');

try {

    $ENV = array('SANITY_PROJECT_ID' => $_ENV['SANITY_PROJECT_ID'], 'SANITY_API_VERSION' => $_ENV['SANITY_API_VERSION'], 'SANITY_TOKEN_TO_READ' => $_ENV['SANITY_TOKEN_TO_READ']);
    // retrieve JSON from POST body
    $orderJson = file_get_contents('php://input');
    $order = json_decode($orderJson);

    $totalPriceInCents = calculateOrderAmountInCents($order, $ENV);

    // Create a PaymentIntent with amount and currency
    $paymentIntent = \Stripe\PaymentIntent::create([
        'amount' => $totalPriceInCents,
        'currency' => 'eur',
        'automatic_payment_methods' => [
            'enabled' => true,
        ],
    ]);

    $output = [
        'clientSecret' => $paymentIntent->client_secret,
        'totalPriceInCents' => $totalPriceInCents,
    ];

    // met à jour les informations concernant le paiement de la commande (le prix, paymentIntent id)
    $sanity = new SanityClient([
        'projectId' => $_ENV['SANITY_PROJECT_ID'],
        'dataset' => 'production',
        'apiVersion' => $_ENV['SANITY_API_VERSION'],
        'token' => $_ENV['SANITY_TOKEN_TO_WRITE'],
    ]);



    $updatedOrder = $sanity
        ->patch($_SESSION["order_id"]) // Document ID to patch
        ->set(['price' => $totalPriceInCents]) // Shallow merge
        ->set(['paymentIntentId' => $paymentIntent->id]) // Shallow merge
        ->commit(); // Perform the patch and return the modified document


    echo json_encode($output);
} catch (Error $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
