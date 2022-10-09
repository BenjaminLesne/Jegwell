import unittest
import page

from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager

class HomePage(unittest.TestCase):

    def setUp(self):
        self.chrome_driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
        page_url = "http://localhost:8080/"
        self.homePage = page.HomePage(self.chrome_driver)
        self.chrome_driver.get(page_url)


    def test_categories_links(self):
        good_categories_links = self.homePage.are_categories_links_good()
                
        assert good_categories_links

    def test_main_menu(self):
        burger_button_opens_main_menu = self.homePage.does_burger_button_open_main_menu()
        assert burger_button_opens_main_menu   

        # does_main_menu_display_right_links doit être lancé APRES que le main-menu soit ouvert
        # pour cela, on peut lancé does_burger_button_open_main_menu() avant
        main_menu_display_right_links = self.homePage.does_main_menu_display_right_links()  
        assert main_menu_display_right_links

        main_menu_close_properly = self.homePage.does_main_menu_close_properly()  
        assert main_menu_close_properly   



    def tearDown(self):
        self.chrome_driver.close()



if __name__ == "__main__":
    unittest.main(verbosity=2)