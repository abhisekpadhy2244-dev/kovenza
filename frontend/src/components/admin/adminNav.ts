import { KeyRound, LayoutDashboard, Users, type LucideIcon } from 'lucide-react';

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Leave out for items every staff member may see. */
  permission?: string;
}

// Only pages that exist are listed. Parts 7C and 7D add Enquiries and Website content.
export const adminNav: AdminNavItem[] = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Creators', href: '/admin/creators', icon: Users, permission: 'creators:read' },
  { label: 'Change password', href: '/admin/change-password', icon: KeyRound },
];

export const roleLabels: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  CAMPAIGN_MANAGER: 'Campaign Manager',
  CONTENT_MANAGER: 'Content Manager',
};