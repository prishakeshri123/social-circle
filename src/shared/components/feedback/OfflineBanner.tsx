import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { en } from '@/shared/constants/locales/en';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(() => !navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-warning-100 px-4 py-2 text-sm text-warning-500">
      <WifiOff className="size-4" aria-hidden="true" />
      {en.errors.networkError}
    </div>
  );
}
