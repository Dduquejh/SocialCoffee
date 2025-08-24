import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import PastelButton from "../components/Button";
import { BlogGrid, useBlogState } from "../components/BlogCard";
import { useBlogEntries } from "../hooks/useBlogEntrys";
import { useBlogInfo } from "../hooks/useBlogInfo";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Blog() {
    const navigate = useNavigate();
    const { selectedBlog, isModalOpen, handleReadMore, handleCloseModal } = useBlogState();
    const { blogEntries, loading, error } = useBlogEntries();
    const { blogInfo } = useBlogInfo();

    // Verificar si hay entradas activas
    const hasActiveEntries = blogEntries.length > 0 && blogEntries.some(entry => entry.isActive);
    const shouldShowButton = error || (!loading && (blogEntries.length === 0 || !hasActiveEntries));

    const handleReadFullArticle = (blog: any) => {
        handleReadMore(blog);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F5F0E6] text-gray-800">
            {/* Navbar */}
            <Navbar />

            {/* Contenido principal */}
            <main className="flex-grow">
                {/* Header de la sección */}
                <section className="text-center px-4 py-8 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
                        {blogInfo?.title}
                    </h1>
                    <p className="text-lg md:text-xl font-sans font-medium max-w-2xl mx-auto text-gray-700 mb-8">
                        {blogInfo?.description}
                    </p>
                </section>

                {/* Grid de blogs */}
                <section className="pb-8">
                    <BlogGrid
                        blogs={blogEntries}
                        onReadMore={handleReadFullArticle}
                        loading={loading}
                        error={error ? error.message : null}
                        maxContentLength={180}
                    />
                </section>

                {/* Botón de volver y mensaje (si hay error, no hay contenido o no hay entradas activas) */}
                {shouldShowButton && (
                    <section className="text-center px-4 pb-8">
                        <PastelButton 
                            onClick={() => navigate("/")} 
                            className="hover:animate-pulse hover:scale-105 transition-transform duration-300"
                        >
                            {blogInfo?.textButton}
                        </PastelButton>
                    </section>
                )}
            </main>

            {/* Modal para artículo completo (opcional) */}
            {isModalOpen && selectedBlog && (
                <BlogModal 
                    blog={selectedBlog} 
                    onClose={handleCloseModal} 
                />
            )}
        </div>
    );
}

function BlogModal({ blog, onClose }: { blog: any; onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#F5F0E6] rounded-xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden">
                {/* Header del modal */}
                <div className="flex-shrink-0 bg-[#EED6D3] bg-opacity-90 p-4 border-b border-[#F4A698]">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-serif font-bold text-gray-800 truncate pr-4">
                            {blog.title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-600 hover:text-gray-800 text-2xl font-bold hover:bg-[#F4A698] rounded-full w-8 h-8 flex items-center justify-center transition-colors flex-shrink-0"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Contenido del modal - ÁREA SCROLLEABLE */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Imagen */}
                    <img
                        src={blog.media || '/placeholder-blog.jpg'}
                        alt={blog.title}
                        className="w-full h-64 object-cover rounded-lg mb-6"
                    />

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
                        <span className="bg-[#EED6D3] px-3 py-1 rounded-full">
                            Por: {blog.author}
                        </span>
                        <span className="bg-[#EED6D3] px-3 py-1 rounded-full">
                            {new Intl.DateTimeFormat('es-CO', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            }).format(new Date(blog.publishedDate || Date.now()))}
                        </span>
                    </div>

                    {/* Contenido completo con markdown */}
                    <div className="prose prose-gray max-w-none prose-headings:text-gray-800 prose-headings:font-serif prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-800 prose-a:text-[#8B4513] prose-a:no-underline hover:prose-a:underline prose-blockquote:border-[#F4A698] prose-blockquote:bg-[#EED6D3] prose-blockquote:bg-opacity-50 prose-blockquote:p-4 prose-blockquote:rounded-lg prose-code:bg-[#EED6D3] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-800 prose-pre:text-white prose-pre:rounded-lg prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 pb-4">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                // Personaliza componentes específicos si necesitas
                                h1: ({ children }) => (
                                    <h1 className="text-3xl font-serif font-bold text-gray-800 mb-4 border-b-2 border-[#F4A698] pb-2">
                                        {children}
                                    </h1>
                                ),
                                h2: ({ children }) => (
                                    <h2 className="text-2xl font-serif font-bold text-gray-800 mb-3 mt-6">
                                        {children}
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className="text-xl font-serif font-bold text-gray-800 mb-2 mt-4">
                                        {children}
                                    </h3>
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-[#F4A698] bg-[#EED6D3] bg-opacity-50 p-4 rounded-lg my-4 italic">
                                        {children}
                                    </blockquote>
                                ),
                                code: (props) => {
                                    const { inline, children } = props as { inline?: boolean; children: React.ReactNode };
                                    return inline ? (
                                        <code className="bg-[#EED6D3] px-1 py-0.5 rounded text-sm font-mono">
                                            {children}
                                        </code>
                                    ) : (
                                        <code className="block bg-gray-800 text-white p-4 rounded-lg overflow-x-auto font-mono text-sm">
                                            {children}
                                        </code>
                                    );
                                },
                                a: ({ href, children }) => (
                                    <a 
                                        href={href} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-[#8B4513] hover:text-[#A0522D] hover:underline transition-colors"
                                    >
                                        {children}
                                    </a>
                                ),
                                img: ({ src, alt }) => (
                                    <img 
                                        src={src} 
                                        alt={alt} 
                                        className="w-full h-auto rounded-lg shadow-sm my-4"
                                    />
                                ),
                                ul: ({ children }) => (
                                    <ul className="list-disc list-inside space-y-1 text-gray-700 my-4">
                                        {children}
                                    </ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className="list-decimal list-inside space-y-1 text-gray-700 my-4">
                                        {children}
                                    </ol>
                                ),
                            }}
                        >
                            {blog.content}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Footer del modal */}
                <div className="flex-shrink-0 bg-[#EED6D3] bg-opacity-90 p-4 border-t border-[#F4A698]">
                    <PastelButton
                        onClick={onClose}
                        className="w-full hover:animate-pulse hover:scale-105 transition-transform duration-300"
                    >
                        Cerrar
                    </PastelButton>
                </div>
            </div>
        </div>
    );
}