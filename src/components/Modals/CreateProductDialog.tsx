import { zodResolver } from "@hookform/resolvers/zod";
import React, { type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/Button/button";
import { cn } from "~/lib/helpers/client";

import {
  type MenuItemProps,
  MultiSelect,
  type OptionType,
} from "../MultipleSelect/MultipleSelect";
import { Check } from "lucide-react";
import { api } from "~/trpc/react";
import { Loading } from "../Loading/Loading";
import { Error } from "../Error/Error";
import Image from "next/image";

const allowedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/png",
  "image/gif",
];
const allowedTypesString = allowedTypes
  .map((type) => type.replace("image/", "."))
  .join(", ");

const formSchema = z.object({
  name: z.string(),
  price: z.number().int(),
  description: z.string().optional(),
  categories: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ),
  relateTo: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      imageUrl: z.string().url(),
    }),
  ),
  options: z.array(
    z.object({
      name: z.string(),
      image: z.instanceof(File).refine(
        (value) => {
          return allowedTypes.includes(value.type);
        },
        {
          message: `Fichier non valide. Types acceptés: ${allowedTypesString}`,
        },
      ),
      price: z
        .string()
        .transform((str) => parseInt(str))
        .refine((num) => Number.isInteger(num), {
          message: "La valeur doit être un nombre",
        }),
    }),
  ),
  image: z.instanceof(File).refine(
    (value) => {
      return allowedTypes.includes(value.type);
    },
    {
      message: `Fichier non valide. Types acceptés: ${allowedTypesString}`,
    },
  ),
});

const categoryOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const categoryiesSelectedSchema = z.array(categoryOptionSchema);

const CategoryMenuItem = ({ option, selected }: MenuItemProps) => {
  const optionParsed = categoryOptionSchema.parse(option);
  const selectedParsed = categoryiesSelectedSchema.parse(selected);

  return (
    <>
      <Check
        className={cn(
          "mr-2 h-4 w-4",
          selectedParsed.some((item) => item.value === optionParsed.value)
            ? "opacity-100"
            : "opacity-0",
        )}
      />
      {optionParsed.label}
    </>
  );
};

const productOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  imageUrl: z.string(),
});

const productsSelectedSchema = z.array(productOptionSchema);

const ProductMenuItem = ({ option, selected }: MenuItemProps) => {
  const optionParsed = productOptionSchema.parse(option);
  const selectedParsed = productsSelectedSchema.parse(selected);

  return (
    <>
      <Check
        className={cn(
          "mr-2 h-4 w-4",
          selectedParsed.some((item) => item.value === optionParsed.value)
            ? "opacity-100"
            : "opacity-0",
        )}
      />
      <Image src={optionParsed.imageUrl} width={75} height={75} alt="bijou" />
      {optionParsed.label}
    </>
  );
};

export const CreateProductDialog = () => {
  const { data: categories = [], isLoading: categoriesAreLoading } =
    api.categories.getAll.useQuery();
  const { data: products = [], isLoading: productsAreLoading } =
    api.products.getAll.useQuery();

  const categoriesAsOptions = categories.map((category) => ({
    label: category.name,
    value: category.id.toString(),
    imageUrl: category.image.url,
  })) satisfies OptionType[];

  const productsAsOptions = products.map((product) => ({
    label: product.name,
    value: product.id.toString(),
    imageUrl: product.image.url,
  })) satisfies OptionType[];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: undefined,
      price: undefined,
      description: undefined,
      categories: [],

      options: [],
      relateTo: [],
      image: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("TEST values submitted", values);
  }
  type CategoriesOnChangeProps = {
    value: SetStateAction<OptionType[]>;
    fieldOnChange: (...args: unknown[]) => void;
  };
  function categoriesOnChange({
    value,
    fieldOnChange,
  }: CategoriesOnChangeProps) {
    fieldOnChange(value);
  }

  if (categoriesAreLoading && productsAreLoading)
    return (
      <main>
        <Loading />
      </main>
    );

  const nothingIsLoading = !categoriesAreLoading && !productsAreLoading;
  if (nothingIsLoading && (!categories || !products)) {
    return <Error message="Une erreur est survenue." />;
  }

  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          "flex",
          "ml-auto",
          "mb-10",
          "bg-red-300",
          "border-solid",
          "border-blue-600",
          "border-2",
        )}
      >
        Ajouter un produit
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Création de produit</DialogTitle>
          <Form {...form}>
            <form
              onSubmit={void form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Bruz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix</FormLabel>
                    <FormControl>
                      <Input placeholder="10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégories</FormLabel>
                    <FormControl>
                      <MultiSelect
                        {...field}
                        options={categoriesAsOptions}
                        MenuItem={CategoryMenuItem}
                        selected={categoriesAsOptions.filter((item) => {
                          const shouldFilter = field.value.some(
                            (object) => object.value === item.value,
                          );

                          return shouldFilter;
                        })}
                        onChange={(value) =>
                          categoriesOnChange({
                            value,
                            fieldOnChange: field.onChange,
                          })
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="relateTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Associé à</FormLabel>
                    <FormControl>
                      <MultiSelect
                        {...field}
                        options={productsAsOptions}
                        MenuItem={ProductMenuItem}
                        selected={productsAsOptions.filter((item) => {
                          const shouldFilter = field.value.some(
                            (productAsOption) =>
                              productAsOption.value === item.value,
                          );

                          return shouldFilter;
                        })}
                        onChange={(value) =>
                          categoriesOnChange({
                            value,
                            fieldOnChange: field.onChange,
                          })
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Image :</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept={allowedTypesString}
                          onChange={(e) =>
                            field.onChange(
                              e.target.files ? e.target.files[0] : null,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="options"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Options :</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Bruz"
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="19.99"
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormControl>
                        <Input
                          type="file"
                          accept={allowedTypesString}
                          onChange={(e) =>
                            field.onChange(
                              e.target.files ? e.target.files[0] : null,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* options  (create option, name, image)   */}
              {/* in progress */}
              {/* tempId: crypto.randomUUID(), use it to identify which input is this in the array. add onChange => add to field.value option. need remove button to filter it out. Use tempId for all of it. We should be able to handle error message with the tempId (conditonnaly display the error message based on tempId)*/}
              {/* it is too big for a dialog */}
              <Button type="submit">Envoyer</Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
