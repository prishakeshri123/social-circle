import { useRef, useState, type ChangeEvent } from 'react';
import { Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/Avatar';
import { Button } from '@/shared/components/ui/Button';
import { toast } from '@/shared/components/ui/Toast';
import { en } from '@/shared/constants/locales/en';
import { ALLOWED_IMAGE_TYPES, MAX_AVATAR_SIZE_MB } from '@/shared/constants/app.constants';
import { AvatarCropModal } from '@/features/onboarding/components/AvatarCropModal';

interface AvatarUploadFieldProps {
  value: string;
  fullNameForFallback: string;
  onChange: (dataUrl: string) => void;
}

export function AvatarUploadField({
  value,
  fullNameForFallback,
  onChange,
}: AvatarUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropOpen, setCropOpen] = useState(false);

  function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
      toast.error(en.errors.fileTypeInvalid);
      return;
    }
    if (file.size > MAX_AVATAR_SIZE_MB * 1024 * 1024) {
      toast.error(en.errors.fileTooLarge(`${MAX_AVATAR_SIZE_MB} MB`));
      return;
    }

    setCropFile(file);
    setCropOpen(true);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label={en.onboarding.uploadPhotoLabel}
        className="group relative rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <Avatar className="size-24">
          <AvatarImage src={value || undefined} alt="" />
          <AvatarFallback className="text-2xl">
            {fullNameForFallback.charAt(0).toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity duration-fast group-hover:opacity-100">
          <Camera className="size-5 text-white" />
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
        {value ? en.onboarding.changePhotoCta : en.onboarding.uploadPhotoCta}
      </Button>

      <AvatarCropModal
        file={cropFile}
        open={cropOpen}
        onOpenChange={setCropOpen}
        onCropped={onChange}
      />
    </div>
  );
}
