import { db } from "~/server/db";

export const fetchDeliveryOptionAll = async () => {
  return await db.deliveryOption.findMany({
    select: {
      id: true,
      description: true,
      name: true,
      price: true,
      createdAt: true,
    },
  });
};
