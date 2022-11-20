<?php

declare(strict_types=1);

require dirname(__FILE__, 4) . '/vendor/autoload.php';
include_once dirname(__FILE__, 4) . '/src/utils/functions.php';

/** @desc this instantiates Dotenv and passes in our path to .env */
$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 4));
$dotenv->load();

use PHPUnit\Framework\TestCase;
use function Jegwell\functions\calculateOrderAmountInCents;

final class FunctionsTest extends TestCase
{
    public function test_calculateOrderAmountInCents(): void
    {
        $ENV = array(
            'SANITY_PROJECT_ID' => $_ENV['SANITY_PROJECT_ID'],
            'SANITY_API_VERSION' => $_ENV['SANITY_API_VERSION'],
            'SANITY_TOKEN_TO_READ' => $_ENV['SANITY_TOKEN_TO_READ']
        );
        $fake_order_json = '{"products":[{"id":"19fc0bbe-6670-4edd-b010-987334f1f755","option":"default","quantity":1},{"id":"95070809-fdaa-41c1-9565-2958416e31fc","option":"default","quantity":1},{"id":"d0e34821-c42e-4383-b3db-27587f92a8f0","option":"default","quantity":1}],"deliveryOption":"1a77a19f-74a5-419f-8c1d-d63555ab2720"}';
        $fake_order = json_decode($fake_order_json);

        // test 3 items with total = 60€
        $result1 = calculateOrderAmountInCents($fake_order, $ENV);

        if (gettype($result1) !== 'integer') {
            echo '<pre>';
            print_r($result1);
            echo '</pre>';
        }

        $this->assertSame(6000, $result1);
    }
}
