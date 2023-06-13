import React from "react";
import { formatPrice } from "~/lib/helpers/helpers";
type Props = {
  value: number;
};
export const Price = ({ value }: Props) => {
  const price = formatPrice(value);

  const spaceIndex = price.indexOf(" ");
  const commaIndex = price.indexOf(",");

  const whole = price.slice(0, commaIndex);
  const decimal = price.slice(commaIndex, spaceIndex - 1);
  const currency = price.slice(spaceIndex - 1);

  return (
    <span className="text-xl font-bold">
      {whole}
      <span className="text-xs">{decimal}</span>
      {currency}
    </span>
  );
};
