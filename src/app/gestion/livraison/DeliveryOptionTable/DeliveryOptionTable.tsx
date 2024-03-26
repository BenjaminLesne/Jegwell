import { fetchDeliveryOptionAll } from "~/lib/data";
import { deliveryOptionColumns } from "./columns";
import { DeliveryOptionDataTable } from "./DeliveryOptionDataTable";

export const metadata = {
  title: "Méthodes de livraison | gestion",
};

export const DeliveryOptionTable = async () => {
  const deliveryOptions = await fetchDeliveryOptionAll();

  return (
    <DeliveryOptionDataTable
      columns={deliveryOptionColumns}
      data={deliveryOptions}
    />
  );
};
