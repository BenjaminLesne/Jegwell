export default {
  name: "product",
  type: "document",
  title: "Produit",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Nom",
    },
    {
      name: "image",
      type: "image",
      title: "Photo",
    },
    {
      name: "price",
      type: "number",
      title: "Prix",
    },
    {
      name: "description",
      type: "text",
      title: "Description",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      description: 'Il faut juste cliquer sur "generate" sur la droite',
      options: {
        source: "name",
      },
    },
  ],
};
