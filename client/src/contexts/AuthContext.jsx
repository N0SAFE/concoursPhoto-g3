import {createContext, useContext, useEffect, useState} from "react";

const AuthContext = createContext({
    token: null
});

function AuthProvider(props) {
    const [token, _setToken] = useState(null);
    
    function setToken(newToken){
        localStorage.setItem('token', newToken);
        _setToken(newToken);
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            _setToken(token);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {props.children}
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