import { Toaster as SonnerToaster, type ToasterProps } from 'sonner';
import { useTheme } from '@/shared/contexts/ThemeContext';

export function Toaster(props: ToasterProps) {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      theme={resolvedTheme}
      position="top-right"
      richColors
      closeButton
      visibleToasts={5}
      toastOptions={{
        classNames: {
          toast: 'rounded-lg border border-border bg-surface-raised text-text-primary shadow-modal',
        },
      }}
      {...props}
    />
  );
}

export { toast } from 'sonner';
