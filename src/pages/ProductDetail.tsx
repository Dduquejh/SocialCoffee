import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PastelButton from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useProductBySlug } from "../hooks/useAllProduct";

export default function ProductDetail() {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const { product, loading, error } = useProductBySlug(slug ?? "");

    // Si no hay producto (por ejemplo, acceso directo a la URL), redirigir o mostrar error
    if (!product || error) {
        return (
            <div className="min-h-screen flex flex-col bg-[#F5F0E6] text-gray-800">
                <Navbar />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">
                            Producto no encontrado
                        </h2>
                        <p className="text-gray-600 mb-6">
                            El producto que buscas no está disponible.
                        </p>
                        <PastelButton
                            onClick={() => navigate('/store')}
                            className="hover:animate-pulse hover:scale-105 transition-transform duration-300"
                        >
                            Volver a la tienda
                        </PastelButton>
                    </div>
                </main>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-[#F5F0E6] text-gray-800">
                <Navbar />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">
                            Cargando producto...
                        </h2>
                    </div>
                </main>
            </div>
        );
    }

    // Funciones auxiliares
    const getImageUrl = (imageIndex: number = 0) => {
        if (product.productImage && product.productImage.length > imageIndex) {
            const image = product.productImage[imageIndex];
            if (image?.fields?.file?.url) {
                return `https:${image.fields.file.url}`;
            }
        }
        return '/placeholder-coffee.jpg';
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleAddToCart = () => {
        if (product.productIsActive) {
            alert('Esta funcionalidad se implementa junto con back para hacer la validación de stock que se tenga en una base de datos');
            // Aquí agregarías la lógica real del carrito
        }
    };

    const handleQuantityChange = (change: number) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F5F0E6] text-gray-800">
            {/* Navbar */}
            <Navbar />

            {/* Contenido principal */}
            <main className="flex-grow">
                {/* Breadcrumb */}
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <nav className="text-sm text-gray-600">
                        <button
                            onClick={() => navigate('/store')}
                            className="hover:text-[#8B4513] transition-colors"
                        >
                            Tienda
                        </button>
                        <span className="mx-2">/</span>
                        <span className="text-gray-800">{product.productName}</span>
                    </nav>
                </div>

                {/* Contenido del producto */}
                <div className="max-w-7xl mx-auto px-4 pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                        {/* Galería de imágenes */}
                        <div className="space-y-4">
                            {/* Imagen principal */}
                            <div className="aspect-square bg-[#EED6D3] bg-opacity-50 rounded-xl overflow-hidden">
                                <img
                                    src={getImageUrl(selectedImageIndex)}
                                    alt={product.productName}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Miniaturas */}
                            {product.productImage && product.productImage.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto">
                                    {product.productImage.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImageIndex(index)}
                                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                                                    ? 'border-[#F4A698]'
                                                    : 'border-transparent hover:border-[#EED6D3]'
                                                }`}
                                        >
                                            <img
                                                src={getImageUrl(index)}
                                                alt={`${product.productName} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Información del producto */}
                        <div className="space-y-6">
                            {/* Header */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-[#F4A698] text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                                        {product.productType}
                                    </span>
                                    {!product.productIsActive && (
                                        <span className="bg-red-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            Agotado
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-2">
                                    {product.productName}
                                </h1>
                                <p className="text-xl text-gray-600">
                                    {product.productSize}
                                </p>
                            </div>

                            {/* Precio */}
                            <div className="bg-[#EED6D3] bg-opacity-50 rounded-xl p-6">
                                <div className="text-4xl font-bold text-[#8B4513] mb-2">
                                    {formatPrice(product.productPrice)}
                                </div>
                                <p className="text-gray-600">Precio por unidad</p>
                            </div>

                            {/* Descripción */}
                            <div>
                                <h3 className="text-xl font-serif font-bold text-gray-800 mb-3">
                                    Descripción
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {product.productDescription}
                                </p>
                            </div>

                            {/* Cantidad y botones */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                                        Cantidad
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            className="w-10 h-10 bg-[#EED6D3] hover:bg-[#F4A698] rounded-full flex items-center justify-center font-bold text-gray-800 transition-colors"
                                            disabled={quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center font-semibold text-lg">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            className="w-10 h-10 bg-[#EED6D3] hover:bg-[#F4A698] rounded-full flex items-center justify-center font-bold text-gray-800 transition-colors"
                                            disabled={quantity >= 10}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="flex gap-4">
                                    <PastelButton
                                        onClick={handleAddToCart}
                                        className={`flex-1 text-lg py-3 hover:animate-pulse hover:scale-105 transition-transform duration-300 ${!product.productIsActive ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        {product.productIsActive ? `Agregar ${quantity} al Carrito` : 'Agotado'}
                                    </PastelButton>
                                </div>

                                {/* Precio total */}
                                <div className="text-center p-4 bg-[#F5F0E6] rounded-xl">
                                    <p className="text-sm text-gray-600 mb-1">Total:</p>
                                    <p className="text-2xl font-bold text-[#8B4513]">
                                        {formatPrice(product.productPrice * quantity)}
                                    </p>
                                </div>
                            </div>

                            {/* Información adicional */}
                            <div className="border-t border-[#EED6D3] pt-6">
                                <h3 className="text-lg font-serif font-bold text-gray-800 mb-3">
                                    Información adicional
                                </h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Tamaño:</span>
                                        <span className="font-semibold">{product.productSize}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tipo:</span>
                                        <span className="font-semibold">{product.productType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Disponibilidad:</span>
                                        <span className={`font-semibold ${product.productIsActive ? 'text-green-600' : 'text-red-600'}`}>
                                            {product.productIsActive ? 'En stock' : 'Agotado'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botón volver */}
                    <div className="mt-12 text-center">
                        <PastelButton
                            onClick={() => navigate('/store')}
                            className="hover:animate-pulse hover:scale-105 transition-transform duration-300"
                        >
                            ← Volver a la tienda
                        </PastelButton>
                    </div>
                </div>
            </main>
        </div>
    );
}
