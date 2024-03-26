import Link from "next/link";
import { CREATE_CATEGORY_ROUTE } from "~/lib/constants";
import { CategoriesTable } from "./CategoriesTable/CategoriesTable";
import { Button } from "~/components/ui/Button/button";

export default function Page() {
  return (
    <>
      <Button>
        <Link href={CREATE_CATEGORY_ROUTE}>Créer une categorie</Link>
      </Button>
      <CategoriesTable />
    </>
  );
}
