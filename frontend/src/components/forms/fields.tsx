'use client';

import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/lib/utils';

export const controlClass = (invalid: boolean) =>
  cn(
    'block w-full min-h-[48px] rounded-xl border bg-page px-4 py-3 text-base text-heading transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-decor',
    invalid ? 'border-[#B42318]' : 'border-body focus:border-highlight',
  );

const idOf = (name: string) => `field-${name}`;

function describedBy(name: string, error?: string, hint?: string) {
  if (error) return `${idOf(name)}-error`;
  if (hint) return `${idOf(name)}-hint`;
  return undefined;
}

interface BaseProps {
  name: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
}

export function FieldShell({
  name,
  label,
  required,
  hint,
  error,
  className,
  children,
}: BaseProps & { children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={idOf(name)} className="mb-2 block text-sm font-semibold text-heading">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-highlight">
            {' '}
            *
          </span>
        ) : (
          <span className="font-normal text-body"> (optional)</span>
        )}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${idOf(name)}-hint`} className="mt-1.5 text-sm">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${idOf(name)}-error`} role="alert" className="mt-1.5 text-sm font-medium text-[#B42318]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const TextField = forwardRef<
  HTMLInputElement,
  BaseProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'className'>
>(function TextField({ name, label, required, hint, error, className, ...rest }, ref) {
  return (
    <FieldShell name={name} label={label} required={required} hint={hint} error={error} className={className}>
      <input
        ref={ref}
        id={idOf(name)}
        name={name}
        aria-invalid={Boolean(error)}
        aria-required={required}
        aria-describedby={describedBy(name, error, hint)}
        className={controlClass(Boolean(error))}
        {...rest}
      />
    </FieldShell>
  );
});

export const SelectField = forwardRef<
  HTMLSelectElement,
  BaseProps &
    Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name' | 'className'> & {
      options: { value: string; label: string }[];
      placeholder: string;
    }
>(function SelectField({ name, label, required, hint, error, className, options, placeholder, ...rest }, ref) {
  return (
    <FieldShell name={name} label={label} required={required} hint={hint} error={error} className={className}>
      <select
        ref={ref}
        id={idOf(name)}
        name={name}
        aria-invalid={Boolean(error)}
        aria-required={required}
        aria-describedby={describedBy(name, error, hint)}
        className={controlClass(Boolean(error))}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
});

export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  BaseProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name' | 'className'>
>(function TextAreaField({ name, label, required, hint, error, className, ...rest }, ref) {
  return (
    <FieldShell name={name} label={label} required={required} hint={hint} error={error} className={className}>
      <textarea
        ref={ref}
        id={idOf(name)}
        name={name}
        rows={5}
        aria-invalid={Boolean(error)}
        aria-required={required}
        aria-describedby={describedBy(name, error, hint)}
        className={controlClass(Boolean(error))}
        {...rest}
      />
    </FieldShell>
  );
});

export const CheckboxField = forwardRef<
  HTMLInputElement,
  { name: string; error?: string; children: ReactNode } & Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'name' | 'type' | 'className' | 'children'
  >
>(function CheckboxField({ name, error, children, ...rest }, ref) {
  return (
    <div>
      <label htmlFor={idOf(name)} className="flex cursor-pointer items-start gap-3">
        <input
          ref={ref}
          id={idOf(name)}
          name={name}
          type="checkbox"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${idOf(name)}-error` : undefined}
          className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-button"
          {...rest}
        />
        <span className="text-[0.9375rem] leading-relaxed">{children}</span>
      </label>
      {error ? (
        <p id={`${idOf(name)}-error`} role="alert" className="mt-1.5 text-sm font-medium text-[#B42318]">
          {error}
        </p>
      ) : null}
    </div>
  );
});

/** Hidden trap for bots. People never see or tab to it. The backend treats a filled value as spam. */
export const Honeypot = forwardRef<HTMLInputElement, Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>>(
  function Honeypot(props, ref) {
    return (
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input ref={ref} type="text" tabIndex={-1} autoComplete="off" {...props} />
        </label>
      </div>
    );
  },
);