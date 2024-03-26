import { Title } from "~/components/Title/Title";
import { Section } from "~/components/Section/Section";
import { ProductForm } from "~/components/Forms/ProductForm";
import { ProductsTable } from "./ProductsTable";
import { Button } from "~/components/ui/Button/button";
import Link from "next/link";
import { CREATE_CATEGORY_ROUTE, CREATE_PRODUCT_ROUTE } from "~/lib/constants";

export const metadata = {
  title: "gestion",
};

const AdminProductsPage = () => {
  return (
    <Section>
      <Title>Produits :</Title>
      <Button>
        <Link href={CREATE_PRODUCT_ROUTE}>Créer un produit</Link>
      </Button>
      <ProductsTable />
    </Section>
  );
};

export default AdminProductsPage;
