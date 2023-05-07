import React from "react";

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
  const classes = `py-5 ${className}`;
  return React.createElement("section", { className: classes, id }, children);
};
