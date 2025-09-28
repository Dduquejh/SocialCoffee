import { useState } from "react";

export function usePostComment(productSlug: string) {
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const postComment = async (content: string) => {
    const token = localStorage.getItem("id_token");

    console.debug("[postComment] Iniciando petición...");
    console.debug("[postComment] URL:", `${API_URL}/comments/post`);
    console.debug("[postComment] Payload:", { slug: productSlug, content });
    console.debug("[postComment] Token:", token);

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/comments/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slug: productSlug, content }),
      });
      console.log("[postComment] Payload:", { slug: productSlug, content });
      console.log("[postComment] Topken:", token);
      console.debug("[postComment] Status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("[postComment] Error:", errorText);
        throw new Error("Error al publicar comentario");
      }

      const data = await res.json();
      console.debug("[postComment] Respuesta:", data);
      return data;
    } catch (err) {
      console.error("[postComment] Excepción:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { postComment, loading, setLoading };
}
