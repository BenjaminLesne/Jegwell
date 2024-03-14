import { zodResolver } from "@hookform/resolvers/zod";
import React, { type SetStateAction } from "react";
import { type ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";

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
import { cn, priceToInt } from "~/lib/helpers/client";

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
import { Title } from "../Title/Title";
import { allowedImageTypesString, createProductSchema } from "~/lib/constants";

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

type DirtyOption = {
  name: string;
  price: number | undefined;
  image: {
    name: string;
    url: string;
    file: File;
  };
};

type CleanOption = {
  name: string;
  price: number;
  image: {
    name: string;
    url: string;
    file: File;
  };
};
function isValidOption(option: DirtyOption): option is CleanOption {
  return (option as CleanOption).price !== undefined;
}

export const ProductForm = () => {
  const { data: categories = [], isLoading: categoriesAreLoading } =
    api.categories.getAll.useQuery();
  const { data: products = [], isLoading: productsAreLoading } =
    api.products.getAll.useQuery();
  const { mutateAsync: createProduct } = api.products.create.useMutation();

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

  const form = useForm<z.infer<typeof createProductSchema>>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      price: "",
      description: "",
      categories: [],

      options: [],
      relateTo: [],
      image: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof createProductSchema>) {
    const { name, price, categories, image, options, relateTo, description } =
      values;
    const priceInt = priceToInt(price);

    if (priceInt === undefined) return;

    const cleanOptions = options
      .map((option) => {
        return {
          name: option.name,
          price: priceToInt(option.price),
          image: {
            name: option.image.name,
            url: "/" + option.image.name,
            file: option.image,
          },
        };
      })
      .filter(isValidOption);

    await createProduct({
      name,
      price: priceInt,
      categories: categories.map((category) => parseInt(category.value)),
      description,
      image: {
        name: image.name,
        url: "/" + image.name,
        file: image,
      },
      options: cleanOptions,
      relateTo: relateTo
        .map((product) => parseInt(product.value))
        .filter((id) => isNaN(id) === false),
    });
  }
  type ArrayOnChangeProps = {
    value: SetStateAction<OptionType[]>;
    fieldOnChange: (...args: unknown[]) => void;
  };
  function arrayOnChange({ value, fieldOnChange }: ArrayOnChangeProps) {
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
    <>
      <Title>Création de produit</Title>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <Input placeholder="Bijou en or" {...field} />
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
                        (categoryAsOption) =>
                          categoryAsOption.value === item.value,
                      );

                      return shouldFilter;
                    })}
                    onChange={(value) =>
                      arrayOnChange({
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
                      arrayOnChange({
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
                      accept={allowedImageTypesString}
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
                  <Button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();

                      form.setValue("options", [
                        ...form.getValues("options"),
                        {
                          name: "A compléter",
                          price: 1000,
                          image: new File(["exemple"], "exemple.png"),
                        },
                      ]);
                    }}
                  >
                    Ajouter
                  </Button>
                  {field.value.map((item, index) => (
                    <OptionForm key={index} id={index} field={field} />
                  ))}
                </FormItem>
              );
            }}
          />
          <Button type="submit">Envoyer</Button>
        </form>
      </Form>
    </>
  );
};

type UpdateOptionProps = {
  id: number;
  value: unknown;
  key: keyof z.infer<typeof createProductSchema>["options"][number];
  options: z.infer<typeof createProductSchema>["options"];
};
function updateOption({ id, value, key, options }: UpdateOptionProps) {
  return options.map((option, index) =>
    index === id ? { ...option, [key]: value } : option,
  );
}

type OptionFormProps = {
  id: number;
  field: ControllerRenderProps<
    {
      image: File;
      options: {
        image: File;
        price: number;
        name: string;
      }[];
      price: number;
      name: string;
      categories: {
        value: string;
        label: string;
      }[];
      relateTo: {
        value: string;
        label: string;
        imageUrl: string;
      }[];
      description?: string | undefined;
    },
    "options"
  >;
};
function OptionForm({ field, id }: OptionFormProps) {
  return (
    <>
      <FormControl>
        <Input
          placeholder="Vert"
          onChange={(e) =>
            field.onChange(
              updateOption({
                id,
                options: field.value,
                key: "name",
                value: e.target.value,
              }),
            )
          }
        />
      </FormControl>
      <FormControl>
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder="19.99"
          onChange={(e) =>
            field.onChange(
              updateOption({
                id,
                options: field.value,
                key: "price",
                value: e.target.value,
              }),
            )
          }
        />
      </FormControl>
      <FormControl>
        <Input
          type="file"
          accept={allowedImageTypesString}
          onChange={(e) =>
            field.onChange(
              updateOption({
                id,
                options: field.value,
                key: "image",
                value: e.target.files ? e.target.files[0] : null,
              }),
            )
          }
        />
      </FormControl>
      <FormMessage />
    </>
  );
}
