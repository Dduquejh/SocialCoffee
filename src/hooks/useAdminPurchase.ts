import { useEffect, useState } from 'react';
import { apiFetch } from './api';

interface Purchase {
    email: string;
    id: number;
    user_id: number;
    date: string;
    total: number;
    ordered: boolean;
    shipped: boolean;
    delivered: boolean;
}

export function useAdminPurchases() {
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        apiFetch<Purchase[]>('/admin/purchases')
            .then(setPurchases)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { purchases, loading, error };
}

// Nueva función: marcar como enviado
export async function markAsShipped(purchase_id: number) {
    return apiFetch<{ status: string }>(`/admin/purchases/${purchase_id}`, {
        method: 'POST',
        body: JSON.stringify({ shipped: true }),
    });
}
