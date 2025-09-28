import { useState } from "react";
import PastelButton from "./Button";
import { trackEvent } from "../lib/analytics";
import { useComments } from "../hooks/useGetComments";
import { usePostComment } from "../hooks/usePostComments";

interface Props {
    productSlug: string;
}

export default function CommentSection({ productSlug }: Props) {
    const [newComment, setNewComment] = useState("");
    const { comments, loading: loadingComments, refetch } = useComments(productSlug);
    const { postComment, loading: posting } = usePostComment(productSlug);

    const handleSubmit = async () => {
        if (!newComment.trim()) return;

        trackEvent("submit_comment", "CommentSection", `Comment on ${productSlug}`);

        try {
            await postComment(newComment);
            setNewComment("");
            refetch(); // Actualiza los comentarios después del post
        } catch (err) {
            console.error("Error al publicar comentario:", err);
        }
    };

    return (
        <div className="bg-[#EED6D3] bg-opacity-90 rounded-xl p-6 shadow-[#F4A698] shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-2xl font-serif font-bold mb-4 text-center text-gray-800">Comentarios</h3>

            <div className="mb-4">
                <textarea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Escribe tu opinión sobre este producto..."
                    className="w-full p-4 rounded-lg border border-[#F4A698] bg-[#F5F0E6] text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#F4A698]"
                    rows={4}
                />
                <div className="flex justify-end mt-2">
                    <PastelButton
                        onClick={handleSubmit}
                        variant="peach"
                        className="hover:animate-pulse hover:scale-105 transition-transform duration-300"
                    >
                        {posting ? "Enviando..." : "Publicar"}
                    </PastelButton>
                </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
                {loadingComments ? (
                    <p className="text-gray-600 text-center animate-pulse">Cargando comentarios...</p>
                ) : comments.length === 0 ? (
                    <p className="text-gray-600 text-center">Sé el primero en comentar ☕</p>
                ) : (
                    comments.map(comment => (
                        <div
                            key={comment.id || `${comment.user_name}-${comment.created_at}`}
                            className="bg-[#F5F0E6] p-4 rounded-lg border border-[#F4A698] shadow-sm"
                        >
                            <p className="text-sm text-gray-700 mb-1 font-medium">{comment.user_name}</p>
                            <p className="text-gray-800">{comment.content}</p>
                            <p className="text-xs text-gray-500 text-right mt-2">
                                {new Date(comment.created_at).toLocaleString()}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
