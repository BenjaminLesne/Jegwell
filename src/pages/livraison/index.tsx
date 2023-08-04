import { type NextPage } from "next";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Textarea } from "~/components/ui/textarea";
import { Section } from "~/components/Section/Section";
import { Title } from "~/components/Title/Title";
import { useRouter } from "next/router";
import { api } from "~/lib/api";
import {
  consoleError,
  fetchPostJSON,
  getStripe,
  getSubtotalPrice,
  useBasket,
} from "~/lib/helpers/helpers";
import { Loading } from "~/components/Loading/Loading";
import { deliveryFormSchema } from "~/lib/constants";

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

const EXPRESS = "express";
const FOLLOWED_LETTER = "lettre suivie";

const defaultValues = {
  firstname: "",
  lastname: "",
  email: "",
  phone: undefined,
  deliveryOptionId: undefined,
  address1: "",
  address2: "",
  city: "",
  postalCode: "",
  comment: "",
} as const;

const DeliveryPage: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { basket } = useBasket();
  async function onSubmit(values: z.infer<typeof deliveryFormSchema>) {
    setIsLoading(true);
    // //////////////////THIS SHOULD BE DONE SERVER SIDE//////////////////////
    // we should pass as input of the api the basket
    // this basket is used to fetch products and calculate the total price (dont forget delivery fee!!)
    //

    // create order
    // const createOrder = api.orders.create.useMutation(values)
    const { mutateAsync: createOrder } = api.orders.create.useMutation();

    await createOrder({
      ...values,
      productsToBasket: basket,
    });
    // get back the id of the order
    // pass it to the checkoutsession args
    // add it to metadata in stripe
    // //////////////////////////////////////////////////////////////////

    const {
      lastname,
      firstname,
      line1,
      line2,
      email,
      phone,
      city,
      postalCode,
    } = values;

    const customer = {
      name: firstname + " " + lastname,
      email,
      phone,
      address: {
        city,
        country: "France",
        line1,
        line2,
        postal_code: postalCode,
      },
    };
    // Create a Checkout Session.
    const response = await fetchPostJSON("/api/checkoutSessions", {
      basket,
      customer: customer,
    });

    if (response.statusCode === 500) {
      consoleError(response.message);
      return;
    }

    // Redirect to Checkout.
    const stripe = await getStripe();
    const { error } = await stripe!.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId: response.id,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    console.warn(error.message);
    setIsLoading(false);
  }
  const form = useForm<z.infer<typeof deliveryFormSchema>>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: defaultValues,
  });

  if (isLoading)
    return (
      <main>
        <Loading />
      </main>
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
              name="deliveryOptionId"
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
              name="line1"
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
              name="line2"
              render={({ field }) => (
                <ShortInput
                  label="Complément"
                  placeholder="Bâtiment 1A, RDC, porte gauche"
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
            <Button type="submit">Passer au paiement</Button>
          </form>
        </Form>
      </Section>
    </main>
  );
};

export default DeliveryPage;
