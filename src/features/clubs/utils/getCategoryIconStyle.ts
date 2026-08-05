import type { LucideIcon } from 'lucide-react';
import { CATEGORIES } from '@/shared/constants/categories';
import { getIcon } from '@/shared/utils/iconRegistry';

// Cycled by each category's position in CATEGORIES so every club gets a
// stable, visually distinct accent colour on its "My Clubs" grid icon.
const ACCENT_CLASSES = [
  'bg-primary-600',
  'bg-success-500',
  'bg-info-500',
  'bg-warning-500',
  'bg-error-500',
  'bg-accent-500',
] as const;

export function getCategoryIconStyle(category: string): { icon: LucideIcon; className: string } {
  const index = CATEGORIES.findIndex((c) => c.slug === category);
  const safeIndex = index === -1 ? 0 : index;
  return {
    icon: getIcon(CATEGORIES[safeIndex]?.icon),
    className: ACCENT_CLASSES[safeIndex % ACCENT_CLASSES.length],
  };
}
