from selenium.webdriver.common.by import By

class ProductsPageLocators(object):
    ADD_TO_BASKET_BUTTON = (By.CSS_SELECTOR, ".product__call-to-action-wrapper")
    MODAL_LINK = (By.CSS_SELECTOR, ".modal__link")

class BasketPageLocators(object):
    FIRST_QUANTITY_BUTTON = (By.CSS_SELECTOR, ".setting--quantity")
    FIRST_OPTIONS_BUTTON = (By.CSS_SELECTOR, ".setting--option")
    QUANTITY_MODAL = (By.CSS_SELECTOR, "#quantityModal")
    OPTIONS_MODAL = (By.CSS_SELECTOR, ".optionsModal[open='']")
    QUANTITY_SETTER_VALUE_ELEMENT = (By.CSS_SELECTOR, ".quantity-setter__value")
    SUBTOTAL_PRICE_ELEMENT = (By.CSS_SELECTOR, ".subtotal__top-information > .price")
    ARTICLES_ELEMENT = (By.CSS_SELECTOR, '.subtotal__number-of-articles')

class DeliveryPageLocators(object):
    LASTNAME_INPUT = (By.CSS_SELECTOR, "#lastname")
    EMAIL_INPUT = (By.CSS_SELECTOR, "#email")
    EXPRESS_INPUT = (By.CSS_SELECTOR, "#express")
    FOLLOWED_LETTER_INPUT = (By.CSS_SELECTOR, "#followed-letter")
    ADDRESS_LINE_1_INPUT = (By.CSS_SELECTOR, "#addressLine1")
    COUNTRY_INPUT = (By.CSS_SELECTOR, "#country")
    POSTAL_CODE_INPUT = (By.CSS_SELECTOR, "#postalCode")
    CITY_INPUT = (By.CSS_SELECTOR, "#city")
    SUBMIT_BUTTON = (By.CSS_SELECTOR, ".form__submit-button")

    


    



    

    