<?php
include_once dirname(__FILE__, 2) . '/utils/functions.php';

use function Jegwell\functions\getFileUrl;
use Sanity\Client as SanityClient;

$page_css = getFileUrl('/src/css/delivery.css', dirname(__FILE__, 2) . '/css/delivery.css');
$page_js = getFileUrl('/src/js/pages/delivery.js', dirname(__FILE__, 2) . '/js/pages/delivery.js');

$page_title = 'Jegwell | Livraison';
include '../components/header.php'; // contient le code pour lire les variables d'environnement

$sanity = new SanityClient([
    'projectId' => $_ENV['SANITY_PROJECT_ID'],
    'dataset' => 'production',
    'apiVersion' => $_ENV['SANITY_API_VERSION'],
    'token' => $_ENV['SANITY_TOKEN_TO_READ'],
]);
?>

<main>
    <section class="section">
        <h1 class="screenreader">LIVRAISON</h1>

        <form class="form" action="checkout.php" method="post">
            <fieldset class="form__fieldset">
                <legend class="form__legend section__h2 section__h2--margin-bottom-reduced">CONTACT</legend>

                <div class="form__input-label-wrapper">
                    <label class="form__label" for="firstname" title="doit comporter uniquement des lettres" pattern="[a-zA-Z]+">Prénom</label>
                    <input class="input form__input" type="text" id="firstname" name="firstname" placeholder="Héloise" />
                    <p class="form__error-message">Doit comporter uniquement des lettres</p>
                </div>

                <div class="form__input-label-wrapper">
                    <label class="form__label required" for="lastname">Nom</label>
                    <input class="input form__input" type="text" id="lastname" name="lastname" placeholder="Dior" required title="Doit comporter uniquement des lettres" pattern="[a-zA-Z]+" />
                    <p class="form__error-message">Doit comporter uniquement des lettres et au moins 1 caractère</p>

                </div>

                <div class="form__input-label-wrapper">
                    <label class="form__label required" for="email">Email</label>
                    <input class="input form__input" type="email" id="email" name="email" placeholder="mon-email@gmail.com" required title="Doit être un email valide" pattern="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?" />
                    <p class="form__error-message">Doit être un email valide</p>

                </div>

                <div class="form__tel-wrapper ">
                    <!-- <div class="form__tel form__tel--country-code">
                        <label class="form__label" for="country-code">Code pays</label>
                        <input class="input form__input" type="number" id="country-code" name="country-code" placeholder="33" />
                    </div> -->

                    <div class="form__tel form__tel--number form__input-label-wrapper">
                        <label class="form__label" for="phoneNumber">Téléphone</label>
                        <input class="input form__input" type="tel" id="phoneNumber" name="phoneNumber" placeholder="0612345678" />
                        <p class="form__error-message">Doit être un numéro de téléphone valide</p>
                    </div>
                </div>

            </fieldset>

            <fieldset class="form__fieldset form__fieldset--radio">
                <legend class="form__legend section__h2 section__h2--margin-bottom-reduced">LIVRAISON</legend>
                <p class="form__error-message">Un type de livraison doit être sélectionné</p>

                <div>
                    <div class="form__input-label-wrapper input input--width-unset">
                        <label class="form__label" for="express">Livraison Express (9€)</label>
                        <input class="input form__input input form__input--radio" type="radio" id="express" name="delivery" value="054d9226-3128-49b5-a458-deab4705847f" required />
                    </div>
                    <p class="input__details">Expédition sous 24H en colissimo</p>

                </div>

                <div>
                    <div class="form__input-label-wrapper input input--width-unset">
                        <label class="form__label" for="followed-letter">Lettre suivi (GRATUIT)</label>
                        <input class="input form__input input form__input--radio" type="radio" id="followed-letter" name="delivery" value="1a77a19f-74a5-419f-8c1d-d63555ab2720" />
                    </div>
                    <p class="input__details">Délais de livraison estimés de 5 à 10 jours.</p>

                </div>


            </fieldset>

            <fieldset class="form__fieldset">
                <legend class="form__legend section__h2 section__h2--margin-bottom-reduced">ADRESSE</legend>

                <div class="form__input-label-wrapper">
                    <label class="form__label required" for="addressLine1">Adresse</label>
                    <input class="input form__input" type="text" id="addressLine1" name="addressLine1" placeholder="35 rue de la Genetais" required />
                    <p class="form__error-message">Doit être une adresse valide</p>

                </div>
                <div class="form__input-label-wrapper">
                    <label class="form__label" for="addressLine2">Complément d'adresse</label>
                    <input class="input form__input" type="text" id="addressLine2" name="addressLine2" placeholder="Bâtiment A, boite aux lettres 42" />
                </div>
                <div class="form__input-label-wrapper">
                    <label class="form__label required" for="country">Pays</label>
                    <select class="input form__input" id="country" name="country" required readonly>
                        <option value="France" selected>France</option>

                    </select>
                </div>
                <div class="form__input-label-wrapper">
                    <label class="form__label required" for="postalCode">Code Postal</label>
                    <input class="input form__input" type="number" id="postalCode" name="postalCode" placeholder="75015" required />
                    <p class="form__error-message">Doit être un code postal valide</p>
                </div>
                <div class="form__input-label-wrapper">
                    <label class="form__label required" for="city">Ville</label>
                    <input class="input form__input" type="text" id="city" name="city" placeholder="Paris" required />
                    <p class="form__error-message">Doit comporter uniquement des lettres et au moins 1 caractère</p>
                </div>
                <div class="form__input-label-wrapper">
                    <label class="form__label" for="comment">Commentaire</label>
                    <textarea class="input form__input form__textarea" id="comment" name="comment" placeholder="J'adore Jegwell !" rows="5"></textarea>
                </div>


            </fieldset>

            <button type="submit" class="main-call-to-action form__submit-button">Passer la commande</button>

        </form>
    </section>
</main>
<?php
include '../components/footer.php';
