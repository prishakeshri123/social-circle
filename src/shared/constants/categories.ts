export const CATEGORIES = [
  { slug: 'sports', label: 'Sports', icon: 'Dumbbell' },
  { slug: 'music', label: 'Music', icon: 'Music' },
  { slug: 'tech', label: 'Tech', icon: 'Cpu' },
  { slug: 'gaming', label: 'Gaming', icon: 'Gamepad2' },
  { slug: 'travel', label: 'Travel', icon: 'Plane' },
  { slug: 'food', label: 'Food & Dining', icon: 'UtensilsCrossed' },
  { slug: 'arts', label: 'Arts & Crafts', icon: 'Palette' },
  { slug: 'photography', label: 'Photography', icon: 'Camera' },
  { slug: 'books', label: 'Books', icon: 'BookOpen' },
  { slug: 'alumni', label: 'Alumni', icon: 'GraduationCap' },
  { slug: 'professional', label: 'Professional', icon: 'Briefcase' },
  { slug: 'ngo', label: 'NGO / Cause', icon: 'Heart' },
  { slug: 'outdoors', label: 'Outdoors', icon: 'Mountain' },
  { slug: 'fitness', label: 'Fitness', icon: 'Activity' },
  { slug: 'films', label: 'Films', icon: 'Film' },
  { slug: 'social', label: 'Social', icon: 'Users' },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];
