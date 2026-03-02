export interface DecodedToken {
  sub: string;
  email?: string;
  role?: string;
  roles?: string[];
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

function decodeBase64(base64Value: string): string {
  if (typeof atob === "function") {
    return atob(base64Value);
  }

  if (typeof Buffer !== "undefined") {
    return Buffer.from(base64Value, "base64").toString("utf-8");
  }

  throw new Error("No base64 decoder available in this runtime.");
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padding = base64.length % 4;
    const padded = padding ? base64 + "=".repeat(4 - padding) : base64;

    const decoded = decodeBase64(padded);
    return JSON.parse(decoded) as DecodedToken;
  } catch {
    return null;
  }
}

export function getUserRoleFromDecodedToken(
  token: DecodedToken | null,
): string | null {
  if (!token) return null;
  if (token.role) return token.role;

  if (Array.isArray(token.roles) && token.roles.length > 0) {
    return token.roles[0];
  }

  return null;
}

export function getUserRoleFromToken(token: string): string | null {
  return getUserRoleFromDecodedToken(decodeToken(token));
}
