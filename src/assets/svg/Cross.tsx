import React from "react";
import { cn } from "~/lib/helpers/client";

export function Cross({
  className: customClasses = "",
}: {
  className?: string;
}) {
  return (
    <svg
      className={cn("h-6", "w-6", "fill-primary", customClasses)}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.1667 2.47834L15.5217 0.833344L9.00001 7.35501L2.47834 0.833344L0.833344 2.47834L7.35501 9.00001L0.833344 15.5217L2.47834 17.1667L9.00001 10.645L15.5217 17.1667L17.1667 15.5217L10.645 9.00001L17.1667 2.47834Z" />
    </svg>
  );
}
