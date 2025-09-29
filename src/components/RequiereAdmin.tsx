import { Navigate } from "react-router-dom";
import { getUserGroupsFromToken } from "../lib/auth";
import type { JSX } from "react";

export default function RequireAdmin({ children }: { children: JSX.Element }) {
    const groups = getUserGroupsFromToken();
    const isAdmin = groups.includes("admin");

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}
