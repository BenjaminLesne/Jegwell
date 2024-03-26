"use server";

import {
  CREATE_CATEGORY_ROUTE,
  CREATE_DELIVERY_OPTION_ROUTE,
  CategoryFormSchema,
  IMAGES_FOLDER_PATH,
  deliveryOptionSchema,
} from "./constants";
import { db, s3Client } from "~/server/db";
import { revalidatePath } from "next/cache";
import { env } from "~/env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

const CreateDeliveryOptionSchema = deliveryOptionSchema.omit({
  id: true,
});
export const createDeliveryOption = async (formData: FormData) => {
  const data = CreateDeliveryOptionSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("priceInCents"),
  });

  await db.deliveryOption.create({
    data: {
      name: data.name,
      price: parseInt(data.price),
      description: data.description,
    },
  });

  revalidatePath(CREATE_DELIVERY_OPTION_ROUTE);
};

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

export async function uploadImage({ imageFile }: { imageFile: File }) {
  try {
    const key = IMAGES_FOLDER_PATH + crypto.randomUUID();
    const url = await createPresignedUrl({ key });

    const response = await fetch(url, {
      method: "PUT",
      body: imageFile,
    });

    if (response.ok) {
      return {
        success: true,
        key,
      } as const;
    } else {
      return {
        success: false,
        error: `Error uploading file: ${response.statusText}`,
      } as const;
    }
  } catch (error) {
    return { success: false, error } as const;
  }
}
