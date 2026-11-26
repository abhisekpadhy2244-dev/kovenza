'use client';

import { useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';

interface SubmissionSuccessProps {
  title: string;
  message: string;
  referenceLabel: string;
  code: string;
  note?: string;
}

export function SubmissionSuccess({ title, message, referenceLabel, code, note }: SubmissionSuccessProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
    ref.current?.scrollIntoView({ block: 'center' });
  }, []);

  return (
    <div ref={ref} tabIndex={-1} role="status" className="py-6 text-center focus:outline-none">
      <CheckCircle2 size={48} className="mx-auto text-highlight" aria-hidden="true" />
      <h2 className="mt-6 text-3xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-md leading-relaxed">{message}</p>
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-heading">{referenceLabel}</p>
      <p className="mt-1 font-serif text-2xl text-heading">{code}</p>
      {note ? <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed">{note}</p> : null}
      <div className="mt-8 flex justify-center">
        <ButtonLink href="/" variant="secondary">
          Back to home
        </ButtonLink>
      </div>
    </div>
  );
}