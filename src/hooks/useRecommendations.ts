// hooks/useRecommendations.ts
import { useState, useEffect } from "react";
import { apiFetch } from "./api";
import type { Product } from "../types/Product";
import { client } from "../lib/contentfulClient";

async function fetchProductsBySlugs(slugs: string[]): Promise<Product[]> {
  if (slugs.length === 0) return [];

  const response = await client.getEntries({
    content_type: "productModelSocialCoffee",
    "fields.productSlug[in]": slugs.join(","),
    include: 2,
  });

  return response.items.map((entry: any) => ({
    productName: entry.fields?.productName || "",
    productDescription: entry.fields?.productDescription || "",
    productImage: Array.isArray(entry.fields?.productImage)
      ? entry.fields.productImage
      : [],
    productPrice: entry.fields?.productPrice || 0,
    productIsActive:
      entry.fields?.productIsActive === true ||
      entry.fields?.productIsActive === "true",
    productSlug: entry.fields?.productSlug || "",
    productType: entry.fields?.productType || "",
    productSize: entry.fields?.productSize || "",
  }));
}

export function useRecommendations(email: string | null, mode: "similar" | "top") {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "similar" && !email) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔄 Ejecutando useRecommendations con:", { email, mode });

        // 1. Llamar a tu Lambda
        const data = await apiFetch<{ slug: string }[] >("/recommendations", {
          method: "POST",
          body: JSON.stringify(mode === "similar" ? { email, mode } : {email, mode }),
        });

        console.log("📦 Respuesta cruda de la API:", data);

        // 2. Extraer slugs de la respuesta
        const slugs = data.map((p) => p.slug);
        console.log("🔑 Slugs extraídos:", slugs);

        // 3. Buscar en Contentful por esos slugs
        const products = await fetchProductsBySlugs(slugs);
        console.log("✅ Productos finales desde Contentful:", products);

        setProducts(products);
      } catch (err: any) {
        console.error("💥 Error en useRecommendations:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [email, mode]);

  return { products, loading, error };
}

