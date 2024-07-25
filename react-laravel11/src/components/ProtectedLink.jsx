import React from 'react';
import { Link } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';

const ProtectedLink = ({ to, requiredAccess, children }) => {
    const { user } = useStateContext();

    const hasAccess = user && user.accesses && user.accesses.some(access => access.akses === requiredAccess);

    if (!hasAccess) {
        return null;
    }

    return <Link to={to}>{children}</Link>;
};

export default ProtectedLink;
