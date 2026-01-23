import * as React from "react";

export function Container({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mx-auto w-full max-w-xl px-5 ${className}`} {...props} />
  );
}
