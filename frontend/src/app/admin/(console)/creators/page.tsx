import type { Metadata } from 'next';
import { ApplicationsList } from '@/components/admin/ApplicationsList';

export const metadata: Metadata = { title: 'Creator applications' };

export default function CreatorApplicationsPage() {
  return <ApplicationsList />;
}