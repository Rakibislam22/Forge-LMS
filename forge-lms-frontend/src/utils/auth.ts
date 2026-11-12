/**
 * Admin Authentication Utilities
 * Manages JWT tokens in both localStorage and cookies for seamless Next.js route protection.
 */

export function setAdminSession(token: string, admin: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("forge_admin_token", token);
    localStorage.setItem("forge_admin_user", JSON.stringify(admin));
    document.cookie = `forge_admin_token=${token}; path=/; max-age=28800; SameSite=Lax`;
    window.dispatchEvent(new Event("storage"));
  } catch {
    // Ignore
  }
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("forge_admin_token");
    localStorage.removeItem("forge_admin_user");
    document.cookie = "forge_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.dispatchEvent(new Event("storage"));
  } catch {
    // Ignore
  }
}

export function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem("forge_admin_token") || "";
  } catch {
    return "";
  }
}
