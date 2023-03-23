import {createContext, useContext, useEffect, useState} from "react";

const AuthContext = createContext({
    token: null
});

function AuthProvider(props) {
    const [token, _setToken] = useState(localStorage.getItem('token'));
    
    function setToken(newToken){
        if(newToken){
            localStorage.setItem('token', newToken);
        }else {
            localStorage.removeItem('token')
        }
        _setToken(localStorage.getItem('token'));
    }

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