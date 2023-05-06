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

looking for a way to pass includes and select argument to the useQuery function into the prisma function so we fetch only what we need.
check this as reference: https://github.com/trpc/examples-next-prisma-starter/blob/main/src/server/routers/post.ts 