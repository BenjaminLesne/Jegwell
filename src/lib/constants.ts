import { type Prisma } from "@prisma/client";
import { z } from "zod";
import { type ProductAdminGetAllArg, type OrderGetAllArg } from "./types";
import { env } from "~/env";

export const BRAND_NAME = "Jegwell";
export const TAB_BASE_TITLE = `${BRAND_NAME} | `;
export const DEVELOPMENT = "development";
export const isDevelopment = env.NEXT_PUBLIC_NODE_ENV === DEVELOPMENT;
export const minPrice = 0;
export const maxPrice = 1000;
// routes
export const HOME_ROUTE = "/";
export const PRODUCTS_ROUTE = "/creations";
export const SINGLE_PRODUCT_ROUTE = `${PRODUCTS_ROUTE}/`;
export const BASKET_ROUTE = "/panier";
export const DELIVERY_ROUTE = "/livraison";
export const PAYMENT_SUCCEEDED_ROUTE = "/paiement-reussi";
export const BASE_ADMIN_ROUTE = "/gestion";
export const ADMIN_ORDERS_ROUTE = `${BASE_ADMIN_ROUTE}/commandes`;
export const ADMIN_SINGLE_ORDER_ROUTE = `${ADMIN_ORDERS_ROUTE}/`;
export const ADMIN_CATEGORIES = `${BASE_ADMIN_ROUTE}/categories`;
export const ADMIN_PRODUCTS = `${BASE_ADMIN_ROUTE}/produits`;
export const ADMIN_DELIVERY_OPTIONS = `${BASE_ADMIN_ROUTE}/livraisons`;
export const CREATE_CATEGORY_ROUTE = "/gestion/categories/create";
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

export const EVENT_SCENE_LOADED = "threejsSceneLoaded";

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

export const NO_OPTION = null;
export const NO_OPTION_TEXT = "Original";
export const REQUIRED_TEXT = "saisie obligatoire";
export const SUBTOTAL_TESTID = "subtotal";
export const QUANTITY_TESTID = "quantity";
export const PRICE_TESTID = "price";
export const BASKET_ICON_TESTID = "basket icon";

// api endpoints
export const GET_BY_IDS = "getByIds";
// /api endpoints

// prisma schema
export const allowedImageTypes = [
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/png",
  "image/gif",
];

export const allowedImageTypesString = allowedImageTypes
  .map((type) => type.replace("image/", "."))
  .join(", ");

const priceSchema = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, "La saisie n'est pas un prix");

const imageFileErrorMessage = `Fichier non valide. Types acceptés: ${allowedImageTypesString}`;

export const imageFileSchema = z
  .instanceof(File, {
    message: "Une image est nécessaire",
  })
  .refine(
    (value) => {
      return allowedImageTypes.includes(value.type);
    },
    {
      message: imageFileErrorMessage,
    },
  );
export const imageFormSchema = z.object({
  name: z.string(),
  url: z.string(),
  file: imageFileSchema,
});

export const createProductSchema = z.object({
  name: z.string().min(2, "La saisie doit contenir au moins deux caractères"),
  price: priceSchema,
  description: z.string().optional(),
  categories: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ),
  relateTo: z.array(
    z.object({
      label: z.string(),
      value: z.string().refine((value) => isNaN(parseInt(value)) === false),
    }),
  ),
  options: z.array(
    z.object({
      name: z.string().min(2),
      image: imageFileSchema,
      price: priceSchema,
    }),
  ),
  image: imageFileSchema,
});

const productToBasketSchema = z.object({
  id: z.number(),
  quantity: z.number(),
  optionId: z.number().nullable(),
  productId: z.number(),
});

export const mergedProductSchema = z
  .object({
    id: z.number(),
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
      }),
    ),
    price: z.number(),
    name: z.string(),
  })
  .merge(
    productToBasketSchema.pick({
      quantity: true,
      optionId: true,
      productId: true,
    }),
  );

export const mergedProductsSchema = z.array(mergedProductSchema);

export const lightMergedProductSchema = z
  .object({
    options: z.array(
      z.object({
        id: z.number(),
        price: z.number(),
      }),
    ),
    price: z.number(),
  })
  .merge(productToBasketSchema.pick({ optionId: true, quantity: true }));

