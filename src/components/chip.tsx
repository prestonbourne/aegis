import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/risk/types";

export const getChipLevel = (level: string | RiskLevel) => {
  switch (level) {
    case "low":
      return "warning";
    case "medium":
      return "warning";
    case "high":
      return "danger";
    default:
    case "safe":
      return "info";
  }
};

const chipVariants = cva(
  "inline-flex items-center justify-center px-3 py-1 font-medium",
  {
    variants: {
      level: {
        base: "bg-gray-200 text-black",
        info: "bg-blue-100 text-blue-700 border-blue-500 border",
        danger: "bg-red-100 text-red-500 border-red-500 border",
        warning: "bg-orange-100 text-orange-700 border-orange-500 border",
        paper: "bg-white text-black border-gray-200 border shadow-sm px-2 py-2",
      },
      rounded: {
        true: "rounded-full",
        false: "rounded-md",
      },
      textSize: {
        small: "text-xs",
        normal: "text-sm",
      },
      fixedWidth: {
        true: "w-12",
      },
    },
    defaultVariants: {
      level: "base",
      textSize: "small",
      fixedWidth: false,
      rounded: true,
    },
  }
);

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {
  children?: React.ReactNode;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  children,
  fixedWidth,
  level,
  rounded,
  textSize,
  className = "",
  ...props
}) => {
  // Define colors based on the level prop

  return (
    <div
      className={cn(
        chipVariants({
          fixedWidth,
          level,
          rounded,
          textSize,
        }),
        className
      )}
    >
      {children}
    </div>
  );
};
