import { en } from '@/shared/constants/locales/en';
import { GALLERY_PREVIEW_COUNT } from '@/shared/constants/app.constants';

interface ClubGalleryPreviewProps {
  images: string[];
}

export function ClubGalleryPreview({ images }: ClubGalleryPreviewProps) {
  if (images.length === 0) return null;

  const preview = images.slice(0, GALLERY_PREVIEW_COUNT);

  return (
    <section
      aria-labelledby="club-gallery-heading"
      className="space-y-3 rounded-2xl border border-border bg-surface p-6"
    >
      <div className="flex items-center justify-between">
        <h2 id="club-gallery-heading" className="text-lg font-semibold text-text-primary">
          {en.clubLanding.galleryTitle}
        </h2>
        {images.length > GALLERY_PREVIEW_COUNT && (
          <button type="button" className="text-sm font-medium text-primary-600 hover:underline">
            {en.clubLanding.viewAllPhotos}
          </button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
        {preview.map((url, index) => (
          <div
            key={url}
            className="aspect-square overflow-hidden rounded-xl bg-surface-raised transition-transform duration-normal hover:-translate-y-0.5"
          >
            <img src={url} alt={`Gallery photo ${index + 1}`} className="size-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
