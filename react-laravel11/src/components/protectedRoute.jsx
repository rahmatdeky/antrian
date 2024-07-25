import React from "react";
import { Navigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

const ProtectedRoute = ({ children, requiredAccess }) => {
    const { user } = useStateContext();
    const hasAccess = user && user.accesses && user.accesses.some(access => access.akses === requiredAccess);

    if (!hasAccess) {
        return <Navigate to="/403" />
    }

    return children;
}

export default ProtectedRoute;