const addressSchema = z.object({
  id: z.number(),
  line1: z.string(),
  line2: z.string().nullable(),
  country: z.string(),
  postalCode: z.string(),
  city: z.string(),
});

const customerSchema = z.object({
  id: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  address: z.array(addressSchema),
});

const deliveryOptionSchema = z.object({
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
  productsToBasket: z.array(productToBasketSchema.omit({ id: true })),
  customer: customerSchema,
  deliveryOption: deliveryOptionSchema,
  address: addressSchema,
});

const minShortString = 2;
const maxShortString = 50;
type ShortStringProps = {
  min: number;
  max: number;
  label: string;
};

const shortStringMessage = ({ min, max, label }: ShortStringProps) => {
  return `${label} doit contenir entre ${min} et ${max} caractères`;
};
export const firstnameMessage = shortStringMessage({
  label: "Le prénom",
  min: minShortString,
  max: maxShortString,
});
export const lastnameMessage = shortStringMessage({
  label: "Le nom",
  min: minShortString,
  max: maxShortString,
});
export const PHONE_ERROR_MESSAGE =
  "Votre numéro doit contenir au moins deux chiffres";
export const emailMessage = "Votre saisie n'est pas un email valide";
const phoneMessage = "Votre numéro doit au moins contenir deux chiffres";

export const deliveryOptionMessage =
  "Veuillez selectionner une méthode de livraison";

export const address1Message = shortStringMessage({
  min: 5,
  max: 100,
  label: "L'adresse",
});

const address2Message = shortStringMessage({
  min: 0,
  max: 100,
  label: "Le complément d'adresse",
});

export const cityMessage = shortStringMessage({
  min: 2,
  max: 50,
  label: "La ville",
});

export const postalCodeMessage = "Le code postal doit contenir 5 chiffres";

const commentMessage = shortStringMessage({
  min: 0,
  max: 500,
  label: "Le commentaire",
});
export const deliveryFormSchema = z.object({
  firstname: z
    .string()
    .min(2, {
      message: firstnameMessage,
    })
    .max(50, { message: firstnameMessage }),
  lastname: z
    .string()
    .min(2, { message: lastnameMessage })
    .max(50, { message: lastnameMessage }),
  email: z.string().email({ message: emailMessage }),
  phone: z
    .string()
    .min(2, { message: PHONE_ERROR_MESSAGE })
    .refine((value) => typeof parseInt(value) === "number", {
      message: phoneMessage,
    }),
  deliveryOptionId: z
    .string()
    .refine((value) => isNaN(parseInt(value)) === false, {
      message: deliveryOptionMessage,
    }),
  line1: z
    .string({ required_error: REQUIRED_TEXT })
    .min(5, { message: address1Message })
    .max(100, { message: address1Message }),
  line2: z.string().max(100, { message: address2Message }).optional(),
  city: z
    .string()
    .min(2, { message: cityMessage })
    .max(50, { message: cityMessage }),
  postalCode: z.string().regex(/^\d{5}$/, { message: postalCodeMessage }),
  comment: z.string().max(500, { message: commentMessage }).optional(),
});

export const orderGetAllArg: OrderGetAllArg = {
  orderBy: {
    createdAt: "desc",
  },
  include: {
    customer: {
      select: {
        firstname: true,
        lastname: true,
        phone: true,
      },
    },
    address: {
      select: {
        city: true,
        country: true,
        line1: true,
        line2: true,
        postalCode: true,
      },
    },
    productsToBasket: {
      select: {
        option: {
          select: {
            name: true,
            price: true,
            image: {
              select: {
                url: true,
              },
            },
          },
        },
        quantity: true,
        product: {
          select: {
            image: {
              select: {
                url: true,
              },
            },
            name: true,
            price: true,
          },
        },
      },
    },
  },
};

export const productAdminGetAllArg: ProductAdminGetAllArg = {
  include: {
    image: {
      select: {
        url: true,
      },
    },
    options: {
      include: {
        image: true,
      },
    },
    categories: true,
  },
};

export const CategoryFormSchema = z.object({
  name: z.string(),
  image: imageFileSchema,
});
// /prisma schema

// AWS S3
export const IMAGES_FOLDER_PATH = "images/";

// /AWS S3
