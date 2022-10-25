export default {
  name: "productToBasket",
  type: "object",
  title: "Produit dans le panier client",
  fields: [
    {
      name: "id",
      type: "reference",
      to: [{ type: "product" }],
      title: "Produit",
    },
    {
      name: "quantity",
      type: "number",
      title: "Quantité",
    },
    {
      name: "option",
      type: "string",
      title: "Option/Variant",
    },
  ],
};
