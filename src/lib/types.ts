import { type Option, type Prisma } from "@prisma/client";
import { type OrderedProduct } from "./helpers/helpers";

export type ProductAdminGetAllArg = {
  include: {
    image: {
      select: {
        url: true;
      };
    };
    options: {
      include: {
        image: true;
      };
    };
    categories: true;
  };
};

export type OrderGetAllArg = {
  orderBy: {
    createdAt: Prisma.SortOrder;
  };
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

export type MergedProductOld = Omit<
  BaseMergedProduct,
  "createdAt" | "description" | "imageId"
> &
  Omit<OrderedProduct, "id"> & {
    options: Omit<Option, "productId" | "imageId">[];
  };

export type MergedProduct = Prisma.ProductGetPayload<{
  include: {
    options: {
      select: {
        id: true;
        name: true;
        price: true;
        image: {
          select: {
            url: true;
          };
        };
      };
    };
    image: {
      select: {
        url: true;
      };
    };
  };
}> &
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
