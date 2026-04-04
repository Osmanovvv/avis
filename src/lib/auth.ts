import { api } from "./api";

const TOKEN_KEY = "avis_admin_token";
const TOKEN_EXPIRY_KEY = "avis_admin_token_expiry";
const IS_MOCK = !import.meta.env.VITE_API_URL;

export async function login(username: string, password: string): Promise<boolean> {
  try {
    if (IS_MOCK) {
      const validUser = username === (import.meta.env.VITE_ADMIN_USERNAME || "admin");
      const validPass = password === (import.meta.env.VITE_ADMIN_PASSWORD || "admin");
      if (!validUser || !validPass) return false;
      const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem(TOKEN_KEY, "mock_token");
      localStorage.setItem(TOKEN_EXPIRY_KEY, String(expiry));
      return true;
    }
    const { token } = await api.login(username, password);
    const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, String(expiry));
    return true;
  } catch {
    return false;
  }
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
