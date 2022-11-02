import unittest
import page
import time

from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager

from dotenv import dotenv_values

config = dotenv_values("../../../.env")

class BasketPage(unittest.TestCase):

    def setUp(self):
        self.chrome_driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
        basket_page_url = config["HOME_PAGE"] + "/src/pages/basket.php"
        products_page_url = config["HOME_PAGE"] + "/src/pages/products.php"
        self.basketPage = page.BasketPage(self.chrome_driver)

        self.chrome_driver.get(products_page_url)

        productsPage = page.ProductsPage(self.chrome_driver)
        # ajoute un produit a notre panier
        productsPage.does_add_to_basket_create_right_cookie()
        
        self.chrome_driver.get(basket_page_url)

    def test_item_delete_button(self):
        item_is_deleted_properly = self.basketPage.does_item_gets_removed_properly()
        assert item_is_deleted_properly

    def test_quantity_modal(self):
        # test l'ouverture de la modal
        modal_opened = self.basketPage.does_quantity_modal_open()
        assert modal_opened

        # test la quantité affiché à l'ouverture de la modal
        modal_right_quantity_when_opened = self.basketPage.does_modal_have_right_quantity_when_opened()
        assert modal_right_quantity_when_opened

        # test l'incrémentation et la décrémentation de la quantité
        quantity_incrementation_and_decrementation_work = self.basketPage.does_quantity_incrementation_and_decrementation_work()
        assert quantity_incrementation_and_decrementation_work

        # test la mise à jour de la quantité au clique de "confirmer"
        quantity_updates_on_confirm = self.basketPage.does_quantity_updates_on_confirm()
        assert quantity_updates_on_confirm

        # test la fermeture de la modal
        self.basketPage.does_quantity_modal_open()
        modal_closed = self.basketPage.does_quantity_modal_close()
        assert modal_closed

    def test_options_modal(self):
        # test l'ouverture de la modal
        modal_opened = self.basketPage.does_options_modal_open()
        assert modal_opened

        # test la mise à jour de l'option au clique de "confirmer"
        options_updates_on_confirm = self.basketPage.does_options_updates_on_confirm()
        assert options_updates_on_confirm

        # test la fermeture de la modal
        modal_closed = self.basketPage.does_options_modal_close()
        assert modal_closed
        

    def tearDown(self):
        self.chrome_driver.close()



if __name__ == "__main__":
    unittest.main(verbosity=2)