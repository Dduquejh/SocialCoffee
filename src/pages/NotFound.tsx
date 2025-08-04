import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import PastelButton from "../components/Button";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="h-screen flex flex-col bg-[#F5F0E6] text-gray-800">
        {/* Navbar */}
        <Navbar />

        {/* Contenido principal */}
        <section className="flex flex-col items-center justify-center flex-grow text-center px-4 py-8 animate-fade-in-up">
            <img
            src="/Logo.png"
            alt="Logo SocialCoffee"
            className="w-32 h-32 md:w-48 md:h-48 mb-6 animate-bounce-slow"
            />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
            Página no encontrada
            </h1>
            <p className="text-lg md:text-xl font-sans font-medium max-w-xl text-gray-700 mb-6">
            Ups... parece que esta ruta no existe. Tal vez te gustaría volver a disfrutar de un buen café en la página principal.
            </p>
            <PastelButton onClick={() => navigate("/")} className="hover:animate-pulse hover:scale-105 transition-transform duration-300">
            Volver al inicio
            </PastelButton>
        </section>
        </div>
    );
}
