type GetSelectFieldsProps = {
  fields: string[];
  authorizedFields: readonly string[];
};
type SelectField = { [k: string]: SelectField | boolean };

export function getSelectFields({
  fields,
  authorizedFields,
}: GetSelectFieldsProps) {
  const selectFields: SelectField = {};

  fields.forEach((field) => {
    if (!authorizedFields.includes(field)) return;

    const fieldParts = field.split(".");
    let currentField = selectFields;

    for (let i = 0; i < fieldParts.length; i++) {
      const fieldName = fieldParts[i];
      if (fieldName == null) continue;

      const isLastField = i === fieldParts.length - 1;

      if (!currentField[fieldName]) {
        if (isLastField) {
          currentField[fieldName] = true;
        } else {
          currentField[fieldName] = { select: {} };
        }
      }

      currentField = (currentField[fieldName] as Record<string, object>)
        .select as typeof selectFields;
    }
  });

  return selectFields;
}

type FormatPriceProps = {
  price: number;
};
export function formatPrice({ price }: FormatPriceProps) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

export const getPrices = (pricesElement: (SVGElement | HTMLElement)[]) =>
  pricesElement.map((element) => {
    const priceAsString = element.textContent?.replace(/[\s€]/g, "");
    if (typeof priceAsString !== "string") return NaN;

    return parseFloat(priceAsString);
  });

export const getNames = (namesElement: (SVGElement | HTMLElement)[]) =>
  namesElement.map((element) => {
    const name = element.textContent;
    if (typeof name !== "string" || name === "")
      throw Error("The product name is undefined");

    return name;
  });

export type isSortedProps = {
  array: (string | number)[];
  order: "asc" | "desc";
};
export function isSorted({ array, order }: isSortedProps) {
  if (array.length < 2) return true;

  let lastItem;
  for (let i = 0; i < array.length; i++) {
    const currentItem = array[i];
    if (currentItem == null) continue;
    if (lastItem == null) {
      lastItem = currentItem;
      continue;
    }
    if (order === "asc" && currentItem < lastItem) return false;
    if (order === "desc" && currentItem > lastItem) return false;
  }
  return true;
}

