import unittest
import json
import time

from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver import ActionChains
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions
from selenium.common.exceptions import ElementNotVisibleException, ElementNotSelectableException, UnexpectedAlertPresentException, NoSuchElementException

from locator import *

from dotenv import dotenv_values

config = dotenv_values("../../../.env")

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
        base_url = config["HOME_PAGE"]
        expected_links_href = [
        base_url + "/creations",
        base_url + "/panier",
        base_url,
        base_url + "/",
        base_url + "#cat%C3%A9gories",
        base_url + "/#cat%C3%A9gories",
        ]

        for link in links:
            href = link.get_attribute("href")
            if href not in expected_links_href:
                are_results_good = False
                print("href not working:")
                print(href)
                break
            
        return are_results_good

    def does_main_menu_close_properly(self):
        wait = WebDriverWait(self.chrome_driver, timeout=10, poll_frequency=1, ignored_exceptions=[ElementNotVisibleException, ElementNotSelectableException])
        
        close_button = wait.until(expected_conditions.element_to_be_clickable((By.CSS_SELECTOR, "#main-menu-close-button")))
        main_menu = self.chrome_driver.find_element(By.CSS_SELECTOR, "#main-menu")
        
        time.sleep(1) # autrement ça clique trop vite parfois
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
        base_url = config["HOME_PAGE"]

        are_results_good = True
        expected_links_href = [
            base_url + "/creations?categories=" + "collier",
            base_url + "/creations?categories=" + "bagues",
            base_url + "/creations?categories=" + self.slugify("Boucles d'oreilles"),
            base_url + "/creations?categories=" + "bracelet",
            base_url + "/creations?categories=" + self.slugify("Boite à bijoux"),
            base_url + "/creations?categories=" + "abonnement"]

        for link in categoriesLinks:
            href = link.get_attribute("href")
            if href not in expected_links_href:
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

        expected_value = [{ "id": product_id, "option": "default","quantity": 1 }]
        current_value = json.loads(basket_cookies['value'])

        result = expected_value == current_value

        if(result == False):
            print("expected_value :")
            print(expected_value)

            print("current_value :")
            print(current_value)

        return result

    def does_add_to_basket_update_quantity_properly(self):
            # condition initial: un cookie productsToBasket est déjà
            # présent sur le site suite à un premier clique de l'utilisateur
            # sur le bouton ajouter au panier
            # ce code doit être lancé APRES does_add_to_basket_create_right_cookie
            add_to_basket_button = self.chrome_driver.find_element(*ProductsPageLocators.ADD_TO_BASKET_BUTTON)
            product_id = add_to_basket_button.get_attribute("data-product-id")
            add_to_basket_button.click()

            basket_cookies = self.chrome_driver.get_cookie("productsToBasket")

            expected_value = [{"id": product_id, "option": "default", "quantity": 2}]
            current_value = json.loads(basket_cookies['value'])

            result = expected_value == current_value

            if(result == False):
                # debug purposes
                print("expected_value :")
                print(expected_value)
                print("current_value :")
                print(current_value)

            return result

    def does_add_to_basket_add_new_product(self):
            # condition initial: un cookie productsToBasket est déjà
            # présent sur le site suite à un premier clique de l'utilisateur
            # sur le bouton ajouter au panier
            # ce code doit être lancé APRES does_add_to_basket_create_right_cookie
            add_to_basket_buttons = self.chrome_driver.find_elements(*ProductsPageLocators.ADD_TO_BASKET_BUTTON)
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

                expected_value = {product_id: {"id": product_id, "quantity": 2}, new_product_id: {"id": new_product_id, "quantity": 1}}
                current_value = json.loads(basket_cookies['value'])

                result = expected_value == current_value

                if(result == False):
                    # debug purposes
                    print("expected_value :")
                    print(expected_value)
                    print("current_value :")
                    print(current_value)

                return result


