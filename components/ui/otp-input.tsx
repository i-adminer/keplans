"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function OtpInput({
  value,
  onChange,
  length = 4,
  disabled = false,
  autoFocus = false,
  className,
}: OtpInputProps) {
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);

  React.useEffect(() => {
    if (autoFocus) {
      inputsRef.current[0]?.focus();
    }
  }, [autoFocus]);

  const values = React.useMemo(
    () => Array.from({ length }, (_, index) => value[index] ?? ""),
    [length, value],
  );

  const updateValue = (index: number, nextDigit: string) => {
    const next = [...values];
    next[index] = nextDigit;
    onChange(next.join("").replace(/\s+/g, ""));
  };

  const focusInput = (index: number) => {
    inputsRef.current[index]?.focus();
    inputsRef.current[index]?.select();
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) {
      return;
    }

    event.preventDefault();
    onChange(pasted);
    focusInput(Math.min(pasted.length, length - 1));
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-5 sm:gap-3 w-max",
        className,
      )}
    >
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(node) => {
            inputsRef.current[index] = node;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          disabled={disabled}
          value={values[index] ?? ""}
          onPaste={handlePaste}
          onChange={(event) => {
            const digit = event.target.value.replace(/\D/g, "").slice(-1);
            updateValue(index, digit);
            if (digit && index < length - 1) {
              focusInput(index + 1);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Backspace") {
              event.preventDefault();

              if (values[index]) {
                updateValue(index, "");
                return;
              }

              if (index > 0) {
                updateValue(index - 1, "");
                focusInput(index - 1);
              }
            }

            if (event.key === "ArrowLeft" && index > 0) {
              focusInput(index - 1);
            }

            if (event.key === "ArrowRight" && index < length - 1) {
              focusInput(index + 1);
            }
          }}
          className="flex h-10 w-10 border rounded-full border-input bg-background text-center text-base font-semibold tracking-widest shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-[3px] focus:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:w-14 sm:text-lg"
          aria-label={`One-time password digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
