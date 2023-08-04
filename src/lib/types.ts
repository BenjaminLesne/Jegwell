import { type OrderedProduct } from "./helpers/helpers";

export type MergedProduct = {
  quantity: OrderedProduct["quantity"];
  optionId: OrderedProduct["optionId"];
  productId: OrderedProduct["productId"];
  image: {
    url: string;
  };
  options: {
    image: {
      url: string;
    };
    id: number;
    price: number;
    name: string;
  }[];
  id: string;
  price: number;
  name: string;
};

export type ProductForModal = {
  id: string;
  options?:
    | {
        id: number;
        image: {
          url: string;
        };
        price: number;
        name: string;
      }[]
    | undefined;
  image?:
    | {
        url: string;
      }
    | null
    | undefined;
  price?: number | undefined;
  name?: string | undefined;
} & OrderedProduct;
