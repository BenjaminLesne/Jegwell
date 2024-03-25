"use server";

import { CREATE_CATEGORY_ROUTE, CategoryFormSchema } from "./constants";
import { db, s3Client } from "~/server/db";
import { revalidatePath } from "next/cache";
import { env } from "~/env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

const CreateCategorySchema = CategoryFormSchema.omit({
  image: true,
}).extend({
  imageId: z.string(),
});
export const createCategory = async (formData: FormData) => {
  const data = CreateCategorySchema.parse({
    name: formData.get("name"),
    imageId: formData.get("imageId"),
  });
  console.log("TEST data", data);
  // upload image file on aws and return name
  const name = "name returned by aws";
  await db.category.create({
    data: {
      name: data.name,
      image: {
        create: {
          id: data.imageId,
        },
      },
    },
  });

  revalidatePath(CREATE_CATEGORY_ROUTE);
};

type CreatePresignedUrlProps = {
  bucket?: string;
  key: string;
};

export const createPresignedUrl = ({
  bucket = env.BUCKET_NAME,
  key,
}: CreatePresignedUrlProps) => {
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(s3Client, command, { expiresIn: 60 });
};
