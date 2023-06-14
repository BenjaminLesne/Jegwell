import React from "react";
import { capitalize } from "~/lib/helpers/helpers";

import type * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

export const OrderItemModifier = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger>
>(({ name, value, ...props }, forwardRef) => {
  return (
    <button
      {...props}
      ref={forwardRef}
      className="relative m-0 flex w-full justify-between text-sm after:absolute after:bottom-[-4px] after:left-0 after:h-[1.5px] after:w-full after:bg-neutral-50 after:bg-opacity-25 after:content-['']"
    >
      <span>{capitalize(name ?? "")}:</span>
      <div className="flex gap-3">
        <span>{value}</span>
        <div className="my-auto mb-2 h-2 w-2 rotate-45 border-b-2 border-r-2 border-solid border-black"></div>
      </div>
    </button>
  );
});

OrderItemModifier.displayName = "OrderItemModifier";
