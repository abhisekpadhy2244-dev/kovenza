import type { Metadata } from 'next';
import { ProfileEditor } from '@/components/admin/ProfileEditor';

export const metadata: Metadata = { title: 'Creator profile' };

export default async function CreatorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProfileEditor id={id} />;
}