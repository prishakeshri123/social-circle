import { useRef, type ChangeEvent } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { toast } from '@/shared/components/ui/Toast';
import { en } from '@/shared/constants/locales/en';
import { ALLOWED_IMAGE_TYPES, MAX_COVER_PHOTO_SIZE_MB } from '@/shared/constants/app.constants';
import { cn } from '@/shared/utils/cn';

interface CoverPhotoUploadFieldProps {
  value: string;
  onChange: (dataUrl: string) => void;
}

export function CoverPhotoUploadField({ value, onChange }: CoverPhotoUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
      toast.error(en.errors.fileTypeInvalid);
      return;
    }
    if (file.size > MAX_COVER_PHOTO_SIZE_MB * 1024 * 1024) {
      toast.error(en.errors.fileTooLarge(`${MAX_COVER_PHOTO_SIZE_MB} MB`));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label={en.labels.coverPhoto}
        className={cn(
          'group relative flex h-32 w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-cover bg-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 sm:h-40',
          !value && 'gradient-bg',
        )}
        style={value ? { backgroundImage: `url(${value})` } : undefined}
      >
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity duration-fast group-hover:bg-black/40 group-hover:opacity-100">
          <Camera className="size-6 text-white" />
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        className="hidden"
        onChange={handleFileSelect}
      />

      <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
        {value ? en.profile.changeCoverCta : en.profile.uploadCoverCta}
      </Button>
    </div>
  );
}
