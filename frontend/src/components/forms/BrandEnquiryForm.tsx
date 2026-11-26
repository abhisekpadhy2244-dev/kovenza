'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CheckboxField, Honeypot, SelectField, TextAreaField, TextField } from './fields';
import { PhoneField } from './PhoneField';
import { SpamCheck } from './SpamCheck';
import { SubmissionSuccess } from './SubmissionSuccess';
import { brandDefaults, brandSchema, type BrandFormValues } from '@/lib/brandSchema';
import { COUNTRIES } from '@/lib/countries';
import type { FormOptions } from '@/lib/formOptions';
import { ApiError, postJson } from '@/services/api';

const countryOptions = COUNTRIES.map((name) => ({ value: name, label: name }));

export function BrandEnquiryForm({ options }: { options: FormOptions }) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: brandDefaults,
    mode: 'onTouched',
  });

  const turnstileRef = useRef<TurnstileInstance | undefined>(undefined);
  const [token, setToken] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [enquiryCode, setEnquiryCode] = useState<string | null>(null);

  const resetSpamCheck = () => {
    turnstileRef.current?.reset();
    setToken('');
  };

  const onSubmit: SubmitHandler<BrandFormValues> = async (values) => {
    setFormError(null);

    if (!token) {
      setFormError('Please complete the spam check below, then send your enquiry again.');
      return;
    }

    try {
      const result = await postJson<{ enquiryCode: string }>('/api/public/brand-enquiries', {
        ...values,
        turnstileToken: token,
      });
      setEnquiryCode(result.enquiryCode);
    } catch (error) {
      if (error instanceof ApiError) {
        for (const [field, message] of Object.entries(error.fieldErrors)) {
          if (field in brandDefaults) {
            setError(field as keyof BrandFormValues, { type: 'server', message });
          }
        }
        setFormError(error.message);
      } else {
        setFormError('Something went wrong. Please try again.');
      }
      resetSpamCheck();
    }
  };

  if (enquiryCode) {
    return (
      <SubmissionSuccess
        title="Thank you. Your enquiry is in."
        message="We have received your enquiry and sent a confirmation to your email. Our team will review it."
        referenceLabel="Your enquiry reference"
        code={enquiryCode}
        note="If you do not see the confirmation email, please check your spam folder."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-busy={isSubmitting} className="relative space-y-6">
      <p className="text-sm">
        Fields marked <span className="font-semibold text-highlight">*</span> are required.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Full name"
          required
          autoComplete="name"
          error={errors.fullName?.message}
          {...register('fullName')}
        />
        <TextField
          label="Business email"
          type="email"
          required
          autoComplete="email"
          error={errors.businessEmail?.message}
          {...register('businessEmail')}
        />
        <TextField
          label="Company name"
          required
          autoComplete="organization"
          error={errors.companyName?.message}
          {...register('companyName')}
        />
        <SelectField
          label="Country"
          required
          autoComplete="country-name"
          placeholder="Select your country"
          options={countryOptions}
          error={errors.country?.message}
          {...register('country')}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <PhoneField
              name="phone"
              required
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.phone?.message}
            />
          )}
        />
        <TextField
          label="Website"
          required
          inputMode="url"
          autoComplete="url"
          hint="For example: yourbrand.com"
          error={errors.website?.message}
          {...register('website')}
        />
        <SelectField
          label="Industry"
          required
          placeholder="Select your industry"
          options={options.industries.map((item) => ({ value: item.id, label: item.name }))}
          error={errors.industryId?.message}
          {...register('industryId')}
        />
        <SelectField
          label="Service required"
          required
          placeholder="Select a service"
          options={options.services.map((item) => ({ value: item.id, label: item.name }))}
          error={errors.serviceId?.message}
          {...register('serviceId')}
        />
      </div>

      <TextAreaField
        label="Campaign objective"
        required
        hint="What do you want this campaign to achieve?"
        error={errors.objective?.message}
        {...register('objective')}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Budget range"
          placeholder="Select a range"
          options={options.budgetRanges.map((value) => ({ value, label: value }))}
          error={errors.budgetRange?.message}
          {...register('budgetRange')}
        />
        <SelectField
          label="Expected timeline"
          required
          placeholder="Select a timeline"
          options={options.timelines.map((value) => ({ value, label: value }))}
          error={errors.timeline?.message}
          {...register('timeline')}
        />
      </div>

      <TextAreaField
        label="Additional information"
        error={errors.additionalInfo?.message}
        {...register('additionalInfo')}
      />

      <Honeypot {...register('hp')} />

      <CheckboxField error={errors.consentPrivacy?.message} {...register('consentPrivacy')}>
        I agree to the{' '}
        <Link
          href="/legal/privacy-policy"
          target="_blank"
          className="font-semibold text-heading underline underline-offset-4 hover:text-highlight"
        >
          Privacy Policy
          <span className="sr-only"> (opens in a new tab)</span>
        </Link>
        . <span aria-hidden="true" className="text-highlight">*</span>
      </CheckboxField>

      <SpamCheck onToken={setToken} turnstileRef={turnstileRef} />

      {formError ? (
        <div role="alert" className="rounded-xl border border-[#B42318] bg-[#FEF3F2] p-4 text-sm font-medium text-[#B42318]">
          {formError}
        </div>
      ) : null}

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            Sending...
          </>
        ) : (
          'Send enquiry'
        )}
      </Button>
    </form>
  );
}