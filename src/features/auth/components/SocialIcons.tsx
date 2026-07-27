interface SocialIconProps {
  className?: string;
}

export function GoogleIcon({ className = 'size-4' }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.95H1.27v3.1A11.998 11.998 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.27a12.01 12.01 0 0 0 0 10.78l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.61l4 3.1C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

export function AppleIcon({ className = 'size-4' }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M16.36 1.43c.09 1.02-.29 2-.9 2.75-.63.76-1.68 1.35-2.7 1.27-.11-1 .33-2.03.93-2.75.65-.78 1.77-1.37 2.67-1.27ZM19.9 17.6c-.5 1.1-.74 1.6-1.38 2.57-.9 1.35-2.16 3.03-3.73 3.05-1.39.02-1.75-.9-3.64-.89-1.88.01-2.28.9-3.67.88-1.57-.02-2.76-1.55-3.66-2.9-2.5-3.75-2.77-8.15-1.22-10.5.99-1.5 2.61-2.4 4.12-2.4 1.5 0 2.44.85 3.68.85 1.2 0 1.94-.85 3.68-.85 1.35 0 2.78.74 3.79 2.02-3.33 1.83-2.79 6.58.03 8.17Z" />
    </svg>
  );
}

export function FacebookIcon({ className = 'size-4' }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07Z"
      />
    </svg>
  );
}
