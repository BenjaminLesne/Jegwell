import { type Prisma } from "@prisma/client";
import { z } from "zod";

export const BRAND_NAME = "Jegwell";
export const TAB_BASE_TITLE = `${BRAND_NAME} | `;
export const DEVELOPMENT = "development";
// routes
export const HOME_ROUTE = "/";
export const PRODUCTS_ROUTE = "/creations";
export const SINGLE_PRODUCT_ROUTE = "/creations/";
export const BASKET_ROUTE = "/panier";
export const DELIVERY_ROUTE = "/livraison";
export const PAYMENT_SUCCEEDED_ROUTE = "/paiement-reussi";
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
export const OPEN_TYPE = "open";
export const CLOSE_TYPE = "close";
// /modals

export const BASKET_REDUCER_TYPE = Object.freeze({
  ADD: "add",
  REMOVE: "remove",
  SET: "set",
  UPDATE_QUANTITY: "update quantity",
  UPDATE_OPTION: "update option",
  INCREMENT: "increment",
  RESET: "reset",
});

export const NO_OPTION = "Aucune";
export const SUBTOTAL_TESTID = "subtotal";
export const QUANTITY_TESTID = "quantity";
export const PRICE_TESTID = "price";
export const BASKET_ICON_TESTID = "basket icon";

// api endpoints
export const GET_BY_IDS = "getByIds";
// /api endpoints

// prisma schema
export const mergedProductSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  optionId: z.string(),
  image: z.object({
    url: z.string(),
  }),
  options: z.array(
    z.object({
      image: z.object({
        url: z.string(),
      }),
      id: z.number(),
      price: z.number(),
      name: z.string(),
    })
  ),
  price: z.number(),
  name: z.string(),
});
export const mergedProductsSchema = z.array(mergedProductSchema);

export const imageSchema = z.object({
  id: z.number(),
  name: z.string(),
  url: z.string(),
});

export const optionSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  productId: z.number(),
  imageId: z.number(),
  image: imageSchema,
});

export const productToBasketSchema = z.object({
  id: z.number(),
  quantity: z.number(),
  optionId: z.number(),
  productId: z.number(),
  option: optionSchema,
});

export const addressSchema = z.object({
  id: z.number(),
  line1: z.string(),
  line2: z.string().nullable(),
  country: z.string(),
  postalCode: z.string(),
  city: z.string(),
});

export const customerSchema = z.object({
  id: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  address: z.array(addressSchema),
});

export const deliveryOptionSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
});

export const orderSchema = z.object({
  id: z.number(),
  datetime: z.date(),
  isPaid: z.boolean(),
  isEmailSent: z.boolean(),
  paymentIntentId: z.string().nullable(),
  price: z.number(),
  comment: z.string().nullable(),
  customerId: z.number(),
  deliveryOptionId: z.number(),
  addressId: z.number(),
  productsToBasket: z.array(productToBasketSchema),
  customer: customerSchema,
  deliveryOption: deliveryOptionSchema,
  address: addressSchema,
});
// .refine(
//   (obj) => obj.address != null || obj.addressId != null,
//   () => ({ message: "should include address key OR addressId key" })
// )
// .refine(
//   (obj) => obj.deliveryOption != null || obj.deliveryOptionId != null,
//   () => ({ message: "should include option key OR optionId key" })
// );

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  imageId: z.number(),
  image: imageSchema,
});

export const productSchema = z.object({
  id: z.number(),
  price: z.number(),
  createdAt: z.date(),
  name: z.string(),
  description: z.string().nullable(),
  productId: z.string().nullable(),
  imageId: z.number(),
  categories: z.array(categorySchema),
  options: z.array(optionSchema),
  // relateTo: z.array(productSchema),
  // relatedBy: z.array(productSchema),
  image: imageSchema,
  baskets: z.array(productToBasketSchema),
});

// /prisma schema
