<?php
include_once dirname(__FILE__, 2) . '/utils/functions.php';

use function Jegwell\functions\getFileUrl;
use Sanity\Client as SanityClient;

$page_css = getFileUrl('../css/delivery.css', dirname(__FILE__, 2) . '/css/delivery.css');
$page_js = getFileUrl('../js/pages/delivery.js', dirname(__FILE__, 2) . '/js/pages/delivery.js');

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

                <div>
                    <label class="" for="firstname">Prénom</label>
                    <input class="input form__input" type="text" id="firstname" name="firstname" placeholder="Héloise" />
                </div>

                <div>
                    <label class="" for="lastname">Nom</label>
                    <input class="input form__input" type="text" id="lastname" name="lastname" placeholder="Dior" required />
                </div>

                <div>
                    <label class="" for="email">Email</label>
                    <input class="input form__input" type="email" id="email" name="email" placeholder="mon-email@gmail.com" required />
                </div>

                <div class="form__tel-wrapper">
                    <div class="form__tel form__tel--country-code">
                        <label class="" for="country-code">Code pays</label>
                        <input class="input form__input" type="number" id="country-code" name="country-code" placeholder="33" />
                    </div>

                    <div class="form__tel form__tel--number">
                        <label class="" for="phone-number">Téléphone</label>
                        <input class="input form__input" type="tel" id="phone-number" name="phone-number" placeholder="0612345678" />
                    </div>
                </div>

            </fieldset>

            <fieldset class="form__fieldset form__fieldset--radio">
                <legend class="form__legend section__h2 section__h2--margin-bottom-reduced">LIVRAISON</legend>

                <div>
                    <div class="form__input-label-wrapper input input--width-unset">
                        <label class="" for="express">Livraison Express</label>
                        <input class="input form__input input form__input--radio" type="radio" id="express" name="delivery" value="express" />
                    </div>
                    <div class="input__details">Expédition sous 24H en colissimo</div>

                </div>

                <div>
                    <div class="form__input-label-wrapper input input--width-unset">
                        <label class="" for="followed-letter">Lettre suivi (GRATUIT)</label>
                        <input class="input form__input input form__input--radio" type="radio" id="followed-letter" name="delivery" value="followed-letter" />
                    </div>
                    <div class="input__details">Délais de livraison estimés de 5 à 10 jours.</div>

                </div>


            </fieldset>

            <fieldset class="form__fieldset">
                <legend class="form__legend section__h2 section__h2--margin-bottom-reduced">ADRESSE</legend>

                <div>
                    <label class="" for="address-line-1">Adresse</label>
                    <input class="input form__input" type="text" id="address-line-1" name="address-line-1" placeholder="35 rue de la Genetais" />
                </div>
                <div>
                    <label class="" for="address-line-2">Complément d'adresse</label>
                    <input class="input form__input" type="text" id="address-line-2" name="address-line-2" placeholder="Bâtiment A, boite aux lettres 42" />
                </div>
                <div>
                    <label class="" for="country">Pays</label>
                    <select class="input form__input" id="country" name="country">
                        <optgroup label="Populaire">
                            <option value="France">France</option>
                        </optgroup>
                        <optgroup label="Pays">
                            <option value="Ukraine">Ukraine</option>
                            <option value="Belgique">Belgique</option>
                            <option value="Algérie">Algérie</option>
                            <option value="États-Unis">États-Unis</option>
                        </optgroup>
                    </select>
                </div>
                <div>
                    <label class="" for="postal-code">Code Postal</label>
                    <input class="input form__input" type="number" id="postal-code" name="postal-code" placeholder="75015" />
                </div>
                <div>
                    <label class="" for="city">Ville</label>
                    <input class="input form__input" type="text" id="city" name="city" placeholder="Paris" />
                </div>
                <div>
                    <label class="" for="comment">Commentaire</label>
                    <textarea class="input form__input form__textarea" id="comment" name="comment" placeholder="J'adore Jegwell !" rows="5"></textarea>
                </div>


            </fieldset>

            <button type="submit" class="main-call-to-action">Passer la commande</button>

        </form>
    </section>
</main>
<?php
include '../components/footer.php';
