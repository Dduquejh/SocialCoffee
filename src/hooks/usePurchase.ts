import { apiFetch } from './api';

interface CartItem {
  slug: string;
  quantity: number;
}

export async function usePurchase(email: string, items: CartItem[]) {
  const token = localStorage.getItem("id_token");

  console.log("➡️ Request a /purchase", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, items }),
    });

  return apiFetch<{ purchase_id: number; total: number }>('/purchase', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, items }),
  });
}
