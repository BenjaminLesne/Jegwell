import { Image, Option, Prisma, type Product } from "@prisma/client";
import { type OrderedProduct } from "./helpers/helpers";

type BaseMergedProduct = Prisma.ProductGetPayload<{
  include: {
    options: {
      select: {
        id: true;
        name: true;
        price: true;
      };
    };
    image: {
      select: {
        url: true;
      };
    };
  };
}>;

export type MergedProduct = Omit<
  BaseMergedProduct,
  "createdAt" | "description" | "imageId"
> &
  Omit<OrderedProduct, "id"> & {
    options: Omit<Option, "productId" | "imageId">[];
  };

export type ProductForModal =
  | (Omit<
      Prisma.ProductGetPayload<{
        include: {
          options: {
            select: {
              id: true;
              name: true;
              price: true;
            };
          };
          image: {
            select: {
              url: true;
            };
          };
        };
      }>,
      "price" | "createdAt" | "name" | "description" | "imageId"
    > &
      OrderedProduct)
  | OrderedProduct;

  export type OptionOrderedProduct = Omit<
    Prisma.ProductGetPayload<{
      include: {
        options: {
          select: {
            id: true;
            name: true;
            price: true;
          };
        };
        image: {
          select: {
            url: true;
          };
        };
      };
    }>,
    "price" | "createdAt" | "name" | "description" | "imageId"
  > &
    OrderedProduct;

// id: -1,
// productId: -1,
// optionId: -1,
// quantity: -1,
