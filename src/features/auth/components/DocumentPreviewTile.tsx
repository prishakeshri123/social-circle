import { useEffect, useState } from 'react';
import { FileText, FileX } from 'lucide-react';
import { en } from '@/shared/constants/locales/en';

interface DocumentPreviewTileProps {
  label: string;
  file: File | null;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const FILENAME_HEAD_CHARS = 18;
const FILENAME_TAIL_CHARS = 8;

// Truncates the middle of a filename rather than the end, so the extension
// (and enough of the start to still recognise the file) stays visible even
// for long, auto-generated names like stock-photo downloads.
function truncateFileName(name: string): string {
  if (name.length <= FILENAME_HEAD_CHARS + FILENAME_TAIL_CHARS + 1) return name;
  const dotIndex = name.lastIndexOf('.');
  const extension = dotIndex > 0 ? name.slice(dotIndex) : '';
  const base = dotIndex > 0 ? name.slice(0, dotIndex) : name;
  const tail = extension || base.slice(-FILENAME_TAIL_CHARS);
  return `${base.slice(0, FILENAME_HEAD_CHARS)}…${extension ? tail : ''}`;
}

// Creates the object URL inside the effect (not useMemo) so it re-runs and
// regenerates on React StrictMode's dev-only mount→cleanup→mount cycle —
// deriving the URL outside the effect and only revoking on cleanup leaves
// the <img> pointing at an already-revoked blob after that cycle.
function useImagePreviewUrl(file: File | null): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file || !file.type.startsWith('image/')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting the object-URL lifecycle state, not deriving from React state
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
}

export function DocumentPreviewTile({ label, file }: DocumentPreviewTileProps) {
  const previewUrl = useImagePreviewUrl(file);

  if (!file) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-border-strong bg-surface/50 p-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface text-text-muted">
          <FileX className="size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-text-primary">{label}</p>
          <p className="text-xs text-text-muted">{en.auth.signupReviewNotProvided}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-raised/60 p-3 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-card-hover">
      {previewUrl ? (
        <img
          src={previewUrl}
          alt=""
          className="size-10 shrink-0 rounded-lg object-cover ring-1 ring-border"
        />
      ) : (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
          <FileText className="size-4" aria-hidden="true" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text-primary">{label}</p>
        <p className="truncate text-xs text-text-muted" title={file.name}>
          {truncateFileName(file.name)} · {formatFileSize(file.size)}
        </p>
      </div>
    </div>
  );
}
