import { handleSinglePageQuantityConfirmation, handleSingleProductOptionConfirm } from "../utils/functions.js"

const mediaScrollerWrapper = document.querySelector(".media-scroller-wrapper");
const mediaScroller = document.querySelector(".media-scroller");
const firstCarouselImage = mediaScroller?.firstElementChild;
const carouselImageWidth = firstCarouselImage?.getBoundingClientRect().width;
const slideArrows = mediaScrollerWrapper?.querySelectorAll(".media-scroller-wrapper__button")

const quantityModalConfirmButton: HTMLElement | null = document.querySelector("#quantityModal .main-call-to-action")
const optionsModal: HTMLDialogElement | null = document.querySelector(".optionsModal")
const optionsModalConfirmButton = optionsModal?.querySelector(".optionsModal .main-call-to-action")

const handleScroll = (event: Event) => {

  if (mediaScroller?.scrollLeft != null && carouselImageWidth != null && mediaScrollerWrapper) {
    const newSlideIndex = Math.round(mediaScroller?.scrollLeft / carouselImageWidth) + 1;
    mediaScrollerWrapper.setAttribute("data-current-slide-index", newSlideIndex.toString());
  }

}

const handleArrowClick = (event: Event) => {
  const currentSlideIndex = mediaScrollerWrapper?.getAttribute("data-current-slide-index")

  if (currentSlideIndex && mediaScroller && carouselImageWidth) {
    const elementClicked = event.target as HTMLElement
    const button = elementClicked?.parentElement?.closest(".media-scroller-wrapper__button")

    if (button?.classList.contains("media-scroller-wrapper__button--right")) {
      mediaScroller.scrollLeft = carouselImageWidth * parseInt(currentSlideIndex);

    } else {
      mediaScroller.scrollLeft = carouselImageWidth * (parseInt(currentSlideIndex) - 2);
    }
  }


}

mediaScroller?.addEventListener("scroll", handleScroll)
slideArrows?.forEach(arrow => arrow.addEventListener("click", handleArrowClick))

quantityModalConfirmButton?.addEventListener("click", () => handleSinglePageQuantityConfirmation(quantityModalConfirmButton))
optionsModalConfirmButton?.addEventListener("click", () => handleSingleProductOptionConfirm(optionsModal))

