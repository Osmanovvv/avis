const TOKEN_KEY = "avis_admin_token";
const TOKEN_EXPIRY_KEY = "avis_admin_token_expiry";
const TOKEN_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000; // 7 дней

export function login(username: string, password: string): boolean {
  const envPassword = import.meta.env.VITE_ADMIN_PASSWORD || "admin";
  const envUsername = import.meta.env.VITE_ADMIN_USERNAME || "admin";

  if (username === envUsername && password === envPassword) {
    const expiry = Date.now() + TOKEN_LIFETIME_MS;
    const token = btoa(JSON.stringify({ user: username, exp: expiry }));
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, String(expiry));
    return true;
  }
  return false;
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

  if (!token || !expiry) return false;
  if (Date.now() > Number(expiry)) {
    logout();
    return false;
  }
  return true;
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}
