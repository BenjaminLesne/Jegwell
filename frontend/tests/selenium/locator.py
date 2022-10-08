from selenium.webdriver.common.by import By

class HomePageLocators(object):
    MODAL_LINK = (By.CSS_SELECTOR, ".modal__link")
    ADD_TO_BASKET_BUTTON = (By.CSS_SELECTOR, ".product__call-to-action-wrapper")

    