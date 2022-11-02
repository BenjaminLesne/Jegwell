import unittest
import page

from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager

from dotenv import dotenv_values

config = dotenv_values("../../../.env")

class ProductsPage(unittest.TestCase):

    def setUp(self):
        self.chrome_driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
        page_url = config["HOME_PAGE"] + "/src/pages/products.php"
        self.productsPage = page.ProductsPage(self.chrome_driver)
        self.chrome_driver.get(page_url)


    def test_category_button(self):
        modalExist = self.productsPage.does_modal_exist('categoriesButton', 'categoriesModal')
        urlParametersResults = self.productsPage.does_all_url_parameter_match('categories', 'categoriesModal')
        
        assert modalExist
        assert False not in urlParametersResults
    

    def test_sort_button(self):
        modalExist = self.productsPage.does_modal_exist('sort', 'sortModal')
        urlParametersResults = self.productsPage.does_all_url_parameter_match('trier', 'sortModal')
        
        assert modalExist
        assert False not in urlParametersResults

    def test_products_links(self):
        productsLinks = self.productsPage.good_products_links()

        assert False not in productsLinks

    def test_add_to_basket(self):
        create_right_cookie = self.productsPage.does_add_to_basket_create_right_cookie()
        assert create_right_cookie

        increment_quantity_in_cookie = self.productsPage.does_add_to_basket_update_quantity_properly()
        assert increment_quantity_in_cookie
    
      

    def tearDown(self):
        self.chrome_driver.close()



if __name__ == "__main__":
    unittest.main(verbosity=2)