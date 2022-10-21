export default {
  name: "deliveryOption",
  type: "document",
  title: "Méthode de récupération",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Nom",
      description: "insérez le nom de la nouvelle méthode de récupération",
    },
    {
      name: "description",
      title: "Description",
      type: "string",
      description: "exemple: Expédition sous 24h en colissimo",
    },
    {
      name: "price",
      title: "Prix",
      type: "number",
      description: "exemple: 19.99",
    },
  ],
};
