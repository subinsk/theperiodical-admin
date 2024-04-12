import { cn } from "@/lib";

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
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  props?: any;
}): JSX.Element {
  const inputClassName = cn(
    "mt-2 flex h-12 w-full items-center justify-center border rounded-xl bg-white/0 p-3 text-sm outline-none",
    disabled &&
      "!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]",
    state === "error" &&
      "border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400",
    state === "success" &&
      "border-green-500 text-green-500 placeholder:text-green-500 dark:!border-green-400 dark:!text-green-400 dark:placeholder:!text-green-400",
    !disabled &&
      !state &&
      "border-gray-800 dark:!border-white/10 dark:text-white"
  );

  return (
    <div className={`${extra}`}>
      {label && (
        <label
          className={cn(
            "text-sm text-navy-700 dark:text-white",
            variant === "auth" ? "ml-1.5 font-medium" : "ml-3 font-bold"
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
        type={type}
        value={value}
        {...props}
      />
    </div>
  );
}
