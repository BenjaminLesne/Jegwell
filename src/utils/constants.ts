import { type Prisma } from "@prisma/client";

export const BRAND_NAME = "Jegwell";
export const TAB_BASE_TITLE = `${BRAND_NAME} | `;
// routes
export const HOME_ROUTE = "/";
export const PRODUCTS_ROUTE = "/creations";
export const BASKET_ROUTE = "/panier";
// /routes

// social media
export const INSTAGRAM = "https://www.instagram.com/jegwell/";
export const TIKTOK = "https://www.tiktok.com/@jegwell";
export const FACEBOOK = "https://www.facebook.com/jegwell";
// /social media

// styles
export const DESKTOP_MAX_WIDTH = "lg:max-w-[1200px]";
// /styles

export const CATEGORY = "catégorie";
export const ALL_CATEGORIES = -1;
export const SORT = "trie";
export const DEFAULT_SORT = "priceDesc";
export const SORT_OPTIONS = {
  nameAsc: {
    options: {
      name: "asc",
    },
  },
  nameDesc: {
    options: {
      name: "desc",
    },
  },
  priceDesc: {
    options: {
      price: "desc",
    },
  },
  priceAsc: {
    options: {
      price: "asc",
    },
  },
} as Record<string, Prisma.ProductOrderByWithRelationInput>;
