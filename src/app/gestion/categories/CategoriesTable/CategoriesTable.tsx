import { fetchCategoryAll } from "~/lib/data";
import { categoriesColumns } from "./columns";
import { CategoriesDataTable } from "./CategoriesDataTable";

export const metadata = {
  title: "Catégories | gestion",
};

export const CategoriesTable = async () => {
  const categories = await fetchCategoryAll();

  return <CategoriesDataTable columns={categoriesColumns} data={categories} />;
};
