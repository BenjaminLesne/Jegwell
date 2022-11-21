import unittest
import page
import time

from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager

from dotenv import dotenv_values

config = dotenv_values("../../../.env")

class CheckoutPage(unittest.TestCase):

    def setUp(self):
        self.chrome_driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
        self.checkoutPage = page.CheckoutPage(self.chrome_driver)

        checkout_page_url = config["HOME_PAGE"] + "/panier/livraison/paiement"
        products_page_url = config["HOME_PAGE"] + "/creations"
        delivery_page_url = config["HOME_PAGE"] + "/panier/livraison"

        self.chrome_driver.get(products_page_url)

        productsPage = page.ProductsPage(self.chrome_driver)
        # ajoute un produit a notre panier
        productsPage.does_add_to_basket_create_right_cookie()

        self.chrome_driver.get(delivery_page_url)

        deliveryPage = page.DeliveryPage(self.chrome_driver)

        # envoie un formulaire correcte afin d'être redirigé vers la page de paiement
        deliveryPage.does_it_submit_on_good_inputs()


        


    def test_stripe_token(self):
        is_right_token = self.checkoutPage.is_it_right_token()
        assert is_right_token

    def test_empty_deliveryOption_cookie(self):
        # expected_delivery_alert_message = "Nous ne trouvons pas votre méthode de récupération. Vous allez être redirigé vers la page de livraison !"
        # redirect_on_empty_delivery_option = self.checkoutPage.does_it_redirect_when_cookie_missing("deliveryOption", expected_delivery_alert_message, "http://localhost/panier/livraison")
        # assert redirect_on_empty_delivery_option
        assert False

    def test_empty_productsToBasket_cookie(self):
        # expected_basket_alert_message = "Votre panier est vide. Vous allez être redirigé vers les créations Jegwell !"
        # redirect_on_empty_basket = self.checkoutPage.does_it_redirect_when_cookie_missing("productsToBasket", expected_basket_alert_message, "http://localhost/creations")
        # assert redirect_on_empty_basket
        assert False

    def test_unknown_productsToBasket_cookie(self):
        assert False

    def test_unknown_deliveryOption_cookie(self):
        assert False

    def test_wrong_card_credentials(self):
        does_not_submit_on_wrong_credentials = self.checkoutPage.does_it_submit_on_wrong_credentials()
        assert does_not_submit_on_wrong_credentials

    def test_refunds(self):
        # https://stripe.com/docs/testing
        assert False

    def test_redirection_on_success_payment(self):    
        redirect_on_payment_success = self.checkoutPage.does_it_redirection_on_success_payment()
        assert redirect_on_payment_success
      

    def tearDown(self):
        self.chrome_driver.close()



if __name__ == "__main__":
    unittest.main(verbosity=2)