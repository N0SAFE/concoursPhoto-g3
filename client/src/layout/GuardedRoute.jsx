import { useAuthContext } from '@/contexts/AuthContext.jsx';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

export default function ({ fallback, verify = () => true }) {
    const auth = useAuthContext();
    const ret = verify(auth);
    const { state, context } = (() => {
        if (typeof ret === 'boolean') {
            return { state: ret };
        } else {
            if (typeof ret.state !== 'boolean') {
                throw new Error(
                    'the state property must be a boolean when an object is return from the verify function on a guarded route'
                );
            }
            return ret;
        }
    })();

    const [Fallback, setFallback] = useState(null);
    useEffect(() => {
        if (typeof fallback === 'function' && !state) {
            setFallback(fallback(auth, { context }));
        }
    }, [ret]);

    if (state) {
        return <Outlet context={context} />;
    }

    if (typeof fallback === 'function') {
        return <>{Fallback}</>;
    }
    return <>{fallback}</>;
}
