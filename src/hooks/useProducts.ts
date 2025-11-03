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

    console.log("🛍️ Productos cargados:", products);
    return { products, loading, error };
}

export async function getStockAndProcess() {
    try {
        const data = await apiFetch<{ id: number; slug: string; name: string; stock: number; process: string }[]>('/products/info');
        console.log("📦 Stock y procesos:", data);
        return data;
    } catch (error) {
        console.error("❌ Error al obtener stock y process:", error);
        throw error;
    }
}