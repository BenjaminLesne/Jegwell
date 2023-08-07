import { type NextPage } from "next";
import Link from "next/link";
import React, { useReducer } from "react";

import { Section } from "~/components/Section/Section";
import { Title } from "~/components/Title/Title";
import { Button } from "~/components/ui/Button/button";
import { PRODUCTS_ROUTE } from "~/lib/constants";
import { cn, consoleError } from "~/lib/helpers/helpers";

const jegwellEmail = "support@jegwell.fr";

const CopyButton = ({ text = jegwellEmail }: { text: string }) => {
  const [animationKey, incrementAnimationKey] = useReducer(
    (prev: number) => prev + 1,
    0
  );
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch((error) => consoleError(error));
    incrementAnimationKey();
  };

  return (
    <Button
      key={animationKey}
      variant="outline"
      onClick={() => copyToClipboard(text)}
      className={cn("relative", "overflow-hidden")}
    >
      Copier
      <span
        className={cn(
          "absolute",
          "inset-0",
          "opacity-0",
          "flex",
          "items-center",
          "justify-center",
          "bg-secondary",
          animationKey ? "animate-fadeIn" : ""
        )}
      >
        Copié !
      </span>
    </Button>
  );
};

const PaymentSucceededPage: NextPage = () => {
  // retrieve orderId from GET params? POST params?
  // set paid = true for order
  // if recapEmailSend = false
  // send recap email to customer (and solene?)
  // set recapEmailSent = true

  return (
    <main>
      <Section className="h-[500px] text-center">
        <Title className="text-green-600">Paiment réussi</Title>
        <p>Merci !</p>
        <p>Un récapitulatif de votre commande sera envoyé sur votre email</p>
        <p>En cas de besoin vous pouvez nous contacter à :</p>
        <p>
          <a href={`mailto:${jegwellEmail}`}>
            <Button variant="link">{jegwellEmail}</Button>
          </a>
          <CopyButton text={jegwellEmail} />
        </p>

        <Link href={PRODUCTS_ROUTE}>
          <Button className="mt-32" variant="secondary">
            Continuer le shopping
          </Button>
        </Link>
      </Section>
    </main>
  );
};

export default PaymentSucceededPage;
