// Clubs are created/onboarded via the separate Admin Dashboard, so they
// always arrive into this app's data already-live.
export type ClubStatus = 'live' | 'suspended' | 'archived';

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: 'one_time' | 'monthly' | 'quarterly' | 'yearly';
  trialDays?: number;
  description?: string;
}

export interface Club {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  category: string;
  tags: string[];
  city?: string;
  language: string;
  privacy: 'public' | 'private' | 'invite_only';
  status: ClubStatus;
  type: 'free' | 'paid';
  ownerId: string;
  memberCount: number;
  logoUrl?: string;
  bannerUrl?: string;
  brandColor?: string;
  galleryImages: string[];
  introVideoUrl?: string;
  about?: string;
  mission?: string;
  codeOfConduct?: string;
  highlights: string[];
  faqs: { question: string; answer: string }[];
  pricingPlans?: PricingPlan[];
  membershipApproval: 'auto' | 'manual';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClubMembership {
  id: string;
  clubId: string;
  userId: string;
  // Only used to decide whether to show the Edit/Cancel Event actions.
  role: 'owner' | 'member';
  status: 'active' | 'pending_approval' | 'suspended' | 'cancelled';
  joinedAt: string;
  subscriptionId?: string;
  expiresAt?: string;
}

export interface MyClub extends Club {
  myRole: ClubMembership['role'];
}

export interface Album {
  id: string;
  clubId: string;
  eventId?: string;
  title: string;
  description?: string;
  coverUrl?: string;
  mediaCount: number;
  visibility: 'members_only' | 'public';
  allowMemberUploads: boolean;
  createdById: string;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  albumId: string;
  uploadedById: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl: string;
  caption?: string;
  width?: number;
  height?: number;
  durationSeconds?: number;
  likeCount: number;
  commentCount: number;
  currentUserLiked: boolean;
  uploadedAt: string;
}

export interface MediaComment {
  id: string;
  mediaId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface ClubFilters {
  category?: string;
  type?: 'free' | 'paid';
  city?: string;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
