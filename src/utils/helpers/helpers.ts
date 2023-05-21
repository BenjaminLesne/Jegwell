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
