import React from "react";
import { cn } from "~/lib/helpers/helpers";

interface SectionProps {
  component?: keyof JSX.IntrinsicElements;
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  id = "",
}) => {
  const classes = cn("py-5", "mx-2", className);
  return React.createElement("section", { className: classes, id }, children);
};
