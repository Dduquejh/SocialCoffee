import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.replace("#", ""));
        const idToken = params.get("id_token");

        if (idToken) {
        localStorage.setItem("id_token", idToken);
        navigate("/");
        } else {
        navigate("/login");
        }
    }, [navigate]);

    return <p>Autenticando...</p>;
}
