import { useRef, type ChangeEvent } from 'react';
import { FileCheck2, Upload } from 'lucide-react';
import { en } from '@/shared/constants/locales/en';
import { ALLOWED_DOCUMENT_TYPES, MAX_DOC_SIZE_MB } from '@/shared/constants/app.constants';
import { Button } from '@/shared/components/ui/Button';
import { Label } from '@/shared/components/ui/Label';
import { toast } from '@/shared/components/ui/Toast';
import { cn } from '@/shared/utils/cn';

interface DocumentUploadFieldProps {
  id: string;
  label: string;
  required?: boolean;
  file: File | null;
  onChange: (file: File) => void;
  disabled?: boolean;
  error?: string;
}

export function DocumentUploadField({
  id,
  label,
  required,
  file,
  onChange,
  disabled,
  error,
}: DocumentUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    event.target.value = '';
    if (!selected) return;

    if (
      !ALLOWED_DOCUMENT_TYPES.includes(selected.type as (typeof ALLOWED_DOCUMENT_TYPES)[number])
    ) {
      toast.error(en.errors.documentTypeInvalid);
      return;
    }
    if (selected.size > MAX_DOC_SIZE_MB * 1024 * 1024) {
      toast.error(en.errors.fileTooLarge(`${MAX_DOC_SIZE_MB} MB`));
      return;
    }

    onChange(selected);
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm">
        {label}
        {required && <span className="text-error-500"> *</span>}
      </Label>
      <div
        className={cn(
          'flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors duration-200',
          file ? 'border-primary-500/40 bg-primary-500/5' : 'border-border-strong bg-background',
        )}
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="shrink-0 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.96]"
        >
          <Upload className="size-3.5" aria-hidden="true" />
          {en.auth.signupChooseFile}
        </Button>
        <span className="flex min-w-0 items-center gap-1.5 text-sm text-text-secondary">
          {file && <FileCheck2 className="size-4 shrink-0 text-success-500" aria-hidden="true" />}
          <span className="truncate">{file ? file.name : en.auth.signupNoFileChosen}</span>
        </span>
      </div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ALLOWED_DOCUMENT_TYPES.join(',')}
        className="hidden"
        disabled={disabled}
        onChange={handleFileSelect}
      />
      {error && <p className="text-xs text-error-500">{error}</p>}
    </div>
  );
}
