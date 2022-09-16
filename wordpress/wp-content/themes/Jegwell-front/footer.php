<?php
// voir header.php pour les variables utilisées mais non déclarées dans ce fichier
include get_template_directory_uri() . '/jegwell-functions.php';

use function Jegwell\functions\getFileUrl;

$svgs_sprite_url = getFileUrl('/src/assets/svgs-sprite.svg', $currentDirectoryPath);

?>
<a class="backToTopWrapper clickable" href="#topOfThePage">
    <svg class="backToTop">
        <use href="<?php echo get_template_directory_uri() . '/src/assets/svgs-sprite.svg#arrow-up' ?>" />
    </svg>
</a>

<footer class="footer">
    <h2 class="footer__heading">RÉSEAUX SOCIAUX</h2>
    <ul class="footer__list">
        <li class="footer__items"><a class="footer__links" href="<?php echo $instagramUrl ?>">Instagram</a></li>
        <li class="footer__items"><a class="footer__links" href="<?php echo $tikTokUrl ?>">TikTok</a></li>
        <li class="footer__items"><a class="footer__links" href="<?php echo $facebookUrl ?>">Facebook</a></li>
    </ul>

    <h2 class="footer__heading">À PROPOS</h2>
    <ul class="footer__list">
        <!-- <li class="footer__items"><a class="footer__links" href="#">CGV</a></li>
        <li class="footer__items"><a class="footer__links" href="#">Mentions Légales</a></li> -->
        <li class="footer__items"><a class="footer__links" href="#">Livraison</a></li>
        <li class="footer__items"><a class="footer__links" href="#">Contact</a></li>

    </ul>

</footer>