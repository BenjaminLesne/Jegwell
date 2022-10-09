import unittest
import json
import time

from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver import ActionChains
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import ElementNotVisibleException, ElementNotSelectableException

from locator import *

class BasePage(object):
    def __init__(self, chrome_driver):
        self.chrome_driver = chrome_driver

    def slugify(self, string):
        characters = {"à": "a", " ": "-", "'": "-", "é": "e", "è": "e", "ç": "c"}
        keys = characters.keys()

        for key in keys:
            string = string.replace(key, characters[key])

        return string.lower()

class HomePage(BasePage):

    def does_burger_button_open_main_menu(self):
        burger_button = self.chrome_driver.find_element(By.CSS_SELECTOR, "#burger-button")
        body = self.chrome_driver.find_element(By.CSS_SELECTOR, "#topOfThePage")
        main_menu = self.chrome_driver.find_element(By.CSS_SELECTOR, "#main-menu")

        burger_button.click()

        body_inline_style = body.get_attribute("style")
        is_main_menu_open = main_menu.get_attribute("open")

        if(is_main_menu_open and "overflow: hidden" in body_inline_style):
            return True
        else:
            print('main_menu.get_attribute("open") :')
            print(main_menu.get_attribute("open"))

            print('"overflow: hidden" in body_inline_style :')
            print("overflow: hidden" in body_inline_style)

            print("final condition :")
            print(is_main_menu_open and "overflow: hidden" in body_inline_style)

            return False

    def does_main_menu_display_right_links(self):
        # a lancer APRES que le main-menu soit ouvert
        are_results_good = True

        links = self.chrome_driver.find_elements(By.CSS_SELECTOR, ".main-menu__link")
        base_url = self.chrome_driver.current_url
        expected_links_href = [
        base_url + "creations",
        base_url + "panier",
        base_url,
        "http://" + base_url + "#cat%C3%A9gories",
        ]

        for link in links:
            href = link.get_attribute("href")
            if ("http://" + href) not in expected_links_href:
                are_results_good = False
                print("href not working (sans http://):")
                print(href)
                print("expected_links_href[0]")
                print(expected_links_href[4])
                break
            
        return are_results_good

    def does_main_menu_close_properly(self):
        wait = WebDriverWait(self.chrome_driver, timeout=10, poll_frequency=1, ignored_exceptions=[ElementNotVisibleException, ElementNotSelectableException])
        
        close_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "#main-menu-close-button")))
        main_menu = self.chrome_driver.find_element(By.CSS_SELECTOR, "#main-menu")

        close_button.click()

        is_main_menu_open = main_menu.get_attribute("open")

        if(is_main_menu_open):
            # debug purposes
            print("is_main_menu_open :")
            print(is_main_menu_open)


        return is_main_menu_open == None
        
    

    def are_categories_links_good(self):
        # vérifie que les liens vers les catégories sont correctes
        categoriesLinks = self.chrome_driver.find_elements(By.CSS_SELECTOR, ".categories__link")
        base_url = self.chrome_driver.current_url

        are_results_good = True
        expected_links_href = [
            base_url + "creations?categories=" + "collier",
            base_url + "creations?categories=" + "bagues",
            base_url + "creations?categories=" + self.slugify("Boucles d'oreilles"),
            base_url + "creations?categories=" + "bracelet",
            base_url + "creations?categories=" + self.slugify("Boite à bijoux"),
            base_url + "creations?categories=" + "abonnement"]

        for link in categoriesLinks:
            href = link.get_attribute("href")
            if ("http://" + href) not in expected_links_href:
                are_results_good = False
                print("href not working:")
                print(href)
                print("expected_links_href[0]")
                print(expected_links_href[0])
                break
                
        return are_results_good


