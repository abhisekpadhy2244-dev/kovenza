import { siteConfig } from '@/lib/site';

export function FormUnavailable() {
  return (
    <div role="alert" className="py-4">
      <h2 className="text-2xl">This form is temporarily unavailable.</h2>
      <p className="mt-3 leading-relaxed">
        We could not load the form just now. Please refresh the page in a moment
        {siteConfig.email ? (
          <>
            , or email us at{' '}
            <a href={`mailto:${siteConfig.email}`} className="text-heading underline underline-offset-4 hover:text-highlight">
              {siteConfig.email}
            </a>
          </>
        ) : null}
        .
      </p>
    </div>
  );
}