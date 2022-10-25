<?php
include_once dirname(__FILE__, 2) . '/utils/functions.php';

use function Jegwell\functions\getFileUrl;
use Sanity\Client as SanityClient;

$page_css = getFileUrl('../css/success.css', dirname(__FILE__, 2) . '/css/success.css');
// $page_js = getFileUrl('../js/pages/success.js', dirname(__FILE__, 2) . '/js/pages/success.js');

$page_title = 'Jegwell | Paiement réussi';
include '../components/header.php'; // contient le code pour lire les variables d'environnement


if ($_SERVER['REQUEST_METHOD'] == 'POST' and isset($_POST['payment_intent']) and isset($_POST['payment_intent_client_secret'])) {
    $sanity = new SanityClient([
        'projectId' => $_ENV['SANITY_PROJECT_ID'],
        'dataset' => 'production',
        'apiVersion' => $_ENV['SANITY_API_VERSION'],
        'token' => $_ENV['SANITY_TOKEN_TO_WRITE'],
    ]);


    // met à jour les informations concernant le paiement de la commande (payé ou non, le prix, etc)
    $updatedOrder = $sanity
        ->patch($_SESSION["order_id"]) // Document ID to patch
        ->set(['paymentIntentClientSecret' => htmlspecialchars($_POST['payment_intent_client_secret'])]) // Shallow merge
        ->commit(); // Perform the patch and return the modified document
}
?>

<main>

    <section class="section">
        <h1 class="section__h2 success__heading">PAIEMENT RÉUSSI</h1>
        <div class="success__checked-icon">&#10003;</div>
        <div class="success__message">
            <span>Merci !</span>
            <p>Une confirmation vous sera envoyé par mail.</p>
        </div>
        <a class="main-call-to-action" href="<?php echo $_ENV['HOME'] . '/creations' ?>">Continuer votre shoping</a>
    </section>
</main>
<?php
include '../components/footer.php';
