"use client";

import { cn } from "@/lib";
import { useState } from "react";
import { IoEyeOutline , IoEyeOffOutline  } from "react-icons/io5";

export function InputField({
  id,
  label,
  extra,
  placeholder,
  state,
  disabled,
  type,
  variant,
  value,
  isPassword,
  onChange,
  ...props
}: {
  id?: string;
  label?: string;
  extra?: string;
  placeholder?: string;
  state?: string;
  disabled?: boolean;
  type?: string;
  value?: string;
  variant?: string;
  isPassword?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  props?: any;
}): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);

  const inputClassName = cn(
    "mt-2 flex h-12 w-full items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    disabled &&
      "!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]",
    state === "error" &&
      "border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400",
    state === "success" &&
      "border-green-500 text-green-500 placeholder:text-green-500 dark:!border-green-400 dark:!text-green-400 dark:placeholder:!text-green-400",
    !disabled &&
      !state &&
      "dark:!border-white/10 dark:text-white"
  );

  return (
    <div className={`relative ${extra}`}>
      {label && (
        <label
          className={cn(
            "text-sm text-navy-700 dark:text-white",
            variant === "auth" ? "ml-1.5 font-medium" : "ml-3 font-bold",
          )}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        className={inputClassName}
        disabled={disabled}
        id={id}
        onChange={onChange}
        placeholder={placeholder}
        type={isPassword ? isPassword && !showPassword ? 'password' : 'text': type}
        value={value}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          className="absolute right-3 top-[55%]"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <IoEyeOutline size={24}/>: <IoEyeOffOutline  size={24}/>} {/* Replace with actual icons */}
        </button>
      )}
    </div>
  );
}
