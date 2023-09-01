import { type Option, type Prisma } from "@prisma/client";
import { type OrderedProduct } from "./helpers/helpers";

export type OrderGetAllArg = {
  include: {
    customer: {
      select: {
        firstname: true;
        lastname: true;
        phone: true;
      };
    };
    address: {
      select: {
        city: true;
        country: true;
        line1: true;
        line2: true;
        postalCode: true;
      };
    };
    productsToBasket: {
      select: {
        option: {
          select: {
            name: true;
            price: true;
            image: {
              select: {
                url: true;
              };
            };
          };
        };
        quantity: true;
        product: {
          select: {
            image: {
              select: {
                url: true;
              };
            };
            name: true;
            price: true;
          };
        };
      };
    };
  };
};

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
