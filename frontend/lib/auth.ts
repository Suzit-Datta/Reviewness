export type AuthData = {
  accessToken: string;
  role: string;
  id: number;
};

export function saveAuth(data: AuthData) {
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('role', data.role);
  localStorage.setItem('userId', String(data.id));
}

export function clearAuth() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
}

export function getAuth(): AuthData | null {
  if (typeof window === 'undefined') return null;
  const accessToken = localStorage.getItem('accessToken');
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');
  if (!accessToken || !role || !userId) return null;
  return { accessToken, role, id: Number(userId) };
}

export function getRole(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('role');
}

export function getUserId(): number | null {
  if (typeof window === "undefined") {
    return null;
  }
  const userId = localStorage.getItem("userId");
  if (!userId) {
    return null;
  }
  return Number(userId);
}

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('accessToken');
}

export function getUserId(): number | null {
  if (typeof window === 'undefined') return null;
  const id = localStorage.getItem('userId');
  return id ? Number(id) : null;
}