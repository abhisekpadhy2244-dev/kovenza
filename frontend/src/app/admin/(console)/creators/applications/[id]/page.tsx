import type { Metadata } from 'next';
import { ApplicationDetail } from '@/components/admin/ApplicationDetail';

export const metadata: Metadata = { title: 'Application' };

export default async function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ApplicationDetail id={id} />;
}