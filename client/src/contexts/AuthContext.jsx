import Loader from '@/components/atoms/Loader/index.jsx';
import useLocation from '@/hooks/useLocation.js';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({
    clearToken: () => {},
    setToken: () => {},
    isLogged: () => false,
    me: null,
    token: null,
});

function AuthProvider(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [refreshToken, setRefreshToken] = useState(
        localStorage.getItem('refreshToken') || null
    );
    const [me, setMe] = useState(null);
    const { getCityByCode, getDepartmentByCode, getRegionByCode } =
        useLocation();
        
    async function refreshUser(){
        retrieveUser(token, refreshToken)
    }

    async function retrieveUser(token, refreshToken, {resetOnRefreshToken = true} = {}) {
        try {
            const whoami = await fetch(
                new URL(import.meta.env.VITE_API_URL + '/whoami').href,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    headers: token
                        ? {
                              Authorization: `Bearer ${token}`,
                          }
                        : {},
                }
            );
            const data = await whoami.json().then(async d => {
                try {
                    return {
                    ...d,
                    city: await getCityByCode(d.citycode),
                };
                }catch(e){
                    return {
                        ...d, 
                        city: {}
                    }
                }
            });
            console.log(data);
            setMe(data);
            console.group('AuthContext');
            console.debug('isLogged: ', true);
            console.debug('me: ', data);
            console.groupEnd();
            return { isLogged: true, me: data };
        } catch (e) {
            console.error(e);
            setMe(null);
            console.group('AuthContext');
            console.debug('isLogged: ', false);
            console.debug('me: ', null);
            console.groupEnd();
            return { isLogged: false, me: null };
        }
    }

    const updateToken = async (token, refreshToken) => {
        
        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        }

        console.log('updateToken', token);
        console.log('updateRefreshToken', refreshToken);
        if (token) {
            setIsLoading(true);
            return await retrieveUser(token, refreshToken).then(ret => {
                setIsLoading(false);
                return ret;
            });
        } else {
            setIsLoading(false);
            setMe(null);
            console.log("no token, don't retrieve user");
            return { isLogged: false, me: null };
        }
    };


    useEffect(() => {
        updateToken(token, refreshToken);
    }, []);

    console.log('AuthContext', me);

    return (
        <AuthContext.Provider
            value={{
                clearToken: () => {
                    setToken(null);
                    return updateToken(null);
                },
                setToken: token => {
                    setToken(token);
                    return updateToken(token);
                },
                isLogged: function () {
                    return !!me;
                },
                refreshUser,
                me,
                token,
            }}
        >
            {isLoading ? <Loader active={true} /> : props.children}
        </AuthContext.Provider>
    );
}

function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export { AuthProvider, useAuthContext };
