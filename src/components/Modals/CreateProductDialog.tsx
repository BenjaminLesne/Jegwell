import { zodResolver } from "@hookform/resolvers/zod";
import React, { SetStateAction, useState } from "react";
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
import { cn } from "~/lib/helpers/helpers";

import { MultiSelect, OptionType } from "../MultipleSelect/MultipleSelect";
import { Check } from "lucide-react";

// Add your validation logic here, for example checking file type
const allowedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/png",
  "image/gif",
];
const allowedTypesString = allowedTypes
  .map((type) => type.replace("image/", ""))
  .join(", ");

const formSchema = z.object({
  name: z.string(),
  price: z.number().int(),
  description: z.string().optional(),
  categories: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
  options: z.array(
    z
      .string()
      .transform((str) => parseInt(str))
      .refine((num) => Number.isInteger(num), {
        message: "La valeur doit être un entier",
      })
  ),
  relateTo: z.array(z.number().int()),
  image: z.unknown().refine(
    (value) => {
      if (!(value instanceof File)) {
        return false; // Not a File object
      }

      return allowedTypes.includes(value.type);
    },
    {
      message: `Fichier non valide. Types acceptés: ${allowedTypesString}`,
    }
  ),
});

const data = [
  { label: "Boucle d'oreille", value: "0" },
  { label: "Bagues", value: "1" },
];

type CategoryOption = {
  value: string;
  label: string;
};

type CategoryMenuItem = {
  option: CategoryOption;
  selected: CategoryOption[];
};

const CategoryMenuItem = ({ option, selected }: CategoryMenuItem) => (
  <>
    <Check
      className={cn(
        "mr-2 h-4 w-4",
        selected.some((item) => item.value === option.value)
          ? "opacity-100"
          : "opacity-0"
      )}
    />
    {option.label}
  </>
);

export const CreateProductDialog = () => {
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
  return (
    <Dialog>
      <DialogTrigger>
        <Button className={cn("flex", "ml-auto", "mb-10")}>
          Ajouter un produit
        </Button>
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
                        options={data}
                        MenuItem={CategoryMenuItem}
                        selected={data.filter((item) => {
                          const shouldFilter = field.value.some(
                            (object) => object.value === item.value
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
              <Button type="submit">Envoyer</Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
