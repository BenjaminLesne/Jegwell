import { type NextPage } from "next";
import React from "react";
import { ControllerRenderProps, FieldValues, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/Button/button";
import { Input } from "~/components/ui/input";

const DeliveryPage: NextPage = () => {
  const minShortString = 2;
  const maxShortString = 50;
  type ShortStringProps = {
    min: number;
    max: number;
    label: string;
  };

  const shortStringMessage = ({ min, max, label }: ShortStringProps) =>
    `${label} doit contenir entre ${min} et ${max} caractères`;
  const firstnameMessage = shortStringMessage({
    label: "Le prénom",
    min: minShortString,
    max: maxShortString,
  });
  const lastnameMessage = shortStringMessage({
    label: "Le nom",
    min: minShortString,
    max: maxShortString,
  });
  const emailMessage = "Votre saisie n'est pas un email valide";
  const phoneMessage =
    "Votre saisie n'est pas un numéro de téléphone mobile français valide";

  const EXPRESS = "express";
  const FOLLOWED_LETTER = "lettre suivie";

  const deliveryOptionMessage =
    "Veuillez selectionner une méthode de livraison";

  const addressMessage = shortStringMessage({
    min: 5,
    max: 100,
    label: "L'adresse",
  });
  const cityMessage = shortStringMessage({
    min: 2,
    max: 50,
    label: "La ville",
  });
  const commentMessage = shortStringMessage({
    min: 10,
    max: 500,
    label: "Le commentaire",
  });
  const formSchema = z.object({
    firstname: z
      .string()
      .min(2, {
        message: firstnameMessage,
      })
      .max(50, { message: firstnameMessage }),
    lastname: z
      .string()
      .min(2, { message: lastnameMessage })
      .max(50, { message: lastnameMessage }),
    email: z.string().email({ message: emailMessage }),
    phone: z.number(),
    // .regex(/^(\+33|0)[1-9](\d{2}){4}$/, { message: phoneMessage }),
    deliveryOption: z.enum([EXPRESS, FOLLOWED_LETTER], {
      errorMap: () => ({ message: deliveryOptionMessage }),
    }),
    address: z
      .string()
      .min(5, { message: addressMessage })
      .max(100, { message: addressMessage }),
    city: z
      .string()
      .min(2, { message: cityMessage })
      .max(50, { message: cityMessage }),
    postal_code: z
      .string()
      .regex(/^\d{5}$/, { message: "Le code postal doit contenir 5 chiffres" }),
    comment: z
      .string()
      .min(10, { message: commentMessage })
      .max(500, { message: commentMessage }),
  });
  const defaultValues = {
    firstname: "",
    lastname: "",
    email: "",
    phone: undefined,
    deliveryOption: undefined,
    address: "",
    city: "",
    postal_code: "",
    comment: "",
  } as const;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("values", values);
  }

  type ShortInputProps = {
    label: string;
    placeholder: string;
    field: object;
  };
  const ShortInput = ({ label, placeholder, field }: ShortInputProps) => (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input placeholder={placeholder} {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
  return (
    <main>
      <Form {...form}>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <ShortInput label="Prénom" placeholder="Héloïse" field={field} />
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <ShortInput label="Nom" placeholder="Dior" field={field} />
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <ShortInput
                label="Email"
                placeholder="exemple@jegwell.fr"
                field={field}
              />
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <ShortInput
                label="Téléphone"
                placeholder="0612345678"
                field={field}
              />
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </main>
  );
};

export default DeliveryPage;
