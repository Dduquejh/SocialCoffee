import PastelButton from "../components/Button";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";


export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="h-screen flex flex-col bg-[#F5F0E6] text-gray-800 ">
        {/* Navbar */}
        <Navbar />

        {/* Sección superior */}
        <section className="flex flex-col items-center justify-center flex-grow text-center px-4 py-8 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Bienvenidos a</h1>
            <img
            src="/Logo.png"
            alt="Logo SocialCoffee"
            className="w-48 h-48 md:w-64 md:h-64 mb-2 animate-bounce-slow"
            />
            <h2 className="text-2xl md:text-3xl font-semibold max-w-xl">
            Un espacio para compartir y descubrir cafés
            </h2>
        </section>

        {/* Sección inferior con dos cuadros */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 pb-8 animate-fade-in-up">
  {/* Cuadro 1 */}
            <div className="relative rounded-xl overflow-hidden p-6 flex flex-col justify-center items-center bg-[#EED6D3] bg-opacity-90 shadow-[#F4A698] shadow-sm hover:shadow-md duration-300 hover:scale-102 transition-transform ">
                <h2 className="text-2xl font-serif font-bold mb-2">¿Qué es Social Coffee?</h2>
                <p className="text-lg font-sans font-medium text-center">
                Social Coffee es una plataforma donde los amantes del café pueden compartir sus experiencias, descubrir nuevos cafés y conectarse con otros entusiastas del café.
                </p>
            </div>

            {/* Cuadro 2 */}
            <div className="bg-[#EED6D3] bg-opacity-90 rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-[#F4A698] shadow-sm hover:shadow-md duration-300 hover:scale-102 transition-transform">
                <h2 className="text-2xl font-serif font-bold mb-2 text-gray-800">Explora y Conecta</h2>
                <p className="text-lg font-sans font-medium text-gray-700 mb-4">
                Únete a foros, reseña tus cafés favoritos y encuentra nuevas cafeterías cerca de ti.
                </p>
                <div className="flex gap-4">
                <PastelButton onClick={() => navigate("/store")} className="hover:animate-pulse hover:scale-105 transition-transform duration-300">Compra un café</PastelButton>
                <PastelButton onClick={() => navigate("/forums")} className="hover:animate-pulse hover:scale-105 transition-transform duration-300">Ver Foros</PastelButton>
                </div>
            </div>
        </section>
    </div>
);

}
