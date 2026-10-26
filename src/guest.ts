export const PREFIXES = ['Mr.', 'Mrs.', 'Miss', 'Mr. & Mrs.', 'Family', 'Dear'] as const;
export type Prefix = (typeof PREFIXES)[number];

// Combines prefix + name into the name shown to the guest.
// "Dear" is a greeting style, not a title, so it is dropped here (the message adds "Dear" itself).
export function buildDisplayName(prefix: Prefix, name: string): string {
  const n = name.trim().replace(/\s+/g, ' ');
  if (!n) return '';
  switch (prefix) {
    case 'Family':
      return `${n} and Family`;
    case 'Dear':
      return n;
    default:
      return `${prefix} ${n}`;
  }
}

export function buildInviteLink(baseUrl: string, displayName: string): string {
  return `${baseUrl.replace(/\/+$/, '')}/${encodeURIComponent(displayName)}`;
}

// Reads the guest display name from the URL: /{guestName}, or legacy ?prefix=&name=.
export function getGuestName(): string {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (path && path.toLowerCase() !== 'admin') {
    try {
      return decodeURIComponent(path).trim();
    } catch {
      return path.trim();
    }
  }
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name')?.trim();
  if (!name) return '';
  const prefix = params.get('prefix')?.trim();
  return prefix ? `${prefix} ${name}` : name;
}
