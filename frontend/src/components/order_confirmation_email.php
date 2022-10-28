<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html lang="fr" xmlns:v="urn:schemas-microsoft-com:vml">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
    <!-- PAS MIS A JOUR 28/10/2022 l'email dans la functions getOrderConfirmationEmail est le + récent / à jour -->
    <!-- PAS MIS A JOUR -->
    <!-- PAS MIS A JOUR -->
    <!-- PAS MIS A JOUR -->
    <!-- PAS MIS A JOUR -->
    <!-- PAS MIS A JOUR -->
    <!-- PAS MIS A JOUR -->
    <!-- PAS MIS A JOUR -->
    <!-- PAS MIS A JOUR -->
    <!-- PAS MIS A JOUR -->
    <!-- PAS MIS A JOUR -->
    <!-- PAS MIS A JOUR -->
    <!-- PAS MIS A JOUR -->
    <!-- PAS MIS A JOUR -->
    <!-- PAS MIS A JOUR -->
    <!-- PAS MIS A JOUR -->
    <!-- PAS MIS A JOUR -->
    <!-- header -->
    <table align="center" bgcolor="#fff" width="100%" border="0" cellpadding="0" cellspacing="0">
        <tbody>
            <tr>
                <td height="30" style="font-size: 30px; line-height: 30px;">&nbsp;</td>
            </tr>
            <tr>
                <td align="center" style="text-align: center;">
                    <a href="https://jegwell.fr" style="font-size: 30px; line-height: 30px; color: rgb(172, 140, 48)">
                        JEGWELL
                    </a>
                </td>
            </tr>
            <tr>
                <td height="30" style="font-size: 30px; line-height: 30px;">&nbsp;</td>
            </tr>
            <tr>
                <td align="center" style="text-align: center;">
                    Confirmation de votre commande : <?php echo $order['_id'] ?>
                </td>
            </tr>
            <tr>
                <td height="30" style="font-size: 30px; line-height: 30px;">&nbsp;</td>
            </tr>
        </tbody>
    </table>
    <!-- fin header -->

    <!-- récapitulatif -->
    <table align="center" bgcolor="#fff" width="100%" border="0" cellpadding="0" cellspacing="0">
        <tbody>
            <tr>
                <td height="30" style="font-size: 30px; line-height: 30px;">&nbsp;</td>
            </tr>
            <tr>
                <td align="center" style="text-align: center;">
                    Récapitulatif:
                </td>
            </tr>
            <tr>
                <td height="30" style="font-size: 30px; line-height: 30px;">&nbsp;</td>
            </tr>
            <table align="center" bgcolor="#fff" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                    <?php

                    foreach ($order['productsToBasket'] as $product) {
                        $unit_price_time_quantity = $product['price'] * $product['quantity'];
                        // $price_in_euros = getPriceInEuros($unit_price_time_quantity);

                        echo "
                                <tr>
                                    <td align='center' style='text-align: center;'>$product[name] - $product[option] x $product[quantity]</td>
                                    <td align='center' style='text-align: center;'>$unit_price_time_quantity €</td>
                                </tr>
                                ";
                    }


                    echo "<tr>
                        <td align='center' style='text-align: center;'>Livraison - $delivery_name</td>
                        <td align='center' style='text-align: center;'>$delivery_price €</td>
                    </tr>"
                    ?>
                    <tr>
                        <td height="30" style="font-size: 30px; line-height: 30px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td align="center" style="text-align: center;">TOTAL TTC :</td>
                        <td align="center" style="text-align: center;"><?php echo $order_price_in_euros ?> €</td>
                    </tr>
                    <tr>
                        <td height="30" style="font-size: 30px; line-height: 30px;">&nbsp;</td>
                    </tr>
                </tbody>
            </table>
        </tbody>

    </table>
    <!-- fin récapitulatif -->
    <!-- Adresse de livraison -->
    <table align="center" bgcolor="#fff" width="100%" border="0" cellpadding="0" cellspacing="0">
        <tbody>
            <tr>
                <td height="30" style="font-size: 30px; line-height: 30px;">&nbsp;</td>
            </tr>
            <tr>
                <td align="center" style="text-align: center;">
                    Adresse de livraison :
                </td>
            </tr>
            <tr>
                <td height="30" style="font-size: 30px; line-height: 30px;">&nbsp;</td>
            </tr>
            <tr>
                <td align="center" style="text-align: center;">
                    <?php echo $order['addressLine1'] . ', ' .  $order['postalCode'] . ', ' . $order['city'] . ', ' . $order['country'] ?>
                </td>
            </tr>
            <tr>
                <td align="center" style="text-align: center;">
                    <?php echo $order['addressLine2'] ?>
                </td>
            </tr>
            <tr>
                <td height="30" style="font-size: 30px; line-height: 30px;">&nbsp;</td>
            </tr>
            <tr>
                <td height="30" style="font-size: 30px; line-height: 30px;">&nbsp;</td>
            </tr>
            <tr>
                <td align="center" style="text-align: center;">
                    Au nom de :
                </td>
            </tr>
            <tr>
                <td height="30" style="font-size: 30px; line-height: 30px;">&nbsp;</td>
            </tr>
            <tr>
                <td align="center" style="text-align: center;">
                    <?php echo $order['lastname'] ?>
                </td>
            </tr>
            <tr>
                <td align="center" style="text-align: center;">
                    <?php echo $order['firstname'] ?>
                </td>
            </tr>
            <tr>
                <td height="30" style="font-size: 30px; line-height: 30px;">&nbsp;</td>
            </tr>
        </tbody>
    </table>
    <!-- fin adresse de livraison -->
    <!-- conctact -->
    <table align="center" bgcolor="#fff" width="100%" border="0" cellpadding="0" cellspacing="0">
        <tbody>
            <tr>
                <td height="30" style="font-size: 30px; line-height: 30px;">&nbsp;</td>
            </tr>
            <tr>
                <td align="center" style="text-align: center;">
                    Un soucis ? Contactez-nous !
                </td>
            </tr>
            <tr>
                <td height="30" style="font-size: 30px; line-height: 30px;">&nbsp;</td>
            </tr>
            <tr>
                <td align="center" style="text-align: center;">
                    jegwellparis@gmail.com
                </td>
            </tr>
            <tr>
                <td height="30" style="font-size: 30px; line-height: 30px;">&nbsp;</td>
            </tr>
        </tbody>
    </table>
    <!-- fin contact -->
</body>

</html>