import type MockAdapter from 'axios-mock-adapter';
import { nanoid } from 'nanoid';
import type { Club, SavedClub } from '@/types/club.types';
import { en } from '@/shared/constants/locales/en';
import { userIdFromToken } from '@/mock/handlers/authHandlers';
import seedSavedClubs from '@/mock/data/savedClubs.json';
import seedClubs from '@/mock/data/clubs.json';

interface SavedClubRecord {
  id: string;
  clubId: string;
  userId: string;
  savedAt: string;
}

const e = en.errors;

const savedClubRecords: SavedClubRecord[] = [...(seedSavedClubs as SavedClubRecord[])];
const clubs: Club[] = seedClubs as Club[];

function extractUserId(headers: unknown): string | null {
  const authHeader =
    headers && typeof headers === 'object' && 'Authorization' in headers
      ? (headers as Record<string, string>).Authorization
      : undefined;
  const token = authHeader?.replace(/^Bearer\s+/, '');
  return userIdFromToken(token);
}

function withClub(record: SavedClubRecord): SavedClub | null {
  const club = clubs.find((c) => c.id === record.clubId);
  if (!club) return null;
  return { ...club, savedAt: record.savedAt };
}

function handleList(userId: string | null): [number, unknown] {
  if (!userId) return [200, { data: [] }];
  const data = savedClubRecords
    .filter((r) => r.userId === userId)
    .map(withClub)
    .filter((c): c is SavedClub => c !== null)
    .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
  return [200, { data }];
}

function handleSave(clubId: string, userId: string | null): [number, unknown] {
  if (!userId) return [401, { code: 'UNAUTHORIZED', message: e.unauthorized }];
  const club = clubs.find((c) => c.id === clubId);
  if (!club) return [404, { code: 'NOT_FOUND', message: e.notFound }];

  const existing = savedClubRecords.find((r) => r.clubId === clubId && r.userId === userId);
  if (existing) {
    return [200, { data: { ...club, savedAt: existing.savedAt } }];
  }

  const record: SavedClubRecord = {
    id: `svd_${nanoid(10)}`,
    clubId,
    userId,
    savedAt: new Date().toISOString(),
  };
  savedClubRecords.push(record);
  return [200, { data: { ...club, savedAt: record.savedAt } }];
}

function handleUnsave(clubId: string, userId: string | null): [number, unknown] {
  if (!userId) return [401, { code: 'UNAUTHORIZED', message: e.unauthorized }];
  const index = savedClubRecords.findIndex((r) => r.clubId === clubId && r.userId === userId);
  if (index === -1) return [404, { code: 'NOT_FOUND', message: e.notFound }];

  savedClubRecords.splice(index, 1);
  return [204, undefined];
}

export function registerSavedClubHandlers(mock: MockAdapter): void {
  mock.onGet('/me/saved-clubs').reply((config) => handleList(extractUserId(config.headers)));

  mock.onPost(/^\/me\/saved-clubs\/[^/]+$/).reply((config) => {
    const clubId = config.url?.split('/').pop() ?? '';
    return handleSave(clubId, extractUserId(config.headers));
  });

  mock.onDelete(/^\/me\/saved-clubs\/[^/]+$/).reply((config) => {
    const clubId = config.url?.split('/').pop() ?? '';
    return handleUnsave(clubId, extractUserId(config.headers));
  });
}
