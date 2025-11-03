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

export function isTokenValid(token: string | null): boolean {
    if (!token) return false;
    try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        const now = Math.floor(Date.now() / 1000);
        return decoded.exp && decoded.exp > now;
    } catch (err) {
        console.error("Error al validar token:", err);
        return false;
    }
}
