export const ACCESS_TOKEN_KEY = "token";

export function clearAccessTokenCookie(): void {
  if (typeof window === "undefined") return;

  document.cookie = `${ACCESS_TOKEN_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
}