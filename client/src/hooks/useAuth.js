import { useAuthContext } from "../contexts/AuthContext.jsx";

function login({email, password}) {
    const { setToken } = useAuthContext();
    return fetch('/api/login_check', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    }).then(res => res.json()).then(data => {
        setToken(data.token);
        return data;
    });
}

function register({email, password, passwordverify, firstname, lastname, gender, address, postcode, city, country, birthofdate, username}){
    const { setToken } = useAuthContext();
    return fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password,
            passwordverify,
            firstname,
            lastname,
            gender,
            address,
            postcode,
            city,
            country,
            birthofdate,
            username
        })
    }).then(res => res.json()).then(data => {
        setToken(data.token);
        return data;
    }).catch(error => {
        console.log(error);
    });
}

function logout(){
    const { setToken } = useAuthContext();
    setToken(null);
}

function useAuth() {
    return {
        login,
        register,
        logout
    }
}

export default useAuth;