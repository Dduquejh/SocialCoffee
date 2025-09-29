import Navbar from "../components/Navbar";
import PastelButton from "../components/Button";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { usePurchase } from "../hooks/usePurchase";
import { getUserEmailFromToken } from "../lib/auth";

export default function ShoppingCartPage() {
    const navigate = useNavigate();
    const { items, removeItem, clearCart, getTotal } = useCart();

    const handlePurchase = async () => {
  const email = getUserEmailFromToken();
  if (!email) {
    alert("No se pudo obtener el email del usuario.");
    return;
  }

  const cartItems = items.map(({ product, quantity }) => ({
    slug: product.productSlug,
    quantity,
  }));

  try {
    const result = await usePurchase(email, cartItems);
    alert(`Compra realizada por ${email}. ID: ${result.purchase_id}`);
    clearCart();
  } catch (err: any) {
    alert(`Error al realizar la compra: ${err.message}`);
  }
};



    return (
        <div className="min-h-screen flex flex-col bg-[#F5F0E6] text-gray-800">
            {/* Navbar */}
            <Navbar />

            {/* Contenido principal */}
            <section className="flex flex-col flex-grow px-4 py-8 animate-fade-in-up">
                <h1 className="text-3xl md:text-4xl font-bold font-serif text-center mb-6">
                    Tu carrito
                </h1>

                {items.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-lg text-gray-600 mb-4">
                            No hay productos en el carrito.
                        </p>
                        <PastelButton onClick={() => navigate("/")} className="hover:animate-pulse hover:scale-105 transition-transform duration-300">
                            Volver a la tienda
                        </PastelButton>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto space-y-6">
                        {items.map(({ product, quantity }) => (
                            <div
                                key={product.productSlug}
                                className="flex items-center justify-between bg-white rounded-lg shadow p-4"
                            >
                                <div>
                                    <h3 className="text-lg font-bold">{product.productName}</h3>
                                    <p className="text-sm text-gray-600">
                                        {quantity} x {product.productSize}
                                    </p>
                                    <p className="text-sm font-medium text-[#8B4513]">
                                        Total: ${product.productPrice * quantity}
                                    </p>
                                </div>
                                <PastelButton
                                    onClick={() => removeItem(product.productSlug)}
                                    className="text-sm bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Eliminar
                                </PastelButton>
                            </div>
                        ))}

                        {/* Total y acciones */}
                        <div className="text-center space-y-4">
                            <p className="text-xl font-bold text-[#8B4513]">
                                Total: ${getTotal()}
                            </p>
                            <div className="flex justify-center gap-4">
                                <PastelButton onClick={clearCart} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">
                                    Vaciar carrito
                                </PastelButton>
                                <PastelButton onClick={handlePurchase} className="bg-[#F4A698] hover:bg-[#e88c7f] text-white px-4 py-2 rounded">
                                    Finalizar compra
                                </PastelButton>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
