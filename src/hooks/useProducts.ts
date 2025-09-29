import { useEffect, useState } from 'react';
import { apiFetch } from './api';
import type { Product } from '../types/Product';

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        apiFetch<Product[]>('/products')
            .then(setProducts)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { products, loading, error };
}
