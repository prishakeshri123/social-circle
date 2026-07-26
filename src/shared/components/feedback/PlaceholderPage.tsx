interface PlaceholderPageProps {
  title: string;
}

// Temporary stand-in for pages not yet built in the current phase.
export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-8">
      <p className="text-sm text-text-muted">{title}</p>
    </div>
  );
}
