export interface Event {
  id: string;
  clubId: string;
  creatorId: string;
  type: 'event' | 'meeting';
  title: string;
  description: string;
  coverImageUrl?: string;
  startAt: string;
  endAt?: string;
  timezone: string;
  recurrence: 'one_time' | 'weekly' | 'monthly';
  locationType: 'physical' | 'virtual';
  physicalAddress?: string;
  mapLat?: number;
  mapLng?: number;
  virtualLink?: string;
  capacity?: number;
  rsvpDeadline?: string;
  ticketType: 'free' | 'paid';
  ticketPrice?: number;
  ticketQuantity?: number;
  ticketsSold?: number;
  visibility: 'all_members' | 'invite_only' | 'public';
  status: 'draft' | 'published' | 'cancelled' | 'concluded';
  rsvpCounts: { going: number; interested: number; not_going: number };
  currentUserRsvp?: 'going' | 'interested' | 'not_going' | null;
  albumId?: string;
  createdAt: string;
  updatedAt: string;
}

export type RsvpStatus = 'going' | 'interested' | 'not_going';

export interface EventClubSummary {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string;
}

export interface EventWithClub extends Event {
  club: EventClubSummary;
}
