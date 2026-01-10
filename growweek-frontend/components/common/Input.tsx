"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
            {label}
            {props.required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-3.5 py-2.5 rounded-lg
            bg-white dark:bg-stone-900
            border border-stone-200 dark:border-stone-700
            text-stone-900 dark:text-stone-100
            placeholder:text-stone-400 dark:placeholder:text-stone-500
            focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500
            dark:focus:ring-lime-500/30 dark:focus:border-lime-500
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-stone-50 dark:disabled:bg-stone-800
            transition-colors
            ${error ? "border-rose-400 focus:ring-rose-500/50 focus:border-rose-400" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-rose-500">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-stone-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
            {label}
            {props.required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-3.5 py-2.5 rounded-lg
            bg-white dark:bg-stone-900
            border border-stone-200 dark:border-stone-700
            text-stone-900 dark:text-stone-100
            placeholder:text-stone-400 dark:placeholder:text-stone-500
            focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500
            dark:focus:ring-lime-500/30 dark:focus:border-lime-500
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-stone-50 dark:disabled:bg-stone-800
            transition-colors resize-none
            ${error ? "border-rose-400 focus:ring-rose-500/50 focus:border-rose-400" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-rose-500">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-stone-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
            {label}
            {props.required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full px-3.5 py-2.5 rounded-lg
            bg-white dark:bg-stone-900
            border border-stone-200 dark:border-stone-700
            text-stone-900 dark:text-stone-100
            focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500
            dark:focus:ring-lime-500/30 dark:focus:border-lime-500
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-stone-50 dark:disabled:bg-stone-800
            transition-colors
            ${error ? "border-rose-400 focus:ring-rose-500/50 focus:border-rose-400" : ""}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1.5 text-sm text-rose-500">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
