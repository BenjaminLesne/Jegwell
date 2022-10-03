export default {
  name: "category",
  type: "document",
  title: "Catégorie",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Nom",
      description: "insérez le nom de la nouvelle catégorie",
    },
    {
      name: "image",
      type: "image",
      title: "Photo",
      description:
        "Une image pour représenté la catégorie, elle sera affichée sur la page d'accueil",
      options: {
        hotspot: true,
      },
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
