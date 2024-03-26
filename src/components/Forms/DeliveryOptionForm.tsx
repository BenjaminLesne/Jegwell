"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createDeliveryOption } from "~/lib/actions";
import { PriceSchema } from "~/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/Button/button";
import { Textarea } from "../ui/textarea";

const DeliveryOptionFormSchema = z.object({
  name: z.string(),
  price: z.coerce.number().gt(0),
  description: z.string().optional(),
});

export const DeliveryOptionForm = () => {
  const form = useForm<z.infer<typeof DeliveryOptionFormSchema>>({
    resolver: zodResolver(DeliveryOptionFormSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof DeliveryOptionFormSchema>) {
    try {
      const formData = new FormData();

      const priceInCentsRaw = values.price * 100;
      const priceInCents = PriceSchema.parse(priceInCentsRaw.toString());

      formData.append("name", values.name);
      formData.append("priceInCents", priceInCents);

      if (values.description != null) {
        formData.append("description", values.description);
      }

      await createDeliveryOption(formData);
    } catch (error) {
      console.error("Error submitting image : ", error);
    }
  }

  return (
    <>
      <h1>Création d'une méthode de livraison</h1>
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="ma description" {...field} />
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
                  <Input placeholder="99.99" {...field} />
                </FormControl>
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
