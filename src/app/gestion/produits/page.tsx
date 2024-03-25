import { Title } from "~/components/Title/Title";
import { Section } from "~/components/Section/Section";
import { ProductForm } from "~/components/Forms/ProductForm";
import { ProductsTable } from "./ProductsTable";

export const metadata = {
  title: "gestion",
};

const AdminProductsPage = () => {
  return (
    <Section>
      <Title>Produits :</Title>
      <ProductForm />
      <ProductsTable />
    </Section>
  );
};

export default AdminProductsPage;
