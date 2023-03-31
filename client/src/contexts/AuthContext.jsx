import {createContext, useContext, useEffect, useState} from "react";

const AuthContext = createContext({
    token: null
});

function AuthProvider(props) {
    const [isLogged, setIsLogged] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [me, setMe] = useState(null);
    
    async function checkLogged(){
        const response = await fetch(new URL(import.meta.env.VITE_API_URL + "/token/refresh").href, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
        })
        if(response.ok){
            const whoami = await fetch(new URL(import.meta.env.VITE_API_URL + "/whoami").href, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
            })
            const data = await whoami.json();
            setMe(data);
            setIsLogged(true);
            return {isLogged: true, me: data}
        }else {
            setIsLogged(false);
            setMe(null);
            return {isLogged: false, me: null}
        }
    }
    
    useEffect(() => {
        checkLogged().then(() => {
            setIsLoading(false);
        })
    }, [])

    return (
        <AuthContext.Provider value={{ isLogged, checkLogged, me }}>
            {!isLoading && props.children}
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