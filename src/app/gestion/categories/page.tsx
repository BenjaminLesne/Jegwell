import Link from "next/link";
import { CREATE_CATEGORY_ROUTE } from "~/lib/constants";

export default function Page() {
  return <Link href={CREATE_CATEGORY_ROUTE}>Créer une categorie</Link>;
}
