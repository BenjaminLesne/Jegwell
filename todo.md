handle file uploads (should we make a function uploadFile(image) ?. then.. what model do we need in the database?)
const { cloudinary } = require('../config/cloudinary');
const prisma = require('../config/prisma');

async function uploadImage(image) {
  const { createReadStream } = await image;
  const stream = createReadStream();
  const result = await cloudinary.uploader.upload(stream, {
    folder: 'your_folder_name',
  });
  return await prisma.image.create({
    data: {
      name: result.original_filename,
      url: result.secure_url,
    },
  });
}

passer en Next 13.4 et utilise le app router au lieu du pages
mais d'abord finir la home page



remove ²cdn2.hubspot.net" from next config