import React from "react";
import { cn } from "~/lib/helpers/client";
export function Rings({
  className: customClasses = "",
}: {
  className?: string;
}) {
  return (
    <svg
      className={cn("h-6", "w-8", "fill-primary", customClasses)}
      width="236.44mm"
      height="175.7mm"
      version="1.1"
      viewBox="0 0 236.44 175.7"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(.29273 -8.9127)">
        <g
          transform="matrix(4.4163 0 0 4.4163 -102.83 -124.06)"
          light-content="true"
          non-strokable="false"
        >
          <path d="m62.75 35.27 1.83-1.48a1 1 0 0 0 0.17-1.37l-1.4-1.9a1 1 0 0 0-0.81-0.41h-6.54a1 1 0 0 0-0.8 0.4l-1.41 1.9a1 1 0 0 0 0.17 1.38l1.83 1.48a17.44 17.44 0 0 0-5.9 2.36 17.45 17.45 0 1 0 0.11 29.56 17.47 17.47 0 1 0 12.75-31.92zm-6.28-3.16h5.53l0.53 0.72-3.31 2.69-3.32-2.69zm-15.77 35.78a15.45 15.45 0 1 1 7.43-29 17.47 17.47 0 0 0 0.07 27 15.24 15.24 0 0 1-7.5 2zm15.44-15.44a15.41 15.41 0 0 1-6.14 12.32 15.48 15.48 0 0 1-0.09-24.71 15.41 15.41 0 0 1 6.23 12.39zm3.12 15.44a15.25 15.25 0 0 1-7.51-2 17.42 17.42 0 0 0-0.08-27 15.43 15.43 0 0 1 6-1.9h0.17l0.79 0.63a1 1 0 0 0 0.63 0.22 1 1 0 0 0 0.63-0.22l0.78-0.63h0.17a15.49 15.49 0 0 1-1.58 30.89z" />
        </g>
      </g>
    </svg>
  );
}
