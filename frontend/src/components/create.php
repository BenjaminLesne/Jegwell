<?php
require dirname(__FILE__, 3) . '/vendor/autoload.php';
include_once dirname(__FILE__, 2) . '/utils/functions.php';

/** @desc this instantiates Dotenv and passes in our path to .env */
$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 3));
$dotenv->load();

use function Jegwell\functions\calculateOrderAmount;
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
\Stripe\Stripe::setApiKey('sk_test_VePHdqKTYQjKNInc7u56JBrQ');


header('Content-Type: application/json');

try {

    $ENV = array('SANITY_PROJECT_ID' => $_ENV['SANITY_PROJECT_ID'], 'SANITY_API_VERSION' => $_ENV['SANITY_API_VERSION'], 'SANITY_TOKEN_TO_READ' => $_ENV['SANITY_TOKEN_TO_READ']);
    // retrieve JSON from POST body
    $orderJson = file_get_contents('php://input');
    $order = json_decode($orderJson);

    $totalPriceInCents = calculateOrderAmount($order, $ENV);

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

    echo json_encode($output);
} catch (Error $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
