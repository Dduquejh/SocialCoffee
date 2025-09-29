import ProductCard from "./ProductCard";
import type { Product } from "../types/Product";

interface ProductGridProps {
  products: Product[];
  onViewDetails?: (product: Product) => void;
  loading?: boolean;
  error?: string | null;
}

export function ProductGrid({
  products,
  onViewDetails,
  loading = false,
  error = null
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
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
        />
      ))}
    </div>
  );
}
