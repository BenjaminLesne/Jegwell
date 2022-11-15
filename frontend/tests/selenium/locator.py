from selenium.webdriver.common.by import By

class ProductsPageLocators(object):
    ADD_TO_BASKET_BUTTON = (By.CSS_SELECTOR, ".product__call-to-action-wrapper")
    MODAL_LINK = (By.CSS_SELECTOR, ".modal__link")

class SingleProductPageLocators(object):
    ADD_TO_BASKET_BUTTON = (By.CSS_SELECTOR, ".information__add-to-basket")
    QUANTITY_BUTTON = (By.CSS_SELECTOR, ".setting--quantity")
    PLUS_MINUS_BUTTON = (By.CSS_SELECTOR, ".quantity-setter__button")
    QUANTITY_MODAL_CONFIRM_BUTTON = (By.CSS_SELECTOR, "#quantityModal .main-call-to-action")
    QUANTITY_WRAPPER = (By.CSS_SELECTOR, ".setting--quantity .setting__value-span")
    OPTION_WRAPPER = (By.CSS_SELECTOR, ".setting--option .setting__value-span")
    

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
    LASTNAME_ERROR_MESSAGE = (By.CSS_SELECTOR, "#lastname + .form__error-message")

    EMAIL_INPUT = (By.CSS_SELECTOR, "#email")
    EMAIL_ERROR_MESSAGE = (By.CSS_SELECTOR, "#email + .form__error-message")

    DELIVERY_INPUT_WRAPPER = (By.CSS_SELECTOR, ".form__fieldset--radio")
    DELIVERY_INPUT_WRAPPER_ERROR_MESSAGE = (By.CSS_SELECTOR, ".form__fieldset--radio .form__error-message")

    EXPRESS_INPUT = (By.CSS_SELECTOR, "#express")

    FOLLOWED_LETTER_INPUT = (By.CSS_SELECTOR, "#followed-letter")

    ADDRESS_LINE_1_INPUT = (By.CSS_SELECTOR, "#addressLine1")
    ADDRESS_LINE_1_ERROR_MESSAGE = (By.CSS_SELECTOR, "#addressLine1 + .form__error-message")

    COUNTRY_INPUT = (By.CSS_SELECTOR, "#country")
    COUNTRY_ERROR_MESSAGE = (By.CSS_SELECTOR, "#country + .form__error-message")

    POSTAL_CODE_INPUT = (By.CSS_SELECTOR, "#postalCode")
    POSTAL_CODE_ERROR_MESSAGE = (By.CSS_SELECTOR, "#postalCode + .form__error-message")

    CITY_INPUT = (By.CSS_SELECTOR, "#city")
    CITY_ERROR_MESSAGE = (By.CSS_SELECTOR, "#city + .form__error-message")

    SUBMIT_BUTTON = (By.CSS_SELECTOR, ".form__submit-button")
    SUBMIT_ERROR_MESSAGE = (By.CSS_SELECTOR, ".form__submit-button + .form__error-message")

class CheckoutPageLocators(object):
    SUBMIT_BUTTON = (By.CSS_SELECTOR, "#submit")
    CARD_NUMBER_INPUT = (By.CSS_SELECTOR, "#Field-numberInput")
    EXPIRY_INPUT = (By.CSS_SELECTOR, "#Field-expiryInput")
    CVC_INPUT = (By.CSS_SELECTOR, "#Field-cvcInput")
    IFRAME = (By.CSS_SELECTOR, "iframe")

class SuccessPageLocators(object):
    PAGE_HEADING = (By.CSS_SELECTOR, '.section__h2')
    


    


    



    

    