class BasketPage(BasePage):

    def does_item_gets_removed_properly(self):
        remove_button = self.chrome_driver.find_element(By.CSS_SELECTOR, '.item__remove')
        remove_button.click()
        new_remove_buttons = self.chrome_driver.find_elements(By.CSS_SELECTOR, '.item__remove')
        cookie = self.chrome_driver.get_cookie("productsToBasket")
        cookie_contains_null = "null" in cookie['value']

        result = len(new_remove_buttons) == 0 and cookie_contains_null == False

        if(result == False):
            # debug purposes
            print("cookie_contains_null :")
            print(cookie_contains_null)  
            print("number of remove_buttons :")
            print(len(new_remove_buttons))  
            print("cookies :")
            print(cookie['value'])  

        return result


    def does_quantity_modal_open(self):
        # vérifie que la modal quantité s'affiche au clique du bouton quantité
        button = self.chrome_driver.find_element(*BasketPageLocators.FIRST_QUANTITY_BUTTON)
        button.click()
        modals = self.chrome_driver.find_elements(By.CSS_SELECTOR, '#quantityModal[open=""]')

        return len(modals) > 0  

    def does_options_modal_open(self):
        # vérifie que la modal quantité s'affiche au clique du bouton quantité
        button = self.chrome_driver.find_element(*BasketPageLocators.FIRST_OPTIONS_BUTTON)
        product_id = button.get_attribute("data-product-id")
        product_option = button.get_attribute("data-product-option")
        button.click()
        modals = self.chrome_driver.find_elements(By.CSS_SELECTOR, f'.optionsModal[data-product-id="{product_id}"][data-product-option="{product_option}"][open=""]')

        return len(modals) > 0  

    def does_quantity_modal_close(self):
        modal = self.chrome_driver.find_element(*BasketPageLocators.QUANTITY_MODAL)
        modalCloseButton = modal.find_element(By.CSS_SELECTOR, '.close-button--modal')
        modalCloseButton.click()

        is_modal_open = modal.get_attribute("open")

        if(is_modal_open):
            # debug purposes
            print("is_modal_open :")
            print(is_modal_open)        

        return is_modal_open == None
    
    def does_modal_have_right_quantity_when_opened(self):
        modal = self.chrome_driver.find_element(*BasketPageLocators.QUANTITY_MODAL)
        modalQuantityElement = modal.find_element(By.CSS_SELECTOR, '.quantity-setter__value')
        quantityAttribute = modalQuantityElement.get_attribute('data-quantity')
        productId = modal.get_attribute('data-product-id')
        basket_cookies = self.chrome_driver.get_cookie("productsToBasket")
        products_to_basket = json.loads(basket_cookies['value'])
        
        result = quantityAttribute == modalQuantityElement.text == str(products_to_basket[0]['quantity'])

        if(result == False):
            print("quantityAttribute type? :")
            print(quantityAttribute)
            print(type(quantityAttribute))


            print("modalQuantityElement type? :")
            print(modalQuantityElement.text)
            print(type(modalQuantityElement.text))

            print("products_to_basket[productId]['quantity'] type? :")
            print(products_to_basket[productId]['quantity']) 
            print(type(products_to_basket[productId]['quantity']))      

  
        return result

    def does_quantity_incrementation_and_decrementation_work(self):
        increment_button = self.chrome_driver.find_element(By.CSS_SELECTOR, '.quantity-setter__button > .plus')
        decrement_button = self.chrome_driver.find_element(By.CSS_SELECTOR, '.quantity-setter__button > .minus')
        quantity_displayed_element = self.chrome_driver.find_element(By.CSS_SELECTOR, '.quantity-setter__value')
        modal = self.chrome_driver.find_element(*BasketPageLocators.QUANTITY_MODAL)
        
        increment_button.click()
        increment_button.click()
        increment_result = quantity_displayed_element.text == modal.get_attribute('data-quantity') == "3"

        if(increment_result == False):

            print("quantity_displayed_element.text :")
            print(quantity_displayed_element.text)

            print("modal.get_attribute('data-quantity') :")
            print(modal.get_attribute('data-quantity'))

        decrement_button.click()
        decrement_result = quantity_displayed_element.text == modal.get_attribute('data-quantity') == "2"

        if(decrement_result == False):

            print("quantity_displayed_element.text :")
            print(quantity_displayed_element.text)

            print("modal.get_attribute('data-quantity') :")
            print(modal.get_attribute('data-quantity'))

        return increment_result and decrement_result

    def does_options_modal_close(self):
        modal = self.chrome_driver.find_element(*BasketPageLocators.OPTIONS_MODAL)
        modalCloseButton = modal.find_element(By.CSS_SELECTOR, '.close-button--modal')
        modalCloseButton.click()

        is_modal_open = modal.get_attribute("open")

        if(is_modal_open):
            # debug purposes
            print("is_modal_open :")
            print(is_modal_open)        

        return is_modal_open == None

    def does_quantity_updates_on_confirm(self):
        first_quantity_button = self.chrome_driver.find_element(*BasketPageLocators.FIRST_QUANTITY_BUTTON)
        confirm_button = self.chrome_driver.find_element(By.CSS_SELECTOR, '#quantityModal .main-call-to-action')
        
        quantity_set = self.chrome_driver.find_element(By.CSS_SELECTOR, '.quantity-setter__value').text
        item_price = int(self.chrome_driver.find_element(By.CSS_SELECTOR, '.item__price').text.replace(" €", ""))
        # variables à vérifier:
        current_quantity = first_quantity_button.get_attribute("data-quantity")
        subtotal_price = self.chrome_driver.find_element(*BasketPageLocators.SUBTOTAL_PRICE_ELEMENT).text
        number_of_articles_text = self.chrome_driver.find_element(*BasketPageLocators.ARTICLES_ELEMENT).text


        confirm_button.click()

        new_first_quantity_button = self.chrome_driver.find_element(*BasketPageLocators.FIRST_QUANTITY_BUTTON)

        new_current_quantity = new_first_quantity_button.get_attribute("data-quantity")
        new_subtotal_price = self.chrome_driver.find_element(*BasketPageLocators.SUBTOTAL_PRICE_ELEMENT).text
        new_number_of_articles_text = self.chrome_driver.find_element(*BasketPageLocators.ARTICLES_ELEMENT).text

        # les variables devraient être différente des originales
        number_of_articles_changed = new_number_of_articles_text != number_of_articles_text
        subtotal_price_changed = new_subtotal_price != subtotal_price
        current_quantity_changed = new_current_quantity != current_quantity

        # les variables devraient avoir ces résultats
        number_of_articles_match_expectation = new_number_of_articles_text == f"({quantity_set} articles)" and new_number_of_articles_text == "(2 articles)"
        subtotal_price_match_expectation = str(int(new_current_quantity) * item_price) in new_subtotal_price  and new_subtotal_price == "70 €"
        current_quantity_match_expectation = new_current_quantity == quantity_set and new_current_quantity == "2"

        results = [
            number_of_articles_changed,
            subtotal_price_changed,
            current_quantity_changed,
            number_of_articles_match_expectation,
            subtotal_price_match_expectation,
            current_quantity_match_expectation
        ]

        if(False in results):
            print("number_of_articles_changed :")
            print(number_of_articles_changed)

            print("subtotal_price_changed :")
            print(subtotal_price_changed)

            print("current_quantity_changed :")
            print(current_quantity_changed)

            print("number_of_articles_match_expectation :")
            print(number_of_articles_match_expectation)

            print("subtotal_price_match_expectation :")
            print(subtotal_price_match_expectation)

            print("current_quantity_match_expectation :")
            print(current_quantity_match_expectation)

            print("DEBUUUUUUUUUUUUUUUUUG :")
            print(new_number_of_articles_text == "(2 articles)")
            print(new_number_of_articles_text)

        return False not in results 

    def does_options_updates_on_confirm(self):
        first_options_button = self.chrome_driver.find_element(*BasketPageLocators.FIRST_OPTIONS_BUTTON)
        confirm_button = self.chrome_driver.find_element(By.CSS_SELECTOR, '.optionsModal .main-call-to-action')
        option_unselected = self.chrome_driver.find_element(By.CSS_SELECTOR, '.optionsModal .product-option-wrapper:not(.selected)')

        expected_new_option = option_unselected.get_attribute('data-product-option')
        expected_new_product_id = option_unselected.get_attribute('data-product-id')  

        current_option = first_options_button.get_attribute('data-product-option')
        current_product_id = first_options_button.get_attribute('data-product-id')

        option_unselected.click()

        confirm_button.click()

        new_first_options_button = self.chrome_driver.find_element(*BasketPageLocators.FIRST_OPTIONS_BUTTON)
        # new_first_options_button.click()
        self.does_options_modal_open()

        new_option_unselected_element = self.chrome_driver.find_element(By.CSS_SELECTOR, '.optionsModal .product-option-wrapper:not(.selected)')
        new_option_selected = self.chrome_driver.find_element(By.CSS_SELECTOR, '.optionsModal .product-option-wrapper.selected').get_attribute('data-product-option')
        new_product_id = new_option_unselected_element.get_attribute('data-product-id')

        option_value_displayed = new_first_options_button.find_element(By.CSS_SELECTOR, '.setting__value').text

        condition1 = expected_new_option !=  current_option
        condition2 = expected_new_product_id == current_product_id == new_product_id
        condition3 = option_value_displayed == expected_new_option == new_option_selected

        results = condition1 and condition2 and condition3

        if(results == False):
            print("condition1 :")
            print(condition1)
            print("condition2 :")
            print(condition2)
            print("condition3 :")
            print(condition3)
            


        return results   

        
