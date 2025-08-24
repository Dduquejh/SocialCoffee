import { useState, useEffect } from 'react';
import { client } from '../lib/contentfulClient';
import type { Product } from '../types/Product';
import type { Entry } from 'contentful';

// Estado del hook
interface UseProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

// Función para transformar datos de Contentful a nuestra interfaz
const transformProduct = (entry: Entry<any>): Product => {
  const fields = entry.fields;

  return {
    productName: fields?.productName?.toString() || '',
    productDescription: fields?.productDescription?.toString() || '',
    productImage: Array.isArray(fields?.productImage) ? fields.productImage : [],
    productPrice: fields?.productPrice || 0,
    productIsActive: fields?.productIsActive === true || fields?.productIsActive === 'true',
    productSlug: fields?.productSlug?.toString() || '',
    productType: fields?.productType?.toString() || '',
    productSize: fields?.productSize?.toString() || '',
  };
};

export const useProducts = () => {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: true,
    error: null,
  });

  const fetchProducts = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      let response;



      response = await client.getEntries({
        content_type: "productModelSocialCoffee",
        include: 10,
        limit: 10,
      });



      if (!response || response.items.length === 0) {
        throw new Error('No se encontraron productos con ningún content_type probado');
      }

      const products = response.items.map(transformProduct);

      setState({
        products,
        loading: false,
        error: null,
      });

    } catch (error) {
      console.error('💥 Error completo:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error desconocido al cargar productos',
      }));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const refetch = () => {
    fetchProducts();
  };

  return {
    ...state,
    refetch,
  };
};

// Versión simplificada del hook por slug
export const useProductBySlug = (slug: string) => {
  const [state, setState] = useState<{
    product: Product | null;
    loading: boolean;
    error: string | null;
  }>({
    product: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!slug) {
      setState({ product: null, loading: false, error: null });
      return;
    }

    const fetchProduct = async () => {
      let response
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));


        response = await client.getEntries({
          content_type: "productModelSocialCoffee",
          'fields.productSlug': slug,
          include: 10,
          limit: 1,
        });


        if (response && response.items.length > 0) {
          const product = transformProduct(response.items[0]);
          setState({ product, loading: false, error: null });
        } else {
          setState({
            product: null,
            loading: false,
            error: 'Producto no encontrado'
          });
        }
      } catch (error) {
        console.error('Error fetching product by slug:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Error desconocido al cargar el producto',
        }));
      }
    };

    fetchProduct();
  }, [slug]);

  return state;
};