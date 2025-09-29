export function getUserEmailFromToken(): string | null {
    const token = localStorage.getItem("id_token");
    if (!token) return null;

    try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        return decoded.email || null;
    } catch (err) {
        console.error("Error al decodificar el token:", err);
        return null;
    }
}

export function getUserGroupsFromToken(): string[] {
    const token = localStorage.getItem("id_token");
    if (!token) return [];

    try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        return decoded["cognito:groups"] || [];
    } catch (err) {
        console.error("Error decoding token:", err);
        return [];
    }
}
