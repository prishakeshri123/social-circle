import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';
import { cn } from '@/shared/utils/cn';

export const Drawer = DrawerPrimitive.Root;
export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerPortal = DrawerPrimitive.Portal;
export const DrawerClose = DrawerPrimitive.Close;

export const DrawerOverlay = forwardRef<
  ElementRef<typeof DrawerPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-overlay bg-black/50', className)}
    {...props}
  />
));
DrawerOverlay.displayName = 'DrawerOverlay';

export const DrawerContent = forwardRef<
  ElementRef<typeof DrawerPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        'fixed inset-x-0 bottom-0 z-modal flex h-auto max-h-[85vh] flex-col rounded-t-2xl border-t border-border bg-surface-raised',
        className,
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-1.5 w-12 shrink-0 rounded-full bg-border-strong" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = 'DrawerContent';

export function DrawerHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5 p-4 text-left', className)} {...props} />;
}

export function DrawerFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />;
}

export const DrawerTitle = forwardRef<
  ElementRef<typeof DrawerPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title ref={ref} className={cn('text-lg font-semibold', className)} {...props} />
));
DrawerTitle.displayName = 'DrawerTitle';

export const DrawerDescription = forwardRef<
  ElementRef<typeof DrawerPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn('text-sm text-text-secondary', className)}
    {...props}
  />
));
DrawerDescription.displayName = 'DrawerDescription';
