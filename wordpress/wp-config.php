<?php

/** @desc this loads the composer autoload file */
require_once dirname(__DIR__) . '/vendor/autoload.php';
/** @desc this instantiates Dotenv and passes in our path to .env */
$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

defined('WORDPRESS_ENV') or define('WORDPRESS_ENV', $_ENV['WORDPRESS_ENV']);
defined('WP_HOME') or define('WP_HOME', $_ENV['WP_HOME']);

// Cela change la page d'accueil de WooCommerce de http://example.com/shop/ à http://example.com/.
defined('SHOP_IS_ON_FRONT') or define('SHOP_IS_ON_FRONT', $_ENV['SHOP_IS_ON_FRONT']);

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
defined('DB_NAME') or define('DB_NAME', $_ENV['DB_NAME']);

/** Database username */
defined('DB_USER') or define('DB_USER', $_ENV['DB_USER']);

/** Database password */
defined('DB_PASSWORD') or define('DB_PASSWORD', $_ENV['DB_PASSWORD']);

/** Database hostname */
define('DB_HOST', $_ENV['DB_HOST']);

/** Database charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The database collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'v8](Vv{#S+ZNF0N1hsZO-rtioFDqcV t@}&*]cT.yN/w9Z,HkFHKkhJKu=?&ng6)');
define('SECURE_AUTH_KEY',  ':Abz&36)m1. qG9agso1?0X>J>.Yha{^r<{?!jq;3Z}#cKLQ~5|ezl)b5@}o/zSa');
define('LOGGED_IN_KEY',    'eRa37vi<1!*YOXxSyOK>(6cnYGv<?u.O3Tlc(a_WPAi?[;!!>6#c1ek 5({{MDT*');
define('NONCE_KEY',        '2@i0Uv@iPeQbjTrS5hgc5=dB8C-&}i{_gPiE]n4ZWe-kZN1;K &<lcgEnK~[,Q]z');
define('AUTH_SALT',        'StZkWkR`HfE}hG t@f!f_#4:awRus}6LTq59mU)frS3p52BotK#t$Q@7)@pyh8!4');
define('SECURE_AUTH_SALT', '0ZEMVM}A |k1.vBs8i-p!T2#k+M9Kg,Y*iQF6t0$Go7TD@P<&XV,.2f`}K.5GIM=');
define('LOGGED_IN_SALT',   '0?*J}}vd}xE?pYgG*<|E&t3?]03;O6;^i`;m@pfr:yH~N!]R%TuM}:IUKYVY1 =[');
define('NONCE_SALT',       'aR6KgOyJ/gNZO_~HSJ_uwQawDN4YR9=*Ei_$|-.LO>yj3+%,l&O[<wM2@De:o!%8');

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'jw_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define('WP_DEBUG', false);

/* Add any custom values between this line and the "stop editing" line. */
$logfile = dirname(__DIR__) . '/log/error.log';
$logdir = dirname(__DIR__) . '/log';
define('ERRORLOGFILE', $logfile);
define('WC_LOG_DIR', $logdir);

if (WORDPRESS_ENV === 'development' || WORDPRESS_ENV === 'staging') {
	define('WP_DEBUG', true);
	define('WP_DEBUG_LOG', $logfile);
	define('WP_DEBUG_DISPLAY', true);
	define('SAVEQUERIES', true);
	define('SCRIPT_DEBUG', true);
	define('DIEONDBERROR', true);
	define('WP_DISABLE_FATAL_ERROR_HANDLER', true);
}

if (WORDPRESS_ENV === 'production') {
	define('WP_DEBUG', false);
	define('WP_DEBUG_LOG', $logfile);
	define('WP_DEBUG_DISPLAY', false);
	define('SAVEQUERIES', false);
	define('SCRIPT_DEBUG', false);
	define('DIEONDBERROR', false);
}

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if (!defined('ABSPATH')) {
	define('ABSPATH', __DIR__ . '/');
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
