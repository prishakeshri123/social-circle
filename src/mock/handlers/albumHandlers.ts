import type MockAdapter from 'axios-mock-adapter';
import { nanoid } from 'nanoid';
import type { Album, MediaComment, MediaItem } from '@/types/club.types';
import type { PaginatedResponse } from '@/types/api.types';
import { en } from '@/shared/constants/locales/en';
import { PAGE_SIZE_ALBUM, PAGE_SIZE_DEFAULT } from '@/shared/constants/app.constants';
import { userIdFromToken } from '@/mock/handlers/authHandlers';
import seedAlbums from '@/mock/data/albums.json';
import seedMedia from '@/mock/data/mediaItems.json';
import seedComments from '@/mock/data/mediaComments.json';

const e = en.errors;

const albums: Album[] = [...(seedAlbums as Album[])];
const media: MediaItem[] = [...(seedMedia as MediaItem[])];
const comments: MediaComment[] = [...(seedComments as MediaComment[])];

function parseBody<T>(data: unknown): T {
  return (typeof data === 'string' ? JSON.parse(data) : data) as T;
}

function extractUserId(headers: unknown): string | null {
  const authHeader =
    headers && typeof headers === 'object' && 'Authorization' in headers
      ? (headers as Record<string, string>).Authorization
      : undefined;
  const token = authHeader?.replace(/^Bearer\s+/, '');
  return userIdFromToken(token);
}

function paginate<T>(list: T[], page: number, limit: number): PaginatedResponse<T> {
  const total = list.length;
  const start = (page - 1) * limit;
  const data = list.slice(start, start + limit);
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      hasNextPage: start + limit < total,
      hasPreviousPage: page > 1,
    },
  };
}

function handleListAlbums(
  clubId: string,
  params: Record<string, string> | undefined,
): [number, unknown] {
  const filters = params ?? {};
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || PAGE_SIZE_DEFAULT;
  const results = albums.filter((a) => a.clubId === clubId);
  return [200, paginate(results, page, limit)];
}

function handleCreateAlbum(
  clubId: string,
  data: unknown,
  userId: string | null,
): [number, unknown] {
  if (!userId) {
    return [401, { code: 'UNAUTHORIZED', message: e.unauthorized }];
  }
  const patch = parseBody<Partial<Album>>(data);
  const album: Album = {
    id: `alb_${nanoid(10)}`,
    clubId,
    title: patch.title ?? '',
    description: patch.description,
    coverUrl: patch.coverUrl,
    mediaCount: 0,
    visibility: patch.visibility ?? 'members_only',
    allowMemberUploads: patch.allowMemberUploads ?? false,
    createdById: userId ?? '',
    createdAt: new Date().toISOString(),
  };
  albums.push(album);
  return [201, { data: album }];
}

function handleListMedia(
  albumId: string,
  params: Record<string, string> | undefined,
): [number, unknown] {
  const filters = params ?? {};
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || PAGE_SIZE_ALBUM;
  const results = media
    .filter((m) => m.albumId === albumId)
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  return [200, paginate(results, page, limit)];
}

interface UploadItemInput {
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  width?: number;
  height?: number;
  durationSeconds?: number;
}

function handleUploadMedia(
  albumId: string,
  data: unknown,
  userId: string | null,
): [number, unknown] {
  const album = albums.find((a) => a.id === albumId);
  if (!album) {
    return [404, { code: 'NOT_FOUND', message: e.notFound }];
  }
  if (!userId) {
    return [401, { code: 'UNAUTHORIZED', message: e.unauthorized }];
  }

  const { items } = parseBody<{ items: UploadItemInput[] }>(data);
  const now = new Date().toISOString();

  const created: MediaItem[] = items.map((item) => ({
    id: `med_${nanoid(10)}`,
    albumId,
    uploadedById: userId,
    type: item.type,
    url: item.url,
    thumbnailUrl: item.thumbnailUrl ?? item.url,
    caption: item.caption,
    width: item.width,
    height: item.height,
    durationSeconds: item.durationSeconds,
    likeCount: 0,
    commentCount: 0,
    currentUserLiked: false,
    uploadedAt: now,
  }));

  media.push(...created);
  album.mediaCount += created.length;
  if (!album.coverUrl) {
    album.coverUrl = created[0].thumbnailUrl;
  }

  return [201, { data: created }];
}

