import React from "react";
import { cn } from "~/lib/helpers/helpers";

interface TitleProps {
  component?: keyof JSX.IntrinsicElements;
  className?: string;
  children?: React.ReactNode;
}

export const Title: React.FC<TitleProps> = ({
  component = "h1",
  children,
  className = "",
}) => {
  const classes = cn(
    "text-2xl",
    "font-normal",
    "text-center",
    "py-12",
    className
  );

  return React.createElement(component, { className: classes }, children);
};
