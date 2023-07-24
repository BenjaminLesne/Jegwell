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
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { execOnce } from "next/dist/shared/lib/utils";
import { Textarea } from "~/components/ui/textarea";
import { Section } from "~/components/Section/Section";
import { Title } from "~/components/Title/Title";

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
  const phoneMessage = "Votre saisie doit uniquement être des nombres";

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
    min: 0,
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
    phone: z.string({ description: phoneMessage }),
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
    postalCode: z
      .string()
      .regex(/^\d{5}$/, { message: "Le code postal doit contenir 5 chiffres" }),
    comment: z.string().max(500, { message: commentMessage }).optional(),
  });
  const defaultValues = {
    firstname: "",
    lastname: "",
    email: "",
    phone: undefined,
    deliveryOption: undefined,
    address: "",
    city: "",
    postalCode: "",
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
      <Section>
        <Title>Livraison</Title>
        <Form {...form}>
          <form
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto max-w-prose space-y-8"
          >
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <ShortInput
                  label="Prénom"
                  placeholder="Héloïse"
                  field={field}
                />
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

            <FormField
              control={form.control}
              name="deliveryOption"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Méthode de livraison</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={EXPRESS} />
                        </FormControl>
                        <FormLabel className="font-normal">{EXPRESS}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={FOLLOWED_LETTER} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {FOLLOWED_LETTER}
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <ShortInput
                  label="Adresse"
                  placeholder="16 rue de la Genetais"
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <ShortInput label="Ville" placeholder="Paris" field={field} />
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <ShortInput
                  label="Le code postal"
                  placeholder="35170"
                  field={field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaire</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="J'adore Jegwell !"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Vous avez des précisions pour la livraison ? un soucis avec
                    le formulaire ? Vous adorez Jegwell ? Dites-le nous !
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </Section>
    </main>
  );
};

export default DeliveryPage;