function handleLike(mediaId: string): [number, unknown] {
  const item = media.find((m) => m.id === mediaId);
  if (!item) {
    return [404, { code: 'NOT_FOUND', message: e.notFound }];
  }
  item.currentUserLiked = !item.currentUserLiked;
  item.likeCount = Math.max(0, item.likeCount + (item.currentUserLiked ? 1 : -1));
  return [200, { data: { likeCount: item.likeCount, liked: item.currentUserLiked } }];
}

function handleDeleteMedia(mediaId: string, userId: string | null): [number, unknown] {
  const index = media.findIndex((m) => m.id === mediaId);
  if (index === -1) {
    return [404, { code: 'NOT_FOUND', message: e.notFound }];
  }
  const item = media[index];
  if (item.uploadedById !== userId) {
    return [403, { code: 'FORBIDDEN', message: e.unauthorized }];
  }
  const album = albums.find((a) => a.id === item.albumId);
  media.splice(index, 1);
  if (album) album.mediaCount = Math.max(0, album.mediaCount - 1);
  return [204, undefined];
}

function handleListComments(mediaId: string): [number, unknown] {
  return [200, { data: comments.filter((c) => c.mediaId === mediaId) }];
}

function handleCreateComment(
  mediaId: string,
  data: unknown,
  userId: string | null,
): [number, unknown] {
  const item = media.find((m) => m.id === mediaId);
  if (!item) {
    return [404, { code: 'NOT_FOUND', message: e.notFound }];
  }
  if (!userId) {
    return [401, { code: 'UNAUTHORIZED', message: e.unauthorized }];
  }
  const { text } = parseBody<{ text: string }>(data);
  const comment: MediaComment = {
    id: `cmt_${nanoid(10)}`,
    mediaId,
    userId,
    text,
    createdAt: new Date().toISOString(),
  };
  comments.push(comment);
  item.commentCount += 1;
  return [201, { data: comment }];
}

export function registerAlbumHandlers(mock: MockAdapter): void {
  mock.onGet(/^\/clubs\/[^/]+\/albums$/).reply((config) => {
    const clubId = config.url?.split('/').slice(-2, -1)[0] ?? '';
    return handleListAlbums(clubId, config.params);
  });

  mock.onPost(/^\/clubs\/[^/]+\/albums$/).reply((config) => {
    const clubId = config.url?.split('/').slice(-2, -1)[0] ?? '';
    return handleCreateAlbum(clubId, config.data, extractUserId(config.headers));
  });

  mock.onGet(/^\/albums\/[^/]+\/media$/).reply((config) => {
    const albumId = config.url?.split('/').slice(-2, -1)[0] ?? '';
    return handleListMedia(albumId, config.params);
  });

  mock.onPost(/^\/albums\/[^/]+\/media$/).reply((config) => {
    const albumId = config.url?.split('/').slice(-2, -1)[0] ?? '';
    return handleUploadMedia(albumId, config.data, extractUserId(config.headers));
  });

  mock.onPost(/^\/media\/[^/]+\/like$/).reply((config) => {
    const mediaId = config.url?.split('/').slice(-2, -1)[0] ?? '';
    return handleLike(mediaId);
  });

  mock.onGet(/^\/media\/[^/]+\/comments$/).reply((config) => {
    const mediaId = config.url?.split('/').slice(-2, -1)[0] ?? '';
    return handleListComments(mediaId);
  });

  mock.onPost(/^\/media\/[^/]+\/comments$/).reply((config) => {
    const mediaId = config.url?.split('/').slice(-2, -1)[0] ?? '';
    return handleCreateComment(mediaId, config.data, extractUserId(config.headers));
  });

  mock.onDelete(/^\/media\/[^/]+$/).reply((config) => {
    const mediaId = config.url?.split('/').pop() ?? '';
    return handleDeleteMedia(mediaId, extractUserId(config.headers));
  });
}
