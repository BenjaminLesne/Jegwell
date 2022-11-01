import unittest
import page

from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager

from dotenv import dotenv_values

config = dotenv_values("../../../.env")

class DeliveryPage(unittest.TestCase):

    def setUp(self):
        self.chrome_driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
        delivery_page_url = config["HOME"] + "/panier/livraison"
        products_page_url = config["HOME"] + "/creations"
        self.deliveryPage = page.DeliveryPage(self.chrome_driver)

        self.chrome_driver.get(products_page_url)

        productsPage = page.ProductsPage(self.chrome_driver)
        # ajoute un produit a notre panier
        productsPage.does_add_to_basket_create_right_cookie()
        
        self.chrome_driver.get(delivery_page_url)


    def test_submit_wrong_inputs(self):
        submit_on_wrong_inputs = self.deliveryPage.does_it_submit_on_wrong_inputs()
        assert submit_on_wrong_inputs == False

    def test_submit_good_inputs(self):
        submit_on_good_inputs = self.deliveryPage.does_it_submit_on_good_inputs()
        assert submit_on_good_inputs

    def test_unknown_productsToBasket_cookie(self):
        assert False

    def test_empty_productsToBasket_cookie(self):
        # expected_basket_alert_message = "Votre panier est vide. Vous allez être redirigé vers les créations Jegwell !"
        # redirect_on_empty_basket = self.checkoutPage.does_it_redirect_when_cookie_missing("productsToBasket", expected_basket_alert_message, "http://localhost/creations")
        # assert redirect_on_empty_basket
        assert False
      

    def tearDown(self):
        self.chrome_driver.close()



if __name__ == "__main__":
    unittest.main(verbosity=2)