class ProductsPage(BasePage):

    def does_modal_exist(self, buttonId, modalId):
        # vérifie que la modal catégories s'affiche au clique du bouton catégorie
        button = self.chrome_driver.find_element(By.ID, buttonId)
        button.click()
        modals = self.chrome_driver.find_elements(By.CSS_SELECTOR, '#' + modalId + '[open=""]')

        return len(modals) != 0

    def does_all_url_parameter_match(self, parameterKey, modalId):
        # vérifie le paramètre de l'url du premier lien de la modal 
        modal = self.chrome_driver.find_element(By.CSS_SELECTOR, f'#{modalId}[open=""]')

        modalLinks = modal.find_elements(*ProductsPageLocators.MODAL_LINK)
        results = []

        for link in modalLinks:
            link_text = link.text
            link_href = link.get_attribute('href')
            link_text_slugified = self.slugify(link_text)

            result = (parameterKey + "=" + link_text_slugified) in link_href

            results.append(result)

        return results 

    def good_products_links(self):
        # vérifie le lien contient le nom du produit affiché
        products = self.chrome_driver.find_elements(By.CLASS_NAME, 'product')
        results = []

        for product in products:
            link = product.find_element(By.CSS_SELECTOR, '.product__image-wrapper')
            link_href = link.get_attribute("href")
            name = product.find_element(By.CSS_SELECTOR, '.product__name > span').text
            result = self.slugify(name) in link_href
            
            results.append(result)
        
        return results

    def does_add_to_basket_create_right_cookie(self):
        # condition initial: aucun cookie productsToBasket présent sur le site
        add_to_basket_button = self.chrome_driver.find_element(*ProductsPageLocators.ADD_TO_BASKET_BUTTON)
        
        product_id = add_to_basket_button.get_attribute("data-product-id")
        
        # selenium ne peut pas cliquer sur un élément non visible à l'écran
        # donc on scroll pour le rendre visible avec JavaScript vu que je n'y arrive pas avec selenium
        self.chrome_driver.execute_script('return arguments[0].scrollIntoView()', add_to_basket_button)
        time.sleep(1) # sans cette ligne, le click se fait trop vite et une erreur est retournée
        
        add_to_basket_button.click()
        
        basket_cookies = self.chrome_driver.get_cookie("productsToBasket")

        expected_value = [{"id": product_id, "quantity": 1}]
        current_value = json.loads(basket_cookies['value'])

        return expected_value == current_value

    def does_add_to_basket_update_quantity_properly(self):
            # condition initial: un cookie productsToBasket est déjà
            # présent sur le site suite à un premier clique de l'utilisateur
            # sur le bouton ajouter au panier
            # ce code doit être lancé APRES does_add_to_basket_create_right_cookie
            add_to_basket_button = self.chrome_driver.find_element(*ProductsPageLocators.ADD_TO_BASKET_BUTTON)
            product_id = add_to_basket_button.get_attribute("data-product-id")
            add_to_basket_button.click()

            basket_cookies = self.chrome_driver.get_cookie("productsToBasket")

            expected_value = [{"id": product_id, "quantity": 2}]
            current_value = json.loads(basket_cookies['value'])

            return expected_value == current_value

    def does_add_to_basket_add_new_product(self):
            # condition initial: un cookie productsToBasket est déjà
            # présent sur le site suite à un premier clique de l'utilisateur
            # sur le bouton ajouter au panier
            # ce code doit être lancé APRES does_add_to_basket_create_right_cookie
            add_to_basket_buttons = self.chrome_driver.find_elements(*ProductsPageLocators.ADD_TO_BASKET_BUTTONs[0])
            if(len(add_to_basket_buttons) > 0):
                product_id = add_to_basket_buttons[0].get_attribute("data-product-id")
                index = 1
                new_product_id = "Azertyt123"

                if(len(add_to_basket_buttons) < 2):
                    driver.execute_script("arguments[0].setAttribute('value',arguments[1])", add_to_basket_buttons[0], new_product_id)
                    index = 0
                else:
                    new_product_id = add_to_basket_buttons[1].get_attribute("data-product-id")
                    
                add_to_basket_buttons[index].click()
                basket_cookies = self.chrome_driver.get_cookie("productsToBasket")

                expected_value = [{"id": product_id, "quantity": 2}, {"id": new_product_id, "quantity": 1},]
                current_value = json.loads(basket_cookies['value'])

                return expected_value == current_value




        
             


