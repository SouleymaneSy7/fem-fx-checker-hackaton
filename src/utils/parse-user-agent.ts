type ParsedUserAgentType = {
  browser: string;
  os: string;
};

// Order matters: Edge and Opera's UA strings also contain "Chrome" and
// "Safari", so the more specific browsers must be checked first.
const BROWSER_PATTERNS: { pattern: RegExp; name: string }[] = [
  { pattern: /edg\//i, name: "Edge" },
  { pattern: /opr\/|opera/i, name: "Opera" },
  { pattern: /chrome|crios/i, name: "Chrome" },
  { pattern: /firefox|fxios/i, name: "Firefox" },
  { pattern: /safari/i, name: "Safari" },
];

// Same reasoning — iPhone/iPad must be checked before macOS, since iPadOS
// Safari can report a "Macintosh"-like token in its default desktop-site
// mode.
const OS_PATTERNS: { pattern: RegExp; name: string }[] = [
  { pattern: /iphone|ipad|ipod/i, name: "iOS" },
  { pattern: /android/i, name: "Android" },
  { pattern: /mac os x|macintosh/i, name: "macOS" },
  { pattern: /windows/i, name: "Windows" },
  { pattern: /linux/i, name: "Linux" },
];

function matchFirst(
  userAgent: string,
  patterns: { pattern: RegExp; name: string }[],
): string {
  return (
    patterns.find(({ pattern }) => pattern.test(userAgent))?.name ?? "Unknown"
  );
}

export function parseUserAgent(
  userAgent: string | null | undefined,
): ParsedUserAgentType {
  if (!userAgent) return { browser: "Unknown", os: "Unknown" };

  return {
    browser: matchFirst(userAgent, BROWSER_PATTERNS),
    os: matchFirst(userAgent, OS_PATTERNS),
  };
}
