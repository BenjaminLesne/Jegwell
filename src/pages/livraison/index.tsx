import { type NextPage } from "next";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";
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
import { api } from "~/lib/api";
import { consoleError, getStripe, useBasket } from "~/lib/helpers/helpers";
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
  const { mutateAsync: createOrder } = api.orders.create.useMutation();
  const { data: deliveryOptions, isLoading: deliveryOptionsAreLoading } =
    api.deliveryOptions.getAll.useQuery();

  async function onSubmit(values: z.infer<typeof deliveryFormSchema>) {
    setIsLoading(true);

    const order = await createOrder({
      ...values,
      productsToBasket: basket,
    });

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

    const { mutateAsync: createCheckout, error: createCheckoutError } =
      api.payments.createCheckout.useMutation();

    consoleError(createCheckoutError);

    const response = await createCheckout({
      productsToBasket: basket,
      customer: customer,
      orderId: order.id,
    });

    const stripe = await getStripe();

    if (stripe != null) {
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.id,
      });

      consoleError(error);
    } else {
      consoleError("cannot redirect to checkout, stripe is null");
    }

    setIsLoading(false);
  }
  const form = useForm<z.infer<typeof deliveryFormSchema>>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: defaultValues,
  });

  if (isLoading || deliveryOptionsAreLoading)
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
                      {deliveryOptions?.map((delivery) => (
                        <FormItem
                          className="flex items-center space-x-3 space-y-0"
                          key={delivery.id}
                        >
                          <FormControl>
                            <RadioGroupItem value={delivery.id.toString()} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {delivery.name}
                          </FormLabel>
                          {delivery.description && (
                            <FormDescription>
                              {delivery.description}
                            </FormDescription>
                          )}
                        </FormItem>
                      ))}
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
