<?php

declare(strict_types=1);

$root_level = 1;
require_once dirname(__DIR__, $root_level) . '/vendor/autoload.php';
require_once dirname(__DIR__) . '/wordpress/jegwell-functions.php';

/** @desc this instantiates Dotenv and passes in our path to .env */
$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, $root_level) . '/code');
$dotenv->load();

use PHPUnit\Framework\TestCase;

use function Jegwell\functions\addToLogs;
use function Jegwell\functions\initializeSentry;
use function Jegwell\functions\getFileUrl;


class jegwellFunctionsTest extends TestCase
{
    // Sentry 
    public function testSentryWrongDsn()
    {
        $inputs = array(123, "345", true, false, null);
        foreach ($inputs as $input) {
            $result = initializeSentry($input, "development");
            $this->assertSame($result, array("status" => "fail", "email" => "success"));
        }
    }

    public function testSentryInitialization(): void
    {
        // Initialise Sentry.io avec PHP
        $initialization = \Sentry\init(['dsn' => $_ENV['SENTRY_DSN']]);
        $this->assertSame($initialization, null);
    }

    public function testaddToLogs()
    {
        $randomId = rand();
        $message = "this is my error message {$randomId}";
        $type = 'test-error';
        $logPath  = dirname(__DIR__, 2) . "/code/logs/{$type}-logs.log";
        $previousContent = file_exists($logPath) ? file_get_contents($logPath) : "default";

        addToLogs('test-error', $message);

        $currentContent = file_get_contents($logPath);

        $this->assertStringContainsString($message, $currentContent);

        if ($previousContent !== "default") {
            $this->assertStringContainsString($previousContent, $currentContent);
        }
    }


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
