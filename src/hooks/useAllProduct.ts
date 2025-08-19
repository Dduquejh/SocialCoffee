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
      
      console.log('🔍 Intentando obtener productos...');
      
      // PASO 1: Primero obtengamos TODOS los content types para ver qué hay disponible
      const allEntries = await client.getEntries({
        include: 1,
        limit: 5, // Solo los primeros 5 para debug
      });
      
      console.log('📋 Todos los content types disponibles:', 
        allEntries.items.map(item => ({
          contentType: item.sys.contentType.sys.id,
          id: item.sys.id,
          fields: Object.keys(item.fields)
        }))
      );

      // PASO 2: Intentamos obtener específicamente nuestro content type
      let response;
      const contentTypeOptions = [
        'ProductModel-SocialCoffee',
        'productModelSocialCoffee', 
        'productModel-socialCoffee',
        'productmodel-socialcoffee',
        'ProductModel',
        'productModel',
        'product',
        'Product'
      ];

      for (const contentType of contentTypeOptions) {
        try {
          console.log(`🔍 Probando content_type: "${contentType}"`);
          response = await client.getEntries({
            content_type: contentType,
            include: 10,
            limit: 10,
          });
          console.log(`✅ Éxito con content_type: "${contentType}"`, response);
          break;
        } catch (err) {
          console.log(`❌ Falló content_type: "${contentType}"`, err);
          continue;
        }
      }

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
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        // Usaremos el mismo approach de probar múltiples content types
        const contentTypeOptions = [
          'ProductModel-SocialCoffee',
          'productModelSocialCoffee', 
          'productModel-socialCoffee',
          'ProductModel',
          'product'
        ];

        let response;
        for (const contentType of contentTypeOptions) {
          try {
            response = await client.getEntries({
              content_type: contentType,
              'fields.productSlug': slug,
              include: 10,
              limit: 1,
            });
            if (response.items.length > 0) break;
          } catch (err) {
            continue;
          }
        }

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