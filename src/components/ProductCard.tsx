import type { Product } from '../types/Product';
import { useNavigate } from 'react-router-dom';
import PastelButton from './Button';
import { trackEvent } from '../lib/analytics';
import { useValidateStock } from '../hooks/useValidateStocks';
import { useCart } from '../hooks/useCart';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onViewDetails
}: ProductCardProps) {
  const navigate = useNavigate();
  const { addItem } = useCart();

  // 📸 Obtener imagen del producto
  const getImageUrl = () => {
    const image = product.productImage?.[0];
    return image?.fields?.file?.url
      ? `https:${image.fields.file.url}`
      : '/placeholder-coffee.jpg';
  };

  // 💰 Formatear precio
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  // 👁️ Ver detalles del producto
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

  // 🛒 Agregar al carrito con validación de stock
  const handleAddToCartClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!product.productIsActive) {
      trackEvent("attempt_add_to_cart", "ProductCard", product.productName, {
        item_id: product.productSlug,
        status: "inactive",
      });
      alert('Este producto está agotado. No se puede agregar al carrito.');
      return;
    }

    try {
      await useValidateStock(product.productSlug, 1);

      trackEvent("add_to_cart", "ProductCard", product.productName, {
        item_id: product.productSlug,
        item_name: product.productName,
        item_category: product.productType,
        currency: "COP",
        price: product.productPrice,
        quantity: 1,
      });

      addItem(product, 1); // ← Aquí se guarda en el carrito
      alert('Producto agregado al carrito');
    } catch (err: any) {
      trackEvent("stock_validation_failed", "ProductCard", product.productName, {
        item_id: product.productSlug,
        error: err.message,
      });
      alert(`No se pudo agregar al carrito: ${err.message}`);
    }
  };

  return (
    <div
      className="bg-[#EED6D3] bg-opacity-90 rounded-xl overflow-hidden shadow-[#F4A698] shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 group cursor-pointer"
      onClick={handleCardClick}
    >
      {/* 🖼️ Imagen */}
      <div className="relative overflow-hidden h-48 bg-[#F5F0E6]">
        <img
          src={getImageUrl()}
          alt={product.productName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {!product.productIsActive && (
          <div className="absolute top-2 right-2 bg-red-400 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Agotado
          </div>
        )}
        <div className="absolute top-2 left-2 bg-[#F4A698] bg-opacity-90 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">
          {product.productType}
        </div>
      </div>

      {/* 📦 Contenido */}
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-serif font-bold text-gray-800 line-clamp-2 group-hover:text-[#8B4513] transition-colors">
          {product.productName}
        </h3>
        <p className="text-sm font-sans text-gray-700 line-clamp-2">
          {product.productDescription}
        </p>
        <div className="flex justify-between items-center text-xs text-gray-600">
          <span className="bg-[#F5F0E6] px-2 py-1 rounded-full">
            {product.productSize}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-[#8B4513]">
            {formatPrice(product.productPrice)}
          </span>
        </div>

        {/* 🛒 Botón */}
        <div className="pt-2">
          <PastelButton
            onClick={handleAddToCartClick}
            className={`w-full text-sm hover:animate-pulse hover:scale-105 transition-transform duration-300 ${
              !product.productIsActive ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {product.productIsActive ? 'Agregar al Carrito' : 'Agotado'}
          </PastelButton>
        </div>
      </div>
    </div>
  );
}
