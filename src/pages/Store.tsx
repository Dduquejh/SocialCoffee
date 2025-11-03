import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useAllProduct";
import { useStoreInfo } from "../hooks/useStoreInfo";
import { ProductGrid } from "../components/ProductGrid";
import type { Product } from "../types/Product";
import { trackEvent } from "../lib/analytics";
import { useRecommendations } from "../hooks/useRecommendations";
import { getUserEmailFromToken } from "../lib/auth";

export default function Store() {
    const navigate = useNavigate();
    const { products, loading, error, refetch } = useProducts();
    const { storeInfo } = useStoreInfo();

    const email = getUserEmailFromToken();
    const { products: similarProducts } = useRecommendations(email, "similar");
    const { products: topProducts } = useRecommendations(email, "top");

    const handleViewDetails = (product: Product) => {
        // Navegar a la página de detalles del producto
        navigate(`/product/${product.productSlug}`);
    };


    const handleRefresh = () => {
        refetch();
    };

    return (
        <>
                <div className="min-h-screen bg-[#F5F0E6] text-gray-800">
            {/* Navbar */}
            <Navbar />

            {/* Header de la tienda */}
            <section className="text-center px-4 py-8 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
                {storeInfo?.title}
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
                {storeInfo?.details}
                </p>
                
                {/* Botón de refrescar si hay error */}
                {error && (
                <button
                    onClick={handleRefresh}
                    className="bg-[#F4A698] hover:bg-[#F4A698]/80 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                    Intentar de nuevo
                </button>
                )}
            </section>

            {/* Grid de productos */}
            <ProductGrid
                products={products}
                onViewDetails={handleViewDetails}
                loading={loading}
                error={error}
            />

            {/* Sección de productos similares en base a compras*/}
            {similarProducts.length > 0 && (
                <section className="px-4 py-10 bg-[#EED6D3]/40 rounded-xl max-w-6xl mx-auto my-8 shadow-md">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800 font-serif">Recomendados en base a tus compras</h2>
                <ProductGrid products={similarProducts} onViewDetails={handleViewDetails} />
                </section>
            )}

            {/* Sección de productos destacados */}
            {topProducts.length > 0 && (
                <section className="px-4 py-10 bg-[#EED6D3]/40 rounded-xl max-w-6xl mx-auto my-8 shadow-md">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800 font-serif">Productos más vendidos</h2>
                    <ProductGrid products={topProducts} onViewDetails={handleViewDetails} />
                </section>
            )}

            {/* Footer o información adicional */}
            {!loading && !error && products.length > 0 && (
                <section className="text-center px-4 py-8">
                <div className="bg-[#EED6D3] bg-opacity-90 rounded-xl p-6 max-w-2xl mx-auto">
                    <h3 className="text-xl font-serif font-bold mb-2">
                    {storeInfo?.footerTitle}
                    </h3>
                    <p className="text-gray-700 mb-4">
                    {storeInfo?.footerDescription}
                    </p>
                    <button
                    onClick={() => {
                        trackEvent("go_to_contact", "StorePage", "Footer button");
                        alert('Se debe de mirar como implementar esto');
                    }}
                    className="bg-[#F4A698] hover:bg-[#F4A698]/80 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
                    >
                    {storeInfo?.footerButtonText}
                    </button>
                </div>
                </section>
            )}
            </div>
        </>
        
    );
}
