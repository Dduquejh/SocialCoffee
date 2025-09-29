import { apiFetch } from './api';

interface CartItem {
  slug: string;
  quantity: number;
}

export async function usePurchase(email: string, items: CartItem[]) {
  return apiFetch<{ purchase_id: number; total: number }>('/purchase', {
    method: 'POST',
    body: JSON.stringify({ email, items }),
  });
}

