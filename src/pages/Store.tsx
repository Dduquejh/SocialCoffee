import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useAllProduct";
import { ProductGrid } from "../components/ProductCard";
import type { Product } from "../types/Product"; // Ajusta la ruta según tu estructura

export default function ComingSoon() {
    const navigate = useNavigate();
    const { products, loading, error, refetch } = useProducts();

    const handleViewDetails = (product: Product) => {
        // Navegar a la página de detalles del producto
        navigate(`/product/${product.productSlug}`);
    };
    const handleAddToCart = (product: Product) => {
        // Lógica para agregar al carrito
        console.log('Agregando al carrito:', product);
        // Aquí puedes integrar con tu estado de carrito o context
        // Por ejemplo: addToCart(product);
    };

    const handleRefresh = () => {
        refetch();
    };

    return (
        <>
            {/* Navbar 
            <div className="h-screen flex flex-col bg-[#F5F0E6] text-gray-800">
            <Navbar />
            */}

            {/* Contenido principal 
            <section className="flex flex-col items-center justify-center flex-grow text-center px-4 py-8 animate-fade-in-up">
                <img
                src="/Logo.png"
                alt="Logo SocialCoffee"
                className="w-32 h-32 md:w-48 md:h-48 mb-6 animate-bounce-slow"
                />
                <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
                ¡Muy pronto!
                </h1>
                <p className="text-lg md:text-xl font-sans font-medium max-w-xl text-gray-700 mb-6">
                Estamos preparando algo especial para los amantes del café. Esta sección estará disponible próximamente.
                </p>
                <PastelButton onClick={() => navigate("/")} className="hover:animate-pulse hover:scale-105 transition-transform duration-300">
                Volver al inicio
                </PastelButton>
            </section>

            </div>
        */}


                <div className="min-h-screen bg-[#F5F0E6] text-gray-800">
            {/* Navbar */}
            <Navbar />

            {/* Header de la tienda */}
            <section className="text-center px-4 py-8 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
                Nuestra Tienda de Café
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
                Descubre nuestra selección premium de cafés artesanales, 
                cuidadosamente seleccionados para los verdaderos amantes del café.
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
                onAddToCart={handleAddToCart}
                loading={loading}
                error={error}
            />

            {/* Footer o información adicional */}
            {!loading && !error && products.length > 0 && (
                <section className="text-center px-4 py-8">
                <div className="bg-[#EED6D3] bg-opacity-90 rounded-xl p-6 max-w-2xl mx-auto">
                    <h3 className="text-xl font-serif font-bold mb-2">
                    ¿Necesitas ayuda eligiendo?
                    </h3>
                    <p className="text-gray-700 mb-4">
                    Nuestros expertos en café están aquí para ayudarte a encontrar 
                    el café perfecto para tu paladar.
                    </p>
                    <button
                    onClick={() => navigate('/contact')}
                    className="bg-[#F4A698] hover:bg-[#F4A698]/80 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
                    >
                    Contáctanos
                    </button>
                </div>
                </section>
            )}
            </div>
        </>
        
    );
}
