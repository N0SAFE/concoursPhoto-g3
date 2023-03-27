import { useAuthContext } from "@/contexts/AuthContext.jsx";

function login(setToken, { email, password }) {
    return new Promise((resolve, reject) => {
        fetch(new URL(import.meta.env.VITE_API_URL + "/login_check"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.code === 401) {    
                    throw new Error(data.message);
                }
                console.log(data)
                if (!data.token) {
                    throw new Error("No token");
                }
                setToken(data.token);
                resolve();
            }).catch(error => {
                console.error(error);
                reject(error);
            });
    });
}

function register(setToken, { email, password, passwordverify, firstname, lastname, gender, address, postcode, city, country, birthofdate, username }) {
    return fetch("/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
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
    })
        .then(res => res.json())
        .then(data => {
            setToken(data.token);
            return data;
        })
        .catch(error => {
            console.log(error);
        });
}

function logout(setToken) {
    return new Promise((resolve)=> {
        setToken(null)
        resolve()
    })
}

function useAuth() {
    const { setToken } = useAuthContext();
    return {
        login: function({ email, password }) {
            return login(setToken, { email, password });
        },
        register: function({ email, password, passwordverify, firstname, lastname, gender, address, postcode, city, country, birthofdate, username }) {
            return register(setToken, { email, password, passwordverify, firstname, lastname, gender, address, postcode, city, country, birthofdate, username });
        },
        logout: function() {
            return logout(setToken);
        }
    };
}

export default useAuth;