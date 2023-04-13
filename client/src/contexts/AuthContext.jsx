import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
    token: null,
});

function AuthProvider(props) {
    const [isLogged, setIsLogged] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [me, setMe] = useState(null);

    function checkLogged(controller) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(new URL(import.meta.env.VITE_API_URL + "/token/refresh").href, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    signal: controller?.signal,
                });
                if (response.ok) {
                    const whoami = await fetch(new URL(import.meta.env.VITE_API_URL + "/whoami").href, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        signal: controller?.signal,
                    });
                    const data = await whoami.json();
                    setMe(data);
                    setIsLogged(true);
                    console.group("AuthContext");
                    console.debug("isLogged: ", true);
                    console.debug("me: ", data);
                    console.groupEnd();
                    resolve({ isLogged: true, me: data });
                    return;
                } else {
                    setIsLogged(false);
                    setMe(null);
                    console.group("AuthContext");
                    console.debug("isLogged: ", false);
                    console.debug("me: ", null);
                    console.groupEnd();
                    resolve({ isLogged: false, me: null });
                    return;
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    useEffect(() => {
        const controller = new AbortController();
        checkLogged(controller).then(() => {
            setIsLoading(false);
        });
        return () => controller.abort();
    }, []);

    return <AuthContext.Provider value={{ isLogged, checkLogged, me }}>{!isLoading && props.children}</AuthContext.Provider>;
}

function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export { AuthProvider, useAuthContext };