class CheckoutPage(BasePage):

    def does_it_redirect_when_cookie_missing(self, cookie_name, expected_alert_message, expected_redirection_url):
        wait = WebDriverWait(self.chrome_driver, timeout=10, poll_frequency=1, ignored_exceptions=[UnexpectedAlertPresentException])

        self.chrome_driver.delete_cookie(cookie_name)
        # Wait for the alert to be displayed and store it in a variable
        alert = wait.until(expected_conditions.alert_is_present())

        # Press the OK button
        alert.accept()

        # On va sur la page de paiement
        self.chrome_driver.get(config["HOME_PAGE"] + "/src/pages/checkout.php")

        # Wait for the alert to be displayed and store it in a variable
        alert = wait.until(expected_conditions.alert_is_present())

        current_alert_message = alert.text

        alert_has_right_message = expected_alert_message == current_alert_message

        # Press the OK button
        alert.accept()

        current_url = self.chrome_driver.current_url

        is_right_redirection = current_url == expected_redirection_url

        result = alert_has_right_message and is_right_redirection

        if(alert_has_right_message == False):
            print("expected_alert_message :")
            print(">>" + expected_alert_message)
            print("current_alert_message :")
            print(">>" + current_alert_message)

        if(is_right_redirection == False):
            print("current_url :")
            print(">>" + current_url)
            print("expected_redirection_url :")
            print(">>" + expected_redirection_url)
            

        return result


