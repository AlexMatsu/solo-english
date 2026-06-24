// Ícones SVG inline (sem dependência externa).
// Os ícones de traço usam currentColor, então herdam cor + drop-shadow/glow
// de quem os contém. Ícones de marca (Google/Discord) têm cor própria.

type IconProps = React.SVGProps<SVGSVGElement>;

const strokeBase = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function IconUser(props: IconProps) {
  return (
    <svg {...strokeBase} {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function IconMail(props: IconProps) {
  return (
    <svg {...strokeBase} {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 6 10 7 10-7" />
    </svg>
  );
}

export function IconLock(props: IconProps) {
  return (
    <svg {...strokeBase} {...props}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="16" r="1" />
    </svg>
  );
}

export function IconSword(props: IconProps) {
  return (
    <svg {...strokeBase} {...props}>
      <path d="M14.5 17.5 3 6V3h3l11.5 11.5" />
      <path d="m13 19 6-6" />
      <path d="m16 16 4 4" />
      <path d="m19 21 2-2" />
    </svg>
  );
}

export function IconTrophy(props: IconProps) {
  return (
    <svg {...strokeBase} {...props}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

export function IconBot(props: IconProps) {
  return (
    <svg {...strokeBase} {...props}>
      <path d="M12 8V4" />
      <circle cx="12" cy="3" r="1" />
      <rect x="4" y="8" width="16" height="12" rx="2" />
      <path d="M2 14h2M20 14h2" />
      <circle cx="9" cy="14" r="1" />
      <circle cx="15" cy="14" r="1" />
    </svg>
  );
}

export function IconShield(props: IconProps) {
  return (
    <svg {...strokeBase} {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function IconGoogle(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

export function IconDiscord(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="#5865F2" aria-hidden {...props}>
      <path d="M20.32 4.37A19.8 19.8 0 0 0 15.45 3l-.24.5a18.3 18.3 0 0 1 4.31 1.36 16.6 16.6 0 0 0-2.6-1.1 13.4 13.4 0 0 0-4.84-.42c-.16 0-.32 0-.48.02-1.7.11-3.34.5-4.86 1.1A18.5 18.5 0 0 1 8.55 3.5L8.31 3a19.8 19.8 0 0 0-4.87 1.37C1.06 8.06.46 11.65.66 15.18a19.9 19.9 0 0 0 6.04 3.05l.48-.66a11.6 11.6 0 0 1-1.86-.89l.45-.34c1.7.79 3.56 1.2 5.43 1.2 1.87 0 3.73-.41 5.43-1.2l.45.34c-.6.36-1.22.65-1.86.9l.48.65a19.8 19.8 0 0 0 6.04-3.05c.24-4.07-.71-7.62-2.89-10.81ZM8.5 13.43c-1.18 0-2.15-1.08-2.15-2.41 0-1.33.95-2.42 2.15-2.42 1.2 0 2.17 1.1 2.15 2.42 0 1.33-.95 2.41-2.15 2.41Zm7 0c-1.18 0-2.15-1.08-2.15-2.41 0-1.33.95-2.42 2.15-2.42 1.2 0 2.17 1.1 2.15 2.42 0 1.33-.94 2.41-2.15 2.41Z" />
    </svg>
  );
}
