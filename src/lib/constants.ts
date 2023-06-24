import { type Prisma } from "@prisma/client";

export const BRAND_NAME = "Jegwell";
export const TAB_BASE_TITLE = `${BRAND_NAME} | `;
export const DEVELOPMENT = "development";
// routes
export const HOME_ROUTE = "/";
export const PRODUCTS_ROUTE = "/creations";
export const BASKET_ROUTE = "/panier";
export const DELIVERY_ROUTE = "/livraison";
// /routes

// social media
export const INSTAGRAM = "https://www.instagram.com/jegwell/";
export const TIKTOK = "https://www.tiktok.com/@jegwell";
export const FACEBOOK = "https://www.facebook.com/jegwell";
// /social media

// styles
export const DESKTOP_MAX_WIDTH = "lg:max-w-[1200px]";
// /styles

// urls
export const PRODUCTS_PAGE_URL = '/creations'
export const HOME_PAGE_URL = "/";
// /urls

export const CATEGORY = "catégorie";
export const ALL_CATEGORIES = -1;
export const SORT = "trie";
export const DEFAULT_SORT = "priceAsc";
export const SORT_OPTIONS = {
  nameAsc: {
    name: "asc",
  },
  nameDesc: {
    name: "desc",
  },
  priceDesc: {
    price: "desc",
  },
  priceAsc: {
    price: "asc",
  },
} as Record<string, Prisma.ProductOrderByWithRelationInput>;

export const SORT_OPTIONS_NAMES = {
  nameAsc: "Nom A-Z",
  nameDesc: "Nom Z-A",
  priceDesc: "Prix décroissant",
  priceAsc: "Prix croissant",
};
export const DEFAULT_CATEGORY = undefined;
export const CATEGORY_TEST_ID = "category";
export const LOCALE_STORAGE_BASKET_KEY = "basket";

// modals
export const OPEN_TYPE = "open"
export const CLOSE_TYPE = "close"
// /modals

export const BASKET_REDUCER_TYPE = {
  ADD: "add",
  REMOVE: "remove",
  SET: "set",
  UPDATE_QUANTITY: "update quantity",
} as const;
