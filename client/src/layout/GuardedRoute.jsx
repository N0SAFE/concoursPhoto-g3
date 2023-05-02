import { useAuthContext } from '@/contexts/AuthContext.jsx';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

export default function ({ fallback, verify = () => true }) {
    const auth = useAuthContext();
    if (verify(auth)) {
        return <Outlet />;
    }
    const [Fallback, setFallback] = useState(null);
    useEffect(() => {
        setFallback(fallback(auth));
    }, []);

    if (typeof fallback === 'function') {
        return <>{Fallback}</>;
    }
    return <>{fallback}</>;
}
