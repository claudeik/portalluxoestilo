import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-medium transition-all rounded-xl focus:outline-none disabled:opacity-50";
  const variants = {
    primary: "bg-[#C9A961] text-[#0A0908] hover:bg-[#DFC484]",
    secondary: "bg-[#141210] text-[#F5EFE6] border border-[#2A2520] hover:border-[#C9A961]/50",
    outline: "border border-[#C9A961] text-[#C9A961] hover:bg-[#C9A961]/10",
    ghost: "text-[#A89F91] hover:text-[#F5EFE6]",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base",
  };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
