export const BASE_URL = import.meta.env.VITE_API_URL;

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'API error');
  }

  return res.json();
}
