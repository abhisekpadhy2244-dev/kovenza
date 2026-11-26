'use client';

import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { FieldShell, controlClass } from './fields';

interface PhoneFieldProps {
  name: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
}

export function PhoneField({ name, label = 'Phone number', value, onChange, onBlur, error, required }: PhoneFieldProps) {
  const invalid = Boolean(error);
  return (
    <FieldShell
      name={name}
      label={label}
      required={required}
      error={error}
      hint="Choose your country, then enter your number."
    >
      <PhoneInput
        id={`field-${name}`}
        international
        countryCallingCodeEditable={false}
        defaultCountry="IN"
        value={value || undefined}
        onChange={(next) => onChange(next ?? '')}
        onBlur={onBlur}
        className="flex items-center gap-3"
        numberInputProps={{
          className: controlClass(invalid),
          'aria-invalid': invalid,
          'aria-required': required,
          'aria-describedby': invalid ? `field-${name}-error` : `field-${name}-hint`,
        }}
      />
    </FieldShell>
  );
}