class DeliveryPage(BasePage):

    def does_it_submit_on_wrong_inputs(self):
        lastname_input = self.chrome_driver.find_element(*DeliveryPageLocators.LASTNAME_INPUT)
        lastname_error_message = self.chrome_driver.find_element(*DeliveryPageLocators.LASTNAME_ERROR_MESSAGE)

        email_input = self.chrome_driver.find_element(*DeliveryPageLocators.EMAIL_INPUT)
        email_error_message = self.chrome_driver.find_element(*DeliveryPageLocators.EMAIL_ERROR_MESSAGE)

        delivery_input_wrapper = self.chrome_driver.find_element(*DeliveryPageLocators.DELIVERY_INPUT_WRAPPER)
        delivery_input_wrapper_error_message = self.chrome_driver.find_element(*DeliveryPageLocators.DELIVERY_INPUT_WRAPPER_ERROR_MESSAGE)

        express_input = self.chrome_driver.find_element(*DeliveryPageLocators.EXPRESS_INPUT)

        followed_letter_input = self.chrome_driver.find_element(*DeliveryPageLocators.FOLLOWED_LETTER_INPUT)

        address_line_1_input = self.chrome_driver.find_element(*DeliveryPageLocators.ADDRESS_LINE_1_INPUT)
        address_line_1_error_message = self.chrome_driver.find_element(*DeliveryPageLocators.ADDRESS_LINE_1_ERROR_MESSAGE)

        postal_code_input = self.chrome_driver.find_element(*DeliveryPageLocators.POSTAL_CODE_INPUT)
        postal_code_error_message = self.chrome_driver.find_element(*DeliveryPageLocators.POSTAL_CODE_ERROR_MESSAGE)

        city_input = self.chrome_driver.find_element(*DeliveryPageLocators.CITY_INPUT)
        city_error_message = self.chrome_driver.find_element(*DeliveryPageLocators.CITY_ERROR_MESSAGE)

        submit_button = self.chrome_driver.find_element(*DeliveryPageLocators.SUBMIT_BUTTON)

        results = []
        # tous les inputs devraient être invalid à la soumission du formulaire
        wait = WebDriverWait(self.chrome_driver, timeout=3, poll_frequency=1, ignored_exceptions=[ElementNotVisibleException])

        #   tous les champs sont vide
        self.chrome_driver.execute_script('return arguments[0].scrollIntoView()', submit_button)
        time.sleep(1)
        submit_button.click()

        invalid_inputs = self.chrome_driver.find_elements(By.CSS_SELECTOR, ".invalid")
        results.append(len(invalid_inputs) == 6)

        def checkAllErrorMessagesExist():
            lastname_error_message_visible = wait.until(expected_conditions.visibility_of(lastname_error_message))
            email_error_message_visible = wait.until(expected_conditions.visibility_of(email_error_message))
            delivery_input_wrapper_error_message = wait.until(expected_conditions.visibility_of(delivery_input_wrapper))
            address_line_1_error_message_visible = wait.until(expected_conditions.visibility_of(address_line_1_error_message))
            postal_code_error_message_visible = wait.until(expected_conditions.visibility_of(postal_code_error_message))

        checkAllErrorMessagesExist()



        #   tous les champs contiennent des mauvaises valeurs
        self.chrome_driver.execute_script('return arguments[0].scrollIntoView()', lastname_input)
        time.sleep(1)

        ActionChains(self.chrome_driver)\
        .send_keys_to_element(lastname_input, "123")\
        .send_keys_to_element(email_input, "not an email")\
        .perform()

        self.chrome_driver.execute_script('return arguments[0].scrollIntoView()', postal_code_input)

        ActionChains(self.chrome_driver)\
        .pause(1)\
        .send_keys_to_element(postal_code_input, "e")\
        .send_keys_to_element(city_input, "123")\
        .perform()

        submit_button.click()

        invalid_inputs = self.chrome_driver.find_elements(By.CSS_SELECTOR, ".invalid")
        results.append(len(invalid_inputs) == 6)

        checkAllErrorMessagesExist()

        return False in results

    def does_it_submit_on_good_inputs(self):
    
        lastname_input = self.chrome_driver.find_element(*DeliveryPageLocators.LASTNAME_INPUT)
        lastname_error_message = self.chrome_driver.find_element(*DeliveryPageLocators.LASTNAME_ERROR_MESSAGE)

        email_input = self.chrome_driver.find_element(*DeliveryPageLocators.EMAIL_INPUT)
        email_error_message = self.chrome_driver.find_element(*DeliveryPageLocators.EMAIL_ERROR_MESSAGE)

        delivery_input_wrapper = self.chrome_driver.find_element(*DeliveryPageLocators.DELIVERY_INPUT_WRAPPER)
        delivery_input_wrapper_error_message = self.chrome_driver.find_element(*DeliveryPageLocators.DELIVERY_INPUT_WRAPPER_ERROR_MESSAGE)

        express_input = self.chrome_driver.find_element(*DeliveryPageLocators.EXPRESS_INPUT)

        followed_letter_input = self.chrome_driver.find_element(*DeliveryPageLocators.FOLLOWED_LETTER_INPUT)

        address_line_1_input = self.chrome_driver.find_element(*DeliveryPageLocators.ADDRESS_LINE_1_INPUT)
        address_line_1_error_message = self.chrome_driver.find_element(*DeliveryPageLocators.ADDRESS_LINE_1_ERROR_MESSAGE)

        postal_code_input = self.chrome_driver.find_element(*DeliveryPageLocators.POSTAL_CODE_INPUT)
        postal_code_error_message = self.chrome_driver.find_element(*DeliveryPageLocators.POSTAL_CODE_ERROR_MESSAGE)

        city_input = self.chrome_driver.find_element(*DeliveryPageLocators.CITY_INPUT)
        city_error_message = self.chrome_driver.find_element(*DeliveryPageLocators.CITY_ERROR_MESSAGE)

        submit_button = self.chrome_driver.find_element(*DeliveryPageLocators.SUBMIT_BUTTON)

        # tous les champs sont correctes
        # #   réinitialise tous les champs
        # lastname_input.clear()
        # email_input.clear()
        # postal_code_input.clear()
        # city_input.clear()
        # address_line_1_input.clear()

        self.chrome_driver.execute_script('return arguments[0].scrollIntoView()', lastname_input)
        time.sleep(1)

        ActionChains(self.chrome_driver)\
        .send_keys_to_element(lastname_input, "Doe")\
        .send_keys_to_element(email_input, "ben35170@hotmail.fr")\
        .click(express_input)\
        .perform()

        self.chrome_driver.execute_script('return arguments[0].scrollIntoView()', address_line_1_input)

        ActionChains(self.chrome_driver)\
        .pause(1)\
        .send_keys_to_element(address_line_1_input, "32 rue des Champs")\
        .send_keys_to_element(postal_code_input, "75019")\
        .send_keys_to_element(city_input, "Paris")\
        .perform()

        submit_button.click()

        wait2 = WebDriverWait(self.chrome_driver, timeout=3, poll_frequency=1, ignored_exceptions=[ElementNotVisibleException])
        checkout_page_title = wait2.until(expected_conditions.text_to_be_present_in_element((By.CSS_SELECTOR, '.section__h2'), 'PAIEMENT'))

        return True

        
