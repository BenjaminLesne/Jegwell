<?php

declare(strict_types=1);

$root_level = 1;
require_once dirname(__DIR__, $root_level) . '/vendor/autoload.php';
require_once dirname(__DIR__) . '/wordpress/jegwell-functions.php';

/** @desc this instantiates Dotenv and passes in our path to .env */
$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, $root_level));
$dotenv->load();

use PHPUnit\Framework\TestCase;

use function Jegwell\functions\getFileUrl;


class jegwellFunctionsTest extends TestCase
{

    public function testGetFileUrl()
    {
        try {
            $url = getFileUrl('/jegwellFunctionsTest.php', dirname(__FILE__), dirname(__FILE__, 2) . '/tests');
            getFileUrl('/path.php', 'wrong/path/again', '/wrong/path' . '/worng');
        } catch (\Throwable $th) {

            $this->assertSame('filemtime(): stat failed for wrong/path/again/path.php', $th->getMessage());
        }

        $expected = "/[a-zA-Z]+\.(php|js|html|css)+\?\d*/";

        $this->assertSame(preg_match($expected, $url), 1);
    }
}
