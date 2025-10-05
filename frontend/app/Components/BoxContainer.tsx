import type { ReactNode } from "react";

type BoxContainerProps = {
  children: ReactNode;
  extraClassName?: string;
};

export default function BoxContainer({
  children,
  extraClassName
}: BoxContainerProps) {
  return (
    <div className={
      "p-8 md:max-w-sm md:rounded-lg md:shadow-lg min-h-full container content-center bg-gray-50 " +
      extraClassName
    }>
      {children}
    </div>
  );
};