class CheckoutPage(BasePage):

    def is_it_right_token(self):      
        wait = WebDriverWait(self.chrome_driver, timeout=10, poll_frequency=1, ignored_exceptions=[NoSuchElementException])
        submit_button = wait.until(expected_conditions.presence_of_element_located(CheckoutPageLocators.SUBMIT_BUTTON))
        
        token = submit_button.get_attribute("data-token")

        return token == 'pk_test_oKhSR5nslBRnBZpjO6KuzZeX'

    def does_it_submit_on_wrong_credentials(self):
        result = False

        if(self.is_it_right_token()):
            # on ne peut pas accéder aux élements de l'iframe de Stripe si on ne 'switch' pas dessus
            # et elle doit être chargé dont on attends quelques secondes avant de faire quoique ce soit
            time.sleep(3)
            iframe = self.chrome_driver.find_element(*CheckoutPageLocators.IFRAME)
            self.chrome_driver.switch_to.frame(iframe)

            wait = WebDriverWait(self.chrome_driver, timeout=5, poll_frequency=1, ignored_exceptions=[NoSuchElementException])

            card_number_input = wait.until(expected_conditions.presence_of_element_located(CheckoutPageLocators.CARD_NUMBER_INPUT))
            expiry_input = wait.until(expected_conditions.presence_of_element_located(CheckoutPageLocators.EXPIRY_INPUT))
            cvc_input = wait.until(expected_conditions.presence_of_element_located(CheckoutPageLocators.CVC_INPUT))
            

            ActionChains(self.chrome_driver)\
            .send_keys_to_element(card_number_input, "1234 1234 1234 1234")\
            .send_keys_to_element(expiry_input, "10 / 50")\
            .send_keys_to_element(cvc_input, "123")\
            .perform()

            # switch back to default content
            self.chrome_driver.switch_to.default_content()
            submit_button = wait.until(expected_conditions.presence_of_element_located(CheckoutPageLocators.SUBMIT_BUTTON))

            submit_button.click()

            self.chrome_driver.switch_to.frame(iframe)
            field_number_error = wait.until(expected_conditions.text_to_be_present_in_element((By.CSS_SELECTOR, '#Field-numberError'), 'Your card number is invalid.'))            

            result = True

        

        return result

    def does_it_redirection_on_success_payment(self):
        result = False

        if(self.is_it_right_token()):
            # on ne peut pas accéder aux élements de l'iframe de Stripe si on ne 'switch' pas dessus
            # et elle doit être chargé dont on attends quelques secondes avant de faire quoique ce soit
            time.sleep(3)
            iframe = self.chrome_driver.find_element(*CheckoutPageLocators.IFRAME)
            self.chrome_driver.switch_to.frame(iframe)

            wait = WebDriverWait(self.chrome_driver, timeout=5, poll_frequency=1, ignored_exceptions=[NoSuchElementException])

            card_number_input = wait.until(expected_conditions.presence_of_element_located(CheckoutPageLocators.CARD_NUMBER_INPUT))
            expiry_input = wait.until(expected_conditions.presence_of_element_located(CheckoutPageLocators.EXPIRY_INPUT))
            cvc_input = wait.until(expected_conditions.presence_of_element_located(CheckoutPageLocators.CVC_INPUT))
            

            ActionChains(self.chrome_driver)\
            .send_keys_to_element(card_number_input, "4242 4242 4242 4242")\
            .send_keys_to_element(expiry_input, "10 / 50")\
            .send_keys_to_element(cvc_input, "123")\
            .perform()

            # switch back to default content
            self.chrome_driver.switch_to.default_content()
            submit_button = wait.until(expected_conditions.presence_of_element_located(CheckoutPageLocators.SUBMIT_BUTTON))

            submit_button.click()
            
            success_page_title = wait.until(expected_conditions.text_to_be_present_in_element((By.CSS_SELECTOR, '.section__h2'), 'PAIEMENT RÉUSSI'))
            success_page_message = wait.until(expected_conditions.text_to_be_present_in_element((By.CSS_SELECTOR, '.success__message p'), 'Une confirmation vous sera envoyée par mail.'))
            

            result = True

        
        return result

