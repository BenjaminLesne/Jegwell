import { Button } from "~/components/ui/Button/button";
import { DeliveryOptionTable } from "./DeliveryOptionTable/DeliveryOptionTable";
import Link from "next/link";
import { CREATE_DELIVERY_OPTION_ROUTE } from "~/lib/constants";

export default function Page() {
  return (
    <>
      <Button>
        <Link href={CREATE_DELIVERY_OPTION_ROUTE}>
          Créer une méthode de livraison
        </Link>
      </Button>
      <DeliveryOptionTable />;
    </>
  );
}
