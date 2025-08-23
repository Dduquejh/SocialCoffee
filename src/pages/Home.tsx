import PastelButton from "../components/Button";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useHomePage } from "../hooks/useHomePageContent";

export default function Home() {
    const navigate = useNavigate();
    const { homePage, loading, error, refetch } = useHomePage();

    const handleRefresh = () => {
        refetch();
    };

    // Estado de loading
    if (loading) {
        return (
            <div className="h-screen flex flex-col bg-[#F5F0E6] text-gray-800">
                <Navbar />
                
                {/* Sección superior con skeleton */}
                <section className="flex flex-col items-center justify-center flex-grow text-center px-4 py-8 animate-fade-in-up">
                    {/* Skeleton para el título */}
                    <div className="h-16 bg-[#EED6D3] rounded-lg w-96 mb-4 animate-pulse"></div>
                    
                    {/* Skeleton para el logo */}
                    <div className="w-48 h-48 md:w-64 md:h-64 mb-2 bg-[#EED6D3] rounded-full animate-pulse"></div>
                    
                    {/* Skeleton para el subtítulo */}
                    <div className="h-8 bg-[#EED6D3] rounded-lg w-80 animate-pulse"></div>
                </section>

                {/* Skeleton para la sección inferior */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 pb-8 animate-fade-in-up">
                    {/* Skeleton Cuadro 1 */}
                    <div className="bg-[#EED6D3] bg-opacity-90 rounded-xl p-6 animate-pulse">
                        <div className="h-8 bg-[#F4A698] rounded-lg mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-[#F4A698] rounded w-full"></div>
                            <div className="h-4 bg-[#F4A698] rounded w-3/4"></div>
                            <div className="h-4 bg-[#F4A698] rounded w-5/6"></div>
                        </div>
                    </div>

                    {/* Skeleton Cuadro 2 */}
                    <div className="bg-[#EED6D3] bg-opacity-90 rounded-xl p-6 animate-pulse">
                        <div className="h-8 bg-[#F4A698] rounded-lg mb-4"></div>
                        <div className="space-y-2 mb-6">
                            <div className="h-4 bg-[#F4A698] rounded w-full"></div>
                            <div className="h-4 bg-[#F4A698] rounded w-4/5"></div>
                        </div>
                        <div className="flex gap-4 justify-center">
                            <div className="h-10 bg-[#F4A698] rounded-lg w-24"></div>
                            <div className="h-10 bg-[#F4A698] rounded-lg w-24"></div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    // Estado de error
    if (error) {
        return (
            <div className="h-screen flex flex-col bg-[#F5F0E6] text-gray-800">
                <Navbar />
                
                <section className="flex flex-col items-center justify-center flex-grow text-center px-4 py-8 animate-fade-in-up">
                    <img
                        src="/Logo.png"
                        alt="Logo SocialCoffee"
                        className="w-48 h-48 md:w-64 md:h-64 mb-6 opacity-50"
                    />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif text-red-600">
                        ¡Oops! Algo salió mal
                    </h1>
                    <p className="text-lg md:text-xl font-sans font-medium max-w-xl text-gray-700 mb-6">
                        No pudimos cargar el contenido de la página en este momento. 
                        Por favor, intenta de nuevo más tarde.
                    </p>
                    <div className="flex gap-4">
                        <PastelButton 
                            onClick={handleRefresh} 
                            className="hover:animate-pulse hover:scale-105 transition-transform duration-300"
                        >
                            Intentar de nuevo
                        </PastelButton>
                        <PastelButton 
                            onClick={() => navigate("/store")} 
                            className="hover:animate-pulse hover:scale-105 transition-transform duration-300"
                        >
                            Ir a la tienda
                        </PastelButton>
                    </div>
                </section>
            </div>
        );
    }

    // Contenido normal cuando hay datos
    return (
        <div className="h-screen flex flex-col bg-[#F5F0E6] text-gray-800">
            {/* Navbar */}
            <Navbar />

            {/* Sección superior */}
            <section className="flex flex-col items-center justify-center flex-grow text-center px-4 py-8 animate-fade-in-up">
                <h1 className="text-5xl md:text-6xl font-bold mb-4">{homePage?.greeting}</h1>
                <img
                    src={homePage?.logo || "/Logo.png"}
                    alt="Logo SocialCoffee"
                    className="w-48 h-48 md:w-64 md:h-64 mb-2 animate-bounce-slow"
                />
                <h2 className="text-2xl md:text-3xl font-semibold max-w-xl">
                    {homePage?.secondTitle}
                </h2>
            </section>

            {/* Sección inferior con dos cuadros */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 pb-8 animate-fade-in-up">
                {/* Cuadro 1 */}
                <div className="relative rounded-xl overflow-hidden p-6 flex flex-col justify-center items-center bg-[#EED6D3] bg-opacity-90 shadow-[#F4A698] shadow-sm hover:shadow-md duration-300 hover:scale-102 transition-transform">
                    <h2 className="text-2xl font-serif font-bold mb-2">{homePage?.infoBannerTitle}</h2>
                    <p className="text-lg font-sans font-medium text-center">
                        {homePage?.infoBannerDescription}
                    </p>
                </div>

                {/* Cuadro 2 */}
                <div className="bg-[#EED6D3] bg-opacity-90 rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-[#F4A698] shadow-sm hover:shadow-md duration-300 hover:scale-102 transition-transform">
                    <h2 className="text-2xl font-serif font-bold mb-2 text-gray-800">{homePage?.secondBannerTitle}</h2>
                    <p className="text-lg font-sans font-medium text-gray-700 mb-4">
                        {homePage?.secondBannerDescription}
                    </p>
                    <div className="flex gap-4">
                        <PastelButton 
                            onClick={() => navigate("/store")} 
                            className="hover:animate-pulse hover:scale-105 transition-transform duration-300"
                        >
                            {homePage?.textButton1}
                        </PastelButton>
                        <PastelButton 
                            onClick={() => navigate("/forums")} 
                            className="hover:animate-pulse hover:scale-105 transition-transform duration-300"
                        >
                            {homePage?.textButton2}
                        </PastelButton>
                    </div>
                </div>
            </section>
        </div>
    );
}