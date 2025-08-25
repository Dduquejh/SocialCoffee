import type { Product } from '../types/Product';
import { useNavigate } from 'react-router-dom';
import PastelButton from './Button';
import { trackEvent } from '../lib/analytics';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onViewDetails,
  onAddToCart
}: ProductCardProps) {
  const navigate = useNavigate();

  // Función para obtener la URL de la primera imagen
  const getImageUrl = () => {
    if (product.productImage && product.productImage.length > 0) {
      const image = product.productImage[0];
      if (image && image.fields && image.fields.file) {
        return `https:${image.fields.file.url}`;
      }
    }
    return '/placeholder-coffee.jpg'; // Imagen por defecto
  };

  // Función para formatear el precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Manejar click en la card
  const handleCardClick = () => {
    trackEvent("view_item", "ProductCard", product.productName, {
      item_id: product.productSlug,
      item_name: product.productName,
      item_category: product.productType,
      currency: "COP",
      price: product.productPrice,
    });
    navigate(`/store/product/${product.productSlug}`);
    onViewDetails?.(product);
  };

  // Manejar click en el botón (evitar propagación)
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se active el click de la card

    if (!product.productIsActive) {
    trackEvent("attempt_add_to_cart", "ProductCard", product.productName, {
      item_id: product.productSlug,
      status: "inactive",
    });

    alert('Este producto está agotado. No se puede agregar al carrito.');
    return; // Evita continuar con la lógica de agregar
  }

    trackEvent("add_to_cart", "ProductCard", product.productName, {
    item_id: product.productSlug,
    item_name: product.productName,
    item_category: product.productType,
    currency: "COP",
    price: product.productPrice,
    quantity: 1,
  });
    alert('Esta página se implementa junto con back para hacer la validación de stock que se tenga en una base de datos');
    onAddToCart?.(product);
  };

  return (
    <div
      className="bg-[#EED6D3] bg-opacity-90 rounded-xl overflow-hidden shadow-[#F4A698] shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 group cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Imagen del producto */}
      <div className="relative overflow-hidden h-48 bg-[#F5F0E6]">
        <img
          src={getImageUrl()}
          alt={product.productName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badge de estado */}
        {!product.productIsActive && (
          <div className="absolute top-2 right-2 bg-red-400 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Agotado
          </div>
        )}

        {/* Badge de tipo */}
        <div className="absolute top-2 left-2 bg-[#F4A698] bg-opacity-90 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">
          {product.productType}
        </div>
      </div>

      {/* Contenido de la card */}
      <div className="p-4 space-y-3">
        {/* Nombre del producto */}
        <h3 className="text-lg font-serif font-bold text-gray-800 line-clamp-2 group-hover:text-[#8B4513] transition-colors">
          {product.productName}
        </h3>

        {/* Descripción */}
        <p className="text-sm font-sans text-gray-700 line-clamp-2">
          {product.productDescription}
        </p>

        {/* Detalles del producto */}
        <div className="flex justify-between items-center text-xs text-gray-600">
          <span className="bg-[#F5F0E6] px-2 py-1 rounded-full">
            {product.productSize}
          </span>
        </div>

        {/* Precio */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-[#8B4513]">
            {formatPrice(product.productPrice)}
          </span>
        </div>

        {/* Botón de agregar al carrito */}
        <div className="pt-2">
          <PastelButton
            onClick={handleAddToCartClick}
            className={`w-full text-sm hover:animate-pulse hover:scale-105 transition-transform duration-300 ${!product.productIsActive ? 'opacity-50 cursor-not-allowed' : ''
              }`}

          >
            {product.productIsActive ? 'Agregar al Carrito' : 'Agotado'}
          </PastelButton>
        </div>
      </div>
    </div>
  );
}

// Componente adicional para el grid de productos
interface ProductGridProps {
  products: Product[];
  onViewDetails?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  loading?: boolean;
  error?: string | null;
}

export function ProductGrid({
  products,
  onViewDetails,
  onAddToCart,
  loading = false,
  error = null
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
        {/* Skeleton loading cards */}
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-[#EED6D3] bg-opacity-90 rounded-xl overflow-hidden animate-pulse">
            <div className="h-48 bg-[#F5F0E6] bg-opacity-50"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-[#F5F0E6] bg-opacity-50 rounded"></div>
              <div className="h-3 bg-[#F5F0E6] bg-opacity-50 rounded w-3/4"></div>
              <div className="h-6 bg-[#F5F0E6] bg-opacity-50 rounded w-1/2"></div>
              <div className="h-8 bg-[#F5F0E6] bg-opacity-50 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl max-w-md mx-auto">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-[#EED6D3] bg-opacity-90 rounded-xl p-8 max-w-md mx-auto">
          <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">
            No hay productos disponibles
          </h3>
          <p className="text-gray-600">
            Vuelve más tarde para ver nuestros deliciosos cafés.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 animate-fade-in-up">
      {products.map((product) => (
        <ProductCard
          key={product.productSlug}
          product={product}
          onViewDetails={onViewDetails}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}