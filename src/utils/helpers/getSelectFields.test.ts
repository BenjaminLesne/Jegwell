import { describe, expect, test } from "vitest";
import { getSelectFields } from "./helpers";

describe("getSelectFields", () => {
  test("Use only authorized fields", () => {
    const expectedResult = {
      image: {
        select: {
          url: true,
        },
      },
      name: true,
    };
    const fields = ["name", "image.url", "image.name"];
    const authorizedFields = ["name", "image.url"];

    const result = getSelectFields({ fields, authorizedFields });

    expect(expectedResult).toEqual(result);
  });
});
