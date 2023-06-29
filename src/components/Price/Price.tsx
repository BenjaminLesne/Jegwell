import React from "react";
import { PRICE_TESTID } from "~/lib/constants";
import { formatPrice } from "~/lib/helpers/helpers";
type Props = {
  priceInCents: number;
};
export const Price = ({ priceInCents, ...props }: Props) => {
  const price = formatPrice(priceInCents / 100);

  const spaceIndex = price.indexOf(" ");
  const commaIndex = price.indexOf(",");

  const whole = price.slice(0, commaIndex);
  const decimal = price.slice(commaIndex, spaceIndex - 1);
  const currency = price.slice(spaceIndex - 1);

  return (
    <span className="text-xl font-bold" data-testid={PRICE_TESTID} {...props}>
      {whole}
      <span className="text-xs">{decimal}</span>
      {currency}
    </span>
  );
};
