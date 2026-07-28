import { Toaster as SonnerToaster, type ToasterProps } from 'sonner';

export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      theme="light"
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
