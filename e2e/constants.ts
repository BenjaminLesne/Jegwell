export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8000"
    : "http://127.0.0.1:8001";
export const PRODUCTS_PAGE_URL = `${BASE_URL}/creations`;
