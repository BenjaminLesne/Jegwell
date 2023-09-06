import { authMiddleware } from "@clerk/nextjs";
import {
  BASKET_ROUTE,
  DELIVERY_ROUTE,
  HOME_ROUTE,
  PAYMENT_SUCCEEDED_ROUTE,
  PRODUCTS_ROUTE,
  SINGLE_PRODUCT_ROUTE,
} from "./lib/constants";

export default authMiddleware({
  publicRoutes: [
    HOME_ROUTE,
    PRODUCTS_ROUTE,
    SINGLE_PRODUCT_ROUTE,
    DELIVERY_ROUTE,
    PAYMENT_SUCCEEDED_ROUTE,
    BASKET_ROUTE,
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
