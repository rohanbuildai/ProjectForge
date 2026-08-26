const ICONS = {
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" />
    </>
  ),
  dashboard: (
    <>
      <rect x="3.5" y="3.5" width="7.5" height="9" rx="1.8" />
      <rect x="13" y="3.5" width="7.5" height="5" rx="1.8" />
      <rect x="13" y="11" width="7.5" height="9.5" rx="1.8" />
      <rect x="3.5" y="15" width="7.5" height="5.5" rx="1.8" />
    </>
  ),
  folder: (
    <path d="M3.5 7.5a2 2 0 0 1 2-2h3.6a2 2 0 0 1 1.4.6l1.2 1.2a2 2 0 0 0 1.4.6h5.4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-9.4Z" />
  ),
  task: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="m8.6 12.2 2.4 2.4 4.4-4.8" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M15.5 6a3.2 3.2 0 0 1 0 5.6" />
      <path d="M17.5 14.2A5 5 0 0 1 21 19" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3.5 8.5 4.5L12 12.5 3.5 8 12 3.5Z" />
      <path d="m3.5 12 8.5 4.5 8.5-4.5" />
      <path d="m3.5 16 8.5 4.5 8.5-4.5" />
    </>
  ),
  bell: (
    <>
      <path d="M5.5 9.5a6.5 6.5 0 0 1 13 0c0 4 1.5 5.2 1.5 5.2H4s1.5-1.2 1.5-5.2Z" />
      <path d="M9.5 18a2.6 2.6 0 0 0 5 0" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4.5 4.5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  arrowRight: (
    <>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  chevronDown: <path d="m6 9 6 6 6-6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  message: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-5.5 5v-5a2.5 2.5 0 0 1-.5-5Z" />
      <circle cx="8.4" cy="9.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="9.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="15.6" cy="9.5" r="0.5" fill="currentColor" stroke="none" />
    </>
  ),
  paperclip: (
    <path d="m9 13.5 6-6a3.2 3.2 0 0 1 4.5 4.5l-7.8 7.8a5.2 5.2 0 0 1-7.4-7.4l7.1-7.1a1.8 1.8 0 0 1 2.6 2.6l-7.1 7.1" />
  ),
  file: (
    <>
      <path d="M13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5Z" />
      <path d="M13.5 3v5.5H19" />
      <path d="M9 13h6M9 17h4" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15.5" rx="2" />
      <path d="M4 9.5h16M8.5 3v4M15.5 3v4" />
    </>
  ),
  sparkle: (
    <path d="M12 3.5c.5 3.8 1.6 5 5.5 5.5-3.9.5-5 1.7-5.5 5.5-.5-3.8-1.6-5-5.5-5.5 3.9-.5 5-1.7 5.5-5.5ZM18.5 14c.3 2.3 1 3 3.3 3.3-2.3.3-3 1-3.3 3.3-.3-2.3-1-3-3.3-3.3 2.3-.3 3-1 3.3-3.3Z" />
  ),
  settings: (
    <>
      <path d="M4.5 8.5h4M12 8.5h7.5M4.5 15.5h7.5M16 15.5h3.5" />
      <circle cx="10" cy="8.5" r="2" />
      <circle cx="14.5" cy="15.5" r="2" />
    </>
  ),
  activity: (
    <>
      <path d="M3 12h4l2.5-6 4 12 2.5-6h5" />
    </>
  ),
  lock: (
    <>
      <rect x="5.5" y="11" width="13" height="9" rx="2" />
      <path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.8" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  log: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
      <path d="M8 4.5 6.5 3M16 4.5 17.5 3" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3.2" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M9.9 6.9A9.1 9.1 0 0 1 12 6.9c6 0 9.5 5.1 9.5 5.1a16 16 0 0 1-3 3.4" />
      <path d="M6 7.8A17 17 0 0 0 3 12s3.6 5.3 9 5.3a8.6 8.6 0 0 0 3.5-.8" />
      <path d="M9.3 9.4a3.2 3.2 0 0 0 4.5 4.5" />
      <path d="m3.5 3.5 17 17" />
    </>
  ),
  arrowLeft: (
    <>
      <path d="M20 12H5" />
      <path d="m11 6-6 6 6 6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5 20 6.5a.8.8 0 0 1 .6.8v5.3c0 4.4-3.4 7.7-7.6 9a.8.8 0 0 1 0 0c-5.2-1.3-8.6-4.6-8.6-9V7.3a.8.8 0 0 1 .6-.8l8-3Z" />
      <path d="m9 11.8 2.2 2.2L15.5 9.5" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3.5 22 20H2L12 3.5Z" />
      <path d="M12 10.5V14" />
      <path d="M12 17.2h.01" />
    </>
  ),
  more: (
    <>
      <circle cx="5.5" cy="12" r="1.3" />
      <circle cx="12" cy="12" r="1.3" />
      <circle cx="18.5" cy="12" r="1.3" />
    </>
  ),
};

function Icon({ name, size = 18, className = "", strokeWidth = 1.8 }) {
  return (
    <svg
      className={`pf-icon pf-icon-${name} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name] || ICONS.grid}
    </svg>
  );
}

export default Icon;