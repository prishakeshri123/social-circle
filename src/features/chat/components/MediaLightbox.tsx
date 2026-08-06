import { Dialog, DialogContent, DialogTitle } from '@/shared/components/ui/Dialog';
import { en } from '@/shared/constants/locales/en';

interface MediaLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaUrl?: string;
  mediaType: 'image' | 'video';
}

export function MediaLightbox({ open, onOpenChange, mediaUrl, mediaType }: MediaLightboxProps) {
  if (!mediaUrl) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{en.chat.mediaPreview}</DialogTitle>
        {mediaType === 'image' ? (
          <img src={mediaUrl} alt="" className="max-h-[85vh] w-full rounded-lg object-contain" />
        ) : (
          <video src={mediaUrl} controls autoPlay className="max-h-[85vh] w-full rounded-lg" />
        )}
      </DialogContent>
    </Dialog>
  );
}
