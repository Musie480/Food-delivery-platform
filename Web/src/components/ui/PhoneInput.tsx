import { useState } from "react";
import type { UseFormRegisterReturn, UseFormSetValue } from "react-hook-form";

interface PhoneInputProps {
  label?: string;
  error?: string;
  register: UseFormRegisterReturn;
  setValue: UseFormSetValue<any>;
  placeholder?: string;
}

export function PhoneInput({
  label,
  error,
  register,
  setValue,
  placeholder = "91 123 4567",
}: PhoneInputProps) {
  const [display, setDisplay] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    let localDigits = raw;

    if (raw.startsWith("00251")) {
      localDigits = raw.slice(5);
    } else if (raw.startsWith("251")) {
      localDigits = raw.slice(3);
    } else if (raw.startsWith("0")) {
      localDigits = raw.slice(1);
    }

    const normalized = localDigits.slice(0, 9);
    setDisplay(normalized);
    setValue(register.name, `+251${normalized}`, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-surface-700">{label}</label>
      )}
      <div className="overflow-hidden rounded-2xl border border-surface-200 bg-white ring-1 ring-black/[0.02] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/10">
        <div className="flex items-center">
          <span className="flex items-center gap-1.5 pl-4 pr-2 text-sm text-surface-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </span>
          <span className="text-sm text-surface-400 select-none">+251</span>
          <input
            ref={register.ref}
            name={register.name}
            className="w-full bg-transparent py-3 pr-4 pl-1 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none"
            placeholder={placeholder}
            type="tel"
            inputMode="numeric"
            value={display}
            onBlur={register.onBlur}
            onChange={handleChange}
          />
        </div>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
