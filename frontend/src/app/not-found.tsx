import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { Logo } from '@/components/layout/Logo';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center bg-page">
      <Container className="py-24 text-center">
        <div className="mb-10">
          <Logo />
        </div>
        <p className="eyebrow mb-4">Error 404</p>
        <h1 className="text-5xl sm:text-6xl">This page could not be found.</h1>
        <p className="mx-auto mt-6 max-w-md text-lg">
          The page may have moved, or the address may be incorrect.
        </p>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/">Back to home</ButtonLink>
        </div>
      </Container>
    </main>
  );
}