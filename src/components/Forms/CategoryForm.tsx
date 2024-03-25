"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createCategory, createPresignedUrl } from "~/lib/actions";
import { IMAGES_FOLDER_PATH, allowedImageTypes } from "~/lib/constants";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/Button/button";

const MAX_IMAGE_SIZE = 4;

const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024);
  return +result.toFixed(decimalsNum);
};

const FileListSchema = z
  .custom<FileList>()
  .refine((files) => {
    return Array.from(files ?? []).length !== 0;
  }, "Image is required")
  .refine((files) => {
    return Array.from(files ?? []).every(
      (file) => sizeInMB(file.size) <= MAX_IMAGE_SIZE,
    );
  }, `The maximum image size is ${MAX_IMAGE_SIZE}MB`)
  .refine((files) => {
    return Array.from(files ?? []).every((file) =>
      allowedImageTypes.includes(file.type),
    );
  }, "File type is not supported");

const CategoryFormSchema = z.object({
  name: z.string(),
  image: FileListSchema,
});

export const CategoryForm = () => {
  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: "",
      image: undefined,
    },
  });

  const fileRef = form.register("image");

  async function onSubmit(values: z.infer<typeof CategoryFormSchema>) {
    try {
      const key = IMAGES_FOLDER_PATH + crypto.randomUUID();
      const url = await createPresignedUrl({ key });
      // with presigned url, upload image file received
      const response = await fetch(url, {
        method: "PUT",
        body: values.image.item(0),
      });

      if (response.ok) {
        ("");
        console.log("File uploaded successfully");
      } else {
        console.error("Error uploading file:", response.statusText);
      }

      // grab the key from the response of aws after upload
      // store the key as image name when creating a category

      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("imageId", key);

      await createCategory(formData);
    } catch (error) {
      console.error("Error submitting image", error);
    }
  }

  return (
    <>
      {/* <form action={createCategory}>
      <input type="file" />
      <button type="submit">Envoyer</button>
    </form> */}
      <h1>Création de catégorie</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="image">image</Label>
            <Input id="image" name="image" type="file" />
          </div> */}

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  {/* <Input placeholder="shadcn" {...field} /> */}
                  <Input id="image" type="file" {...fileRef} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Envoyer</Button>
        </form>
      </Form>
    </>
  );
};
