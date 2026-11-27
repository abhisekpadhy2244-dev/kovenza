import type { Metadata } from 'next';
import { ProfilesList } from '@/components/admin/ProfilesList';

export const metadata: Metadata = { title: 'Creator profiles' };

export default function CreatorProfilesPage() {
  return <ProfilesList />;
}