'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CheckboxField, FieldShell, Honeypot, SelectField, TextAreaField, TextField, controlClass } from './fields';
import { PhoneField } from './PhoneField';
import { SpamCheck } from './SpamCheck';
import { SubmissionSuccess } from './SubmissionSuccess';
import { COUNTRIES } from '@/lib/countries';
import { creatorDefaults, creatorSchema, MAX_MEDIA_KIT_BYTES, type CreatorFormValues } from '@/lib/creatorSchema';
import type { FormOptions } from '@/lib/formOptions';
import { LANGUAGES } from '@/lib/languages';
import { ApiError, postForm } from '@/services/api';

const countryOptions = COUNTRIES.map((name) => ({ value: name, label: name }));

export function CreatorApplicationForm({ options }: { options: FormOptions }) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreatorFormValues>({
    resolver: zodResolver(creatorSchema),
    defaultValues: creatorDefaults,
    mode: 'onTouched',
  });

  const turnstileRef = useRef<TurnstileInstance | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [token, setToken] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [applicationCode, setApplicationCode] = useState<string | null>(null);

  const resetSpamCheck = () => {
    turnstileRef.current?.reset();
    setToken('');
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0] ?? null;
    setFileError(null);

    if (!picked) {
      setFile(null);
      return;
    }

    const isPdf = picked.type === 'application/pdf' || picked.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setFileError('Please upload a PDF file.');
      setFile(null);
      event.target.value = '';
      return;
    }
    if (picked.size > MAX_MEDIA_KIT_BYTES) {
      setFileError('That file is larger than 10 MB. Please upload a smaller PDF.');
      setFile(null);
      event.target.value = '';
      return;
    }
    setFile(picked);
  };

  const onSubmit: SubmitHandler<CreatorFormValues> = async (values) => {
    setFormError(null);

    if (!token) {
      setFormError('Please complete the spam check below, then submit your application again.');
      return;
    }

    const body = new FormData();
    const { languages, ageConfirmed, consentPrivacy, ...rest } = values;
    for (const [key, value] of Object.entries(rest)) {
      body.append(key, value ?? '');
    }
    for (const language of languages) body.append('languages', language);
    body.append('ageConfirmed', String(ageConfirmed));
    body.append('consentPrivacy', String(consentPrivacy));
    body.append('turnstileToken', token);
    // The file goes last so the server reads all text fields first.
    if (file) body.append('mediaKit', file);

    try {
      const result = await postForm<{ applicationCode: string }>('/api/public/creator-applications', body);
      setApplicationCode(result.applicationCode);
    } catch (error) {
      if (error instanceof ApiError) {
        for (const [field, message] of Object.entries(error.fieldErrors)) {
          if (field in creatorDefaults) {
            setError(field as keyof CreatorFormValues, { type: 'server', message });
          }
        }
        setFormError(error.message);
      } else {
        setFormError('Something went wrong. Please try again.');
      }
      resetSpamCheck();
    }
  };

  if (applicationCode) {
    return (
      <SubmissionSuccess
        title="Thank you. Your application is in."
        message="We have received your application and sent a confirmation to your email. Our team will review it."
        referenceLabel="Your application reference"
        code={applicationCode}
        note="Applying does not guarantee acceptance, paid opportunities, exclusive representation or a management agreement."
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
          label="Email"
          type="email"
          required
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
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
        <SelectField
          label="Country"
          required
          autoComplete="country-name"
          placeholder="Select your country"
          options={countryOptions}
          error={errors.country?.message}
          {...register('country')}
        />
        <TextField
          label="City"
          required
          autoComplete="address-level2"
          error={errors.city?.message}
          {...register('city')}
        />
        <SelectField
          label="Content category"
          required
          placeholder="Select your main category"
          options={options.categories.map((item) => ({ value: item.id, label: item.name }))}
          error={errors.categoryId?.message}
          {...register('categoryId')}
        />
      </div>

      <fieldset className="space-y-5 rounded-2xl border border-[color:var(--line)] bg-page p-5 sm:p-6">
        <legend className="px-2 text-sm font-semibold text-heading">
          Social profiles <span className="font-normal text-body">(add at least one)</span>
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Instagram"
            hint="A link or @handle"
            error={errors.instagram?.message}
            {...register('instagram')}
          />
          <TextField
            label="YouTube"
            hint="A link or @handle, where available"
            error={errors.youtube?.message}
            {...register('youtube')}
          />
          <TextField
            label="TikTok"
            hint="A link or @handle, where available"
            error={errors.tiktok?.message}
            {...register('tiktok')}
          />
        </div>
        <TextAreaField
          label="Other social profiles"
          hint="Any other links, one per line"
          error={errors.otherSocials?.message}
          {...register('otherSocials')}
        />
      </fieldset>

      <TextField
        label="Audience size"
        inputMode="numeric"
        hint="Your approximate total followers or subscribers, as you report it. Numbers are shown publicly only once our team verifies them."
        error={errors.audienceSize?.message}
        {...register('audienceSize')}
      />

      <fieldset>
        <legend className="mb-2 block text-sm font-semibold text-heading">
          Languages <span aria-hidden="true" className="text-highlight">*</span>
        </legend>
        <Controller
          name="languages"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
              {LANGUAGES.map((language) => {
                const checked = field.value.includes(language);
                return (
                  <label
                    key={language}
                    className="flex min-h-[44px] cursor-pointer items-center gap-3 text-[0.9375rem]"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        field.onChange(
                          checked ? field.value.filter((item) => item !== language) : [...field.value, language],
                        )
                      }
                      onBlur={field.onBlur}
                      className="h-5 w-5 shrink-0 cursor-pointer accent-button"
                    />
                    {language}
                  </label>
                );
              })}
            </div>
          )}
        />
        {errors.languages?.message ? (
          <p role="alert" className="mt-1.5 text-sm font-medium text-[#B42318]">
            {errors.languages.message}
          </p>
        ) : null}
      </fieldset>

      <TextAreaField
        label="Biography"
        required
        hint="Tell us about yourself and the content you create."
        error={errors.biography?.message}
        {...register('biography')}
      />

      <TextAreaField
        label="Collaboration interests"
        required
        rows={3}
        hint="What kinds of brand collaborations are you interested in?"
        error={errors.collaborationInterests?.message}
        {...register('collaborationInterests')}
      />

      <FieldShell
        name="mediaKit"
        label="Portfolio / media kit"
        hint="PDF only, up to 10 MB."
        error={fileError ?? undefined}
      >
        <input
          ref={fileInputRef}
          id="field-mediaKit"
          name="mediaKit"
          type="file"
          accept="application/pdf,.pdf"
          onChange={onFileChange}
          aria-invalid={Boolean(fileError)}
          aria-describedby={fileError ? 'field-mediaKit-error' : 'field-mediaKit-hint'}
          className={`${controlClass(Boolean(fileError))} cursor-pointer file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-button file:px-5 file:py-2 file:text-sm file:font-semibold file:text-button-text`}
        />
        {file ? (
          <p className="mt-1.5 text-sm">
            Selected: <span className="font-semibold text-heading">{file.name}</span>
          </p>
        ) : null}
      </FieldShell>

      <Honeypot {...register('hp')} />

      <div className="space-y-4">
        <CheckboxField error={errors.ageConfirmed?.message} {...register('ageConfirmed')}>
          I confirm that I am old enough to enter into agreements and meet the eligibility requirements
          to apply.{' '}
          <span aria-hidden="true" className="text-highlight">
            *
          </span>
        </CheckboxField>

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
          .{' '}
          <span aria-hidden="true" className="text-highlight">
            *
          </span>
        </CheckboxField>
      </div>

      <SpamCheck onToken={setToken} turnstileRef={turnstileRef} />

      {formError ? (
        <div role="alert" className="rounded-xl border border-[#B42318] bg-[#FEF3F2] p-4 text-sm font-medium text-[#B42318]">
          {formError}
        </div>
      ) : null}

      <div role="note" className="flex gap-3 rounded-xl border border-heading/30 bg-page p-4">
        <Info size={20} className="mt-0.5 shrink-0 text-heading" aria-hidden="true" />
        <p className="text-sm font-medium text-heading">
          Applying does not guarantee acceptance, paid opportunities, exclusive representation or a
          management agreement.
        </p>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            Submitting...
          </>
        ) : (
          'Submit application'
        )}
      </Button>
    </form>
  );
}