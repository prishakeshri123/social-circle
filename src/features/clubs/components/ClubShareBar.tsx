import { Link2 } from 'lucide-react';
import { toast } from '@/shared/components/ui/Toast';
import { en } from '@/shared/constants/locales/en';

interface ClubShareBarProps {
  clubName: string;
  url: string;
}

export function ClubShareBar({ clubName, url }: ClubShareBarProps) {
  function copyLink() {
    navigator.clipboard?.writeText(url).then(() => toast.success(en.success.linkCopied));
  }

  const shareLinks = [
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(`${clubName} — ${url}`)}`,
      className: 'bg-[#25D366] hover:bg-[#1ebe5a]',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12.004 2.003c-5.514 0-9.997 4.483-9.997 9.997 0 1.763.462 3.483 1.34 4.997L2 22l5.13-1.345a9.96 9.96 0 0 0 4.874 1.242h.004c5.514 0 9.997-4.483 9.997-9.997 0-2.67-1.04-5.18-2.928-7.07a9.935 9.935 0 0 0-7.073-2.827zm0 18.174h-.003a8.16 8.16 0 0 1-4.163-1.14l-.299-.177-3.045.799.813-2.968-.194-.305a8.15 8.15 0 0 1-1.253-4.363c0-4.508 3.669-8.176 8.18-8.176a8.13 8.13 0 0 1 5.786 2.397 8.13 8.13 0 0 1 2.393 5.787c0 4.508-3.668 8.176-8.176 8.176z" />
        </svg>
      ),
    },
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(clubName)}&url=${encodeURIComponent(url)}`,
      className: 'bg-black hover:bg-neutral-800',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      className: 'bg-[#0A66C2] hover:bg-[#0958a8]',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.446-2.136 2.94v5.666H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.558V9h3.556v11.452z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-surface p-6">
      <h2 className="text-sm font-semibold text-text-primary">{en.clubLanding.shareTitle}</h2>
      <div className="flex items-center gap-2.5">
        {shareLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${link.label}`}
            className={`flex size-10 items-center justify-center rounded-full text-white transition-colors duration-fast ${link.className}`}
          >
            {link.icon}
          </a>
        ))}
        <button
          type="button"
          onClick={copyLink}
          aria-label={en.actions.copyLink}
          className="flex size-10 items-center justify-center rounded-full bg-surface-raised text-text-secondary transition-colors duration-fast hover:bg-border hover:text-text-primary"
        >
          <Link2 className="size-4" />
        </button>
      </div>
    </div>
  );
}
