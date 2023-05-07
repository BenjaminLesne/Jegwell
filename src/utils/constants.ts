import { z } from "zod";

export const BRAND_NAME = "Jegwell";
export const TAB_BASE_TITLE = `${BRAND_NAME} | `;
export const PARAMS_QUERY_SCHEMA = z
  .object({
    select: z.record(z.string(), z.boolean()).optional(),
    include: z.record(z.string(), z.boolean()).optional(),
  })
  .optional();
// routes start
export const PRODUCTS_ROUTE = "/creations";

// routes end
