import { useEffect, useState, useCallback } from "react";

interface Comment {
    id?: string;
    user_name: string;
    content: string;
    created_at: string;
}

export function useComments(productSlug: string) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

    const fetchComments = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/comments/get?slug=${productSlug}`);
            const data = await res.json();
            setComments(data);
            setError(false);
        } catch (err) {
            setError(true);
            setComments([]);
        } finally {
            setLoading(false);
        }
    }, [API_URL, productSlug]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    return { comments, loading, error, refetch: fetchComments };
}
