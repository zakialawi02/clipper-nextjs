"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Loader2, LucideIcon, ArrowRight, Type } from "lucide-react";
import { cn } from "@/lib/utils";

interface TextSubmitInputProps {
  onSubmit?: (value: string) => void;
  className?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  buttonText?: string;
  buttonIcon?: LucideIcon;
  type?: string;
}

export function TextSubmitInput({
  onSubmit,
  className,
  placeholder = "Enter text here...",
  defaultValue = "",
  value,
  onChange,
  isLoading = false,
  disabled = false,
  icon: Icon = Type,
  buttonText = "Submit",
  buttonIcon: ButtonIcon = ArrowRight,
  type = "text",
}: TextSubmitInputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue("");
    }
    onChange?.("");
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (currentValue && !isLoading && !disabled) {
      onSubmit?.(currentValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className={cn("flex w-full max-w-3xl items-center gap-4 mx-auto", className)}>
      <div className="relative flex-1 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon
            className={cn(
              "h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors",
              disabled && "opacity-50",
            )}
          />
        </div>
        <Input
          type={type}
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          className="pl-12 pr-12 h-14 text-lg bg-background shadow-sm border-2 border-muted hover:border-primary/50 focus-visible:border-primary focus-visible:ring-0 transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {currentValue && !disabled && !isLoading && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            type="button"
            disabled={disabled || isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <Button
        size="lg"
        onClick={() => handleSubmit()}
        disabled={disabled || isLoading}
        className="h-14 px-8 text-base font-semibold shadow-lg rounded-xl transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <ButtonIcon className="mr-2 h-5 w-5 fill-current" />
        )}
        {buttonText}
      </Button>
    </div>
  );
}
