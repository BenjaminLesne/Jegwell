import { handleSinglePageQuantityConfirmation, handleSingleProductOptionConfirm } from "../utils/functions.js";
const mediaScrollerWrapper = document.querySelector(".media-scroller-wrapper");
const mediaScroller = document.querySelector(".media-scroller");
const firstCarouselImage = mediaScroller === null || mediaScroller === void 0 ? void 0 : mediaScroller.firstElementChild;
const carouselImageWidth = firstCarouselImage === null || firstCarouselImage === void 0 ? void 0 : firstCarouselImage.getBoundingClientRect().width;
const slideArrows = mediaScrollerWrapper === null || mediaScrollerWrapper === void 0 ? void 0 : mediaScrollerWrapper.querySelectorAll(".media-scroller-wrapper__button");
const quantityModalConfirmButton = document.querySelector("#quantityModal .main-call-to-action");
const optionsModal = document.querySelector(".optionsModal");
const optionsModalConfirmButton = optionsModal === null || optionsModal === void 0 ? void 0 : optionsModal.querySelector(".optionsModal .main-call-to-action");
const handleScroll = (event) => {
    if ((mediaScroller === null || mediaScroller === void 0 ? void 0 : mediaScroller.scrollLeft) != null && carouselImageWidth != null && mediaScrollerWrapper) {
        const newSlideIndex = Math.round((mediaScroller === null || mediaScroller === void 0 ? void 0 : mediaScroller.scrollLeft) / carouselImageWidth) + 1;
        mediaScrollerWrapper.setAttribute("data-current-slide-index", newSlideIndex.toString());
    }
};
const handleArrowClick = (event) => {
    var _a;
    const currentSlideIndex = mediaScrollerWrapper === null || mediaScrollerWrapper === void 0 ? void 0 : mediaScrollerWrapper.getAttribute("data-current-slide-index");
    if (currentSlideIndex && mediaScroller && carouselImageWidth) {
        const elementClicked = event.target;
        const button = (_a = elementClicked === null || elementClicked === void 0 ? void 0 : elementClicked.parentElement) === null || _a === void 0 ? void 0 : _a.closest(".media-scroller-wrapper__button");
        if (button === null || button === void 0 ? void 0 : button.classList.contains("media-scroller-wrapper__button--right")) {
            mediaScroller.scrollLeft = carouselImageWidth * parseInt(currentSlideIndex);
        }
        else {
            mediaScroller.scrollLeft = carouselImageWidth * (parseInt(currentSlideIndex) - 2);
        }
    }
};
mediaScroller === null || mediaScroller === void 0 ? void 0 : mediaScroller.addEventListener("scroll", handleScroll);
slideArrows === null || slideArrows === void 0 ? void 0 : slideArrows.forEach(arrow => arrow.addEventListener("click", handleArrowClick));
quantityModalConfirmButton === null || quantityModalConfirmButton === void 0 ? void 0 : quantityModalConfirmButton.addEventListener("click", () => handleSinglePageQuantityConfirmation(quantityModalConfirmButton));
optionsModalConfirmButton === null || optionsModalConfirmButton === void 0 ? void 0 : optionsModalConfirmButton.addEventListener("click", () => handleSingleProductOptionConfirm(optionsModal));
