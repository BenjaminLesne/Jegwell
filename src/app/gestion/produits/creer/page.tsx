import { Section } from "~/components/Section/Section";
import { ProductForm } from "~/components/Forms/ProductForm";

export const metadata = {
  title: "gestion",
};

export default function Page() {
  return (
    <Section>
      <ProductForm />
    </Section>
  );
}
