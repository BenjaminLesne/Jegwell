export const BASE_URL =
  process.env.APP_ENV === "dev"
    ? "http://127.0.0.1:8000"
    : "http://127.0.0.1:8001";
export const PRODUCTS_PAGE_URL = `${BASE_URL}/creations`;
