export default {
  name: "option",
  type: "object",
  title: "Option/Variant",
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
      options: {
        hotspot: true,
      },
    },
  ],
};
