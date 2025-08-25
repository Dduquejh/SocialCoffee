import React, { useState } from 'react';
import PastelButton from './Button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useBlogInfo } from '../hooks/useBlogInfo';
import { trackEvent } from '../lib/analytics';

export interface BlogContent {
    title: string;
    slug: string;
    media: string;
    content: string;
    isActive: boolean;
    author: string;
    publishedDate: string;
}

interface BlogCardProps {
    blog: BlogContent;
    onReadMore?: (blog: BlogContent) => void;
    maxContentLength?: number;
    showFullContent?: boolean;
}

export default function BlogCard({
    blog,
    onReadMore,
    maxContentLength = 150,
    showFullContent = false
}: BlogCardProps) {
    const [isExpanded, setIsExpanded] = useState(showFullContent);

    // Función para obtener la URL de la imagen
    const getImageUrl = () => {
        return blog.media || '/placeholder-blog.jpg'; // Imagen por defecto
    };

    // Función para truncar el contenido
    const getTruncatedContent = () => {
        if (isExpanded || blog.content.length <= maxContentLength) {
            return blog.content;
        }
        return blog.content.substring(0, maxContentLength) + '...';
    };

    // Manejar click para expandir/contraer
    const handleToggleExpand = () => {
        trackEvent("toggle_expand", "BlogCard", blog.title, {
            item_id: blog.slug,
            status: isExpanded ? "collapsed" : "expanded",
        });
        setIsExpanded(!isExpanded);
    };

    // Manejar click en "Leer más"
    const handleReadMore = (e: React.MouseEvent) => {
        trackEvent("read_more", "BlogCard", blog.title, {
            item_id: blog.slug,
        });
        e.stopPropagation();
        onReadMore?.(blog);
    };

    const needsTruncation = blog.content.length > maxContentLength;

    return (
        <article className="bg-[#EED6D3] bg-opacity-90 rounded-xl overflow-hidden shadow-[#F4A698] shadow-sm hover:shadow-md transition-all duration-300 group">
            {/* Imagen del blog */}
            <div className="relative overflow-hidden h-48 bg-[#F5F0E6]">
                <img
                    src={getImageUrl()}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge de estado */}
                {!blog.isActive && (
                    <div className="absolute top-2 right-2 bg-gray-400 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Inactivo
                    </div>
                )}

                {/* Fecha de publicación */}
                <div className="absolute bottom-2 left-2 bg-[#F4A698] bg-opacity-90 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">
                    {blog.publishedDate}
                </div>
            </div>

            {/* Contenido de la card */}
            <div className="p-4 space-y-3">
                {/* Título del blog */}
                <h2 className="text-xl font-serif font-bold text-gray-800 line-clamp-2 group-hover:text-[#8B4513] transition-colors">
                    {blog.title}
                </h2>

                {/* Autor */}
                <div className="flex items-center text-sm text-gray-600">
                    <span className="bg-[#F5F0E6] px-2 py-1 rounded-full">
                        Por: {blog.author}
                    </span>
                </div>

                {/* Contenido del blog */}
                <div className="text-sm font-sans text-gray-700">
                    {isExpanded ? (
                        // Mostrar contenido completo con markdown
                        <div className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-headings:font-serif prose-p:text-gray-700 prose-strong:text-gray-800 prose-a:text-[#8B4513] prose-code:bg-[#EED6D3] prose-code:px-1 prose-code:rounded prose-blockquote:border-[#F4A698] prose-blockquote:bg-[#EED6D3] prose-blockquote:bg-opacity-30 prose-blockquote:p-2 prose-blockquote:rounded prose-ul:text-gray-700 prose-ol:text-gray-700">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    // Componentes más pequeños para la card
                                    h1: ({ children }) => <h4 className="text-lg font-serif font-bold text-gray-800 mb-2">{children}</h4>,
                                    h2: ({ children }) => <h5 className="text-base font-serif font-bold text-gray-800 mb-2">{children}</h5>,
                                    h3: ({ children }) => <h6 className="text-sm font-serif font-bold text-gray-800 mb-1">{children}</h6>,
                                    p: ({ children }) => <p className="mb-2 text-sm">{children}</p>,
                                    blockquote: ({ children }) => (
                                        <blockquote className="border-l-2 border-[#F4A698] bg-[#EED6D3] bg-opacity-30 p-2 rounded text-sm italic mb-2">
                                            {children}
                                        </blockquote>
                                    ),
                                    code: ({node, inline, className, children, ...props}: any) => (
                                        inline ? (
                                            <code className={`bg-[#EED6D3] px-1 rounded text-xs font-mono ${className ?? ''}`} {...props}>{children}</code>
                                        ) : (
                                            <pre className="block bg-gray-800 text-white p-2 rounded text-xs font-mono overflow-x-auto">
                                                <code className={className ?? ''} {...props}>{children}</code>
                                            </pre>
                                        )
                                    ),
                                    ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2 text-sm">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2 text-sm">{children}</ol>,
                                    img: ({ src, alt }) => <img src={src} alt={alt} className="w-full h-auto rounded mb-2" />
                                }}
                            >
                                {blog.content}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        // Mostrar contenido truncado sin markdown
                        <p className="line-clamp-3">
                            {getTruncatedContent()}
                        </p>
                    )}
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2 pt-2">
                    {needsTruncation && (
                        <PastelButton
                            onClick={handleToggleExpand}
                            className="flex-1 text-sm hover:animate-pulse hover:scale-105 transition-transform duration-300"
                        >
                            {isExpanded ? 'Ver menos' : 'Ver más'}
                        </PastelButton>
                    )}

                    {onReadMore && (
                        <PastelButton
                            onClick={handleReadMore}
                            className="flex-1 text-sm hover:animate-pulse hover:scale-105 transition-transform duration-300"
                        >
                            Leer artículo completo
                        </PastelButton>
                    )}
                </div>
            </div>
        </article>
    );
}

