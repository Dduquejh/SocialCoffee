import { useEffect, useState } from "react";
import { useAdminPurchases, markAsShipped } from "../hooks/useAdminPurchase";
import PastelButton from "../components/Button";
import Navbar from "../components/Navbar";

export default function AdminPurchasesPage() {
    const { purchases, loading, error } = useAdminPurchases();
    const [localPurchases, setLocalPurchases] = useState(purchases);

    useEffect(() => {
        setLocalPurchases(purchases);
    }, [purchases]);

    const handleMarkAsShipped = async (id: number) => {
        try {
            await markAsShipped(id); // nueva función en tu hook que llama a la Lambda "mark as shipped"
            const updated = localPurchases.map(p =>
                p.id === id ? { ...p, shipped: true } : p
            );
            setLocalPurchases(updated);
        } catch (err) {
            console.error("Error al marcar como enviado:", err);
            alert("Error al actualizar el estado de envío.");
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F0E6] text-gray-800">
            <Navbar />
            <section className="px-6 py-8">
                <h1 className="text-3xl font-bold font-serif text-center mb-6">
                    Panel de administración
                </h1>

                {loading ? (
                    <p className="text-center text-gray-600">Cargando compras...</p>
                ) : error ? (
                    <p className="text-center text-red-500">Error: {error}</p>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-4">
                        {localPurchases.map(p => (
                            <div
                                key={p.id}
                                className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-bold">
                                        #{p.id} - {p.email || `Usuario ${p.user_id}`}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(p.date).toLocaleString()}
                                    </p>
                                    <p className="text-sm text-[#8B4513]">
                                        Total: ${p.total}
                                    </p>
                                    <p className="text-sm">
                                        Estado:{" "}
                                        {p.delivered
                                            ? "✅ Entregado"
                                            : p.shipped
                                            ? "📦 Enviado"
                                            : "⏳ Pendiente"}
                                    </p>
                                </div>

                                {/* Botón solo si aún no está enviado ni entregado */}
                                {!p.shipped && !p.delivered && (
                                    <PastelButton
                                        onClick={() => handleMarkAsShipped(p.id)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                    >
                                        Marcar como enviado
                                    </PastelButton>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
