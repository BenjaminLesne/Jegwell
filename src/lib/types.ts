export type MergedProduct = {
  quantity: number;
  optionId: string;
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
