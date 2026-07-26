import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';
import { en } from '@/shared/constants/locales/en';
import {
  AVATAR_CROP_MAX_SCALE,
  AVATAR_CROP_MIN_SCALE,
  AVATAR_CROP_OUTPUT_PX,
  AVATAR_CROP_SCALE_STEP,
  AVATAR_CROP_VIEWPORT_PX,
} from '@/shared/constants/app.constants';

function useObjectUrl(file: File | null): string | null {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);
  return url;
}

function clampOffset(next: { x: number; y: number }, currentScale: number) {
  const max = (AVATAR_CROP_VIEWPORT_PX * (currentScale - 1)) / 2;
  return {
    x: Math.max(-max, Math.min(max, next.x)),
    y: Math.max(-max, Math.min(max, next.y)),
  };
}

interface CropCanvasProps {
  imageUrl: string;
  onCancel: () => void;
  onSave: (dataUrl: string) => void;
}

// Keyed by imageUrl from the parent so each new photo mounts a fresh instance
// instead of needing an effect to reset crop state.
function CropCanvas({ imageUrl, onCancel, onSave }: CropCanvasProps) {
  const [scale, setScale] = useState(AVATAR_CROP_MIN_SCALE);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragState = useRef<{
    startX: number;
    startY: number;
    startOffset: { x: number; y: number };
  } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = { startX: event.clientX, startY: event.clientY, startOffset: offset };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragState.current) return;
    const dx = event.clientX - dragState.current.startX;
    const dy = event.clientY - dragState.current.startY;
    setOffset(
      clampOffset(
        { x: dragState.current.startOffset.x + dx, y: dragState.current.startOffset.y + dy },
        scale,
      ),
    );
  }

  function handlePointerUp() {
    dragState.current = null;
  }

  function handleScaleChange(nextScale: number) {
    setScale(nextScale);
    setOffset((current) => clampOffset(current, nextScale));
  }

  function handleSave() {
    const img = imgRef.current;
    if (!img) return;

    const canvas = document.createElement('canvas');
    canvas.width = AVATAR_CROP_OUTPUT_PX;
    canvas.height = AVATAR_CROP_OUTPUT_PX;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const factor = AVATAR_CROP_OUTPUT_PX / AVATAR_CROP_VIEWPORT_PX;
    const naturalRatio = img.naturalWidth / img.naturalHeight;
    const baseW = naturalRatio > 1 ? AVATAR_CROP_OUTPUT_PX * naturalRatio : AVATAR_CROP_OUTPUT_PX;
    const baseH = naturalRatio > 1 ? AVATAR_CROP_OUTPUT_PX : AVATAR_CROP_OUTPUT_PX / naturalRatio;

    ctx.save();
    ctx.translate(
      AVATAR_CROP_OUTPUT_PX / 2 + offset.x * factor,
      AVATAR_CROP_OUTPUT_PX / 2 + offset.y * factor,
    );
    ctx.scale(scale, scale);
    ctx.drawImage(img, -baseW / 2, -baseH / 2, baseW, baseH);
    ctx.restore();

    onSave(canvas.toDataURL('image/jpeg', 0.9));
  }

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <div
          className="relative touch-none select-none overflow-hidden rounded-full border border-border-strong bg-surface"
          style={{ width: AVATAR_CROP_VIEWPORT_PX, height: AVATAR_CROP_VIEWPORT_PX }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <img
            ref={imgRef}
            src={imageUrl}
            alt=""
            draggable={false}
            className="size-full object-cover"
            style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
          />
        </div>

        <div className="flex w-full items-center gap-3">
          <label htmlFor="crop-zoom" className="text-xs text-text-secondary">
            {en.onboarding.cropZoom}
          </label>
          <input
            id="crop-zoom"
            type="range"
            min={AVATAR_CROP_MIN_SCALE}
            max={AVATAR_CROP_MAX_SCALE}
            step={AVATAR_CROP_SCALE_STEP}
            value={scale}
            onChange={(e) => handleScaleChange(Number(e.target.value))}
            className="flex-1"
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          {en.actions.cancel}
        </Button>
        <Button type="button" onClick={handleSave}>
          {en.onboarding.cropSave}
        </Button>
      </DialogFooter>
    </>
  );
}

interface AvatarCropModalProps {
  file: File | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCropped: (dataUrl: string) => void;
}

export function AvatarCropModal({ file, open, onOpenChange, onCropped }: AvatarCropModalProps) {
  const imageUrl = useObjectUrl(file);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{en.onboarding.cropTitle}</DialogTitle>
        </DialogHeader>

        {imageUrl && (
          <CropCanvas
            key={imageUrl}
            imageUrl={imageUrl}
            onCancel={() => onOpenChange(false)}
            onSave={(dataUrl) => {
              onCropped(dataUrl);
              onOpenChange(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