class SingleProductPage(BasePage):

    def does_add_to_basket_create_right_cookie(self):
        # condition initial: aucun cookie productsToBasket présent sur le site
        add_to_basket_button = self.chrome_driver.find_element(*SingleProductPageLocators.ADD_TO_BASKET_BUTTON)
        
        product_id = add_to_basket_button.get_attribute("data-product-id")
        
        # selenium ne peut pas cliquer sur un élément non visible à l'écran
        # donc on scroll pour le rendre visible avec JavaScript vu que je n'y arrive pas avec selenium
        self.chrome_driver.execute_script('return arguments[0].scrollIntoView()', add_to_basket_button)
        time.sleep(1) # sans cette ligne, le click se fait trop vite et une erreur est retournée
        
        add_to_basket_button.click()
        
        basket_cookies = self.chrome_driver.get_cookie("productsToBasket")

        expected_value = [{ "id": product_id, "option": "default","quantity": 1 }]
        current_value = json.loads(basket_cookies['value'])

        result = expected_value == current_value

        if(result == False):
            print("expected_value :")
            print(expected_value)

            print("current_value :")
            print(current_value)

        return result

    def does_quantity_updates_on_confirm(self):
        confirm_quantity_button = self.chrome_driver.find_element(*SingleProductPageLocators.QUANTITY_MODAL_CONFIRM_BUTTON)

        confirm_quantity_button.click()


        quantity_displayed = self.chrome_driver.find_element(*SingleProductPageLocators.QUANTITY_WRAPPER).text
        expected_quantity_displayed = "2"

        result = quantity_displayed == expected_quantity_displayed

        if(result == False):
            print("quantity_displayed")
            print(quantity_displayed)
            print("expected_quantity_displayed")
            print(expected_quantity_displayed)
            print("quantity_displayed == expected_quantity_displayed")
            print(quantity_displayed == expected_quantity_displayed)

        return result

    def does_options_updates_on_confirm(self):
        first_options_button = self.chrome_driver.find_element(*BasketPageLocators.FIRST_OPTIONS_BUTTON)
        confirm_button = self.chrome_driver.find_element(By.CSS_SELECTOR, '.optionsModal .main-call-to-action')
        option_unselected = self.chrome_driver.find_element(By.CSS_SELECTOR, '.optionsModal .product-option-wrapper:not(.selected)')

        option_unselected.click()
        confirm_button.click()

        option_displayed = self.chrome_driver.find_element(*SingleProductPageLocators.OPTION_WRAPPER).text

        expected_option_displayed = "Vert"
        result = option_displayed == expected_option_displayed

        if(result == False):
            print("option_displayed")
            print(option_displayed)
            print("expected_option_displayed")
            print(expected_option_displayed)
            print("option_displayed == expected_option_displayed")
            print(option_displayed == expected_option_displayed)


        return result