// Componente para el grid de blogs
interface BlogGridProps {
    blogs: BlogContent[];
    onReadMore?: (blog: BlogContent) => void;
    loading?: boolean;
    error?: string | null;
    maxContentLength?: number;
}

export function BlogGrid({
    blogs,
    onReadMore,
    loading = false,
    error = null,
    maxContentLength = 150
}: BlogGridProps) {
    const { blogInfo } = useBlogInfo();
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {/* Skeleton loading cards */}
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-[#EED6D3] bg-opacity-90 rounded-xl overflow-hidden animate-pulse">
                        <div className="h-48 bg-[#F5F0E6] bg-opacity-50"></div>
                        <div className="p-4 space-y-3">
                            <div className="h-6 bg-[#F5F0E6] bg-opacity-50 rounded w-3/4"></div>
                            <div className="h-4 bg-[#F5F0E6] bg-opacity-50 rounded w-1/2"></div>
                            <div className="space-y-2">
                                <div className="h-3 bg-[#F5F0E6] bg-opacity-50 rounded"></div>
                                <div className="h-3 bg-[#F5F0E6] bg-opacity-50 rounded"></div>
                                <div className="h-3 bg-[#F5F0E6] bg-opacity-50 rounded w-2/3"></div>
                            </div>
                            <div className="flex gap-2">
                                <div className="h-8 bg-[#F5F0E6] bg-opacity-50 rounded flex-1"></div>
                                <div className="h-8 bg-[#F5F0E6] bg-opacity-50 rounded flex-1"></div>
                            </div>
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

    if (blogs.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="bg-[#EED6D3] bg-opacity-90 rounded-xl p-8 max-w-md mx-auto">
                    <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">
                        {blogInfo?.msgTitle}
                    </h3>
                    <p className="text-gray-600">
                        {blogInfo?.msgText}
                    </p>
                </div>
            </div>
        );
    }

    // Filtrar solo blogs activos
    const activeBlogs = blogs.filter(blog => blog.isActive);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 animate-fade-in-up">
            {activeBlogs.map((blog) => (
                <BlogCard
                    key={blog.slug}
                    blog={blog}
                    onReadMore={onReadMore}
                    maxContentLength={maxContentLength}
                />
            ))}
        </div>
    );
}

// Hook personalizado para manejar el estado del blog
export function useBlogState() {
    const [selectedBlog, setSelectedBlog] = useState<BlogContent | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleReadMore = (blog: BlogContent) => {
        setSelectedBlog(blog);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBlog(null);
    };

    return {
        selectedBlog,
        isModalOpen,
        handleReadMore,
        handleCloseModal
    };
}