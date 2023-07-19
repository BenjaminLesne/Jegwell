import React from "react";
import { capitalize } from "~/lib/helpers/helpers";

import type * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

export const OrderItemModifier = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger> & {
    testid: string;
  }
>(({ name, value, testid, ...props }, forwardRef) => {
  return (
    <button
      {...props}
      ref={forwardRef}
      className="relative m-0 flex h-12 w-full items-center justify-between text-sm"
    >
      <span>{capitalize(name ?? "")}:</span>
      <div className="flex gap-3">
        <span data-testid={testid}>{value}</span>
        <div className="my-auto mb-2 h-2 w-2 rotate-45 border-b-2 border-r-2 border-solid border-black"></div>
      </div>
    </button>
  );
});

OrderItemModifier.displayName = "OrderItemModifier";
