import { apiFetch } from './api';

export async function useValidateStock(slug: string, quantity: number = 1) {
    return apiFetch<{ status: string; available_stock: number }>('/cart/validate', {
        method: 'POST',
        body: JSON.stringify({ slug, quantity }),
    });
}
