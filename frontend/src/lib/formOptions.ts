export interface Option {
  id: string;
  slug: string;
  name: string;
}

export interface FormOptions {
  services: Option[];
  industries: Option[];
  categories: Option[];
  budgetRanges: string[];
  timelines: string[];
}

/** Server-side only. Returns null if the backend cannot be reached. */
export async function getFormOptions(): Promise<FormOptions | null> {
  const base = (process.env.BACKEND_URL || 'http://localhost:4000').replace(/\/$/, '');
  try {
    const response = await fetch(`${base}/api/public/form-options`, { next: { revalidate: 60 } });
    if (!response.ok) return null;
    return (await response.json()) as FormOptions;
  } catch {
    return null;
  }
}