import { useAuthContext } from "@/contexts/AuthContext.jsx";

function login(checkLogged, { email, password }) {
    return new Promise((resolve, reject) => {
        fetch(new URL(import.meta.env.VITE_API_URL + "/login_check"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            }),
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                return checkLogged().then((isLogged) => {
                    if(!isLogged){
                        throw new Error("an error occured");
                    }
                    resolve();
                })
            }).catch(error => {
                console.error(error);
                reject(error);
            });
    });
}

function register(checkLogged, { email, password, passwordverify, firstname, lastname, gender, address, postcode, city, country, birthofdate, username }) {
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
            return login(checkLogged, { email, password })
        })
        .catch(error => {
            console.log(error);
        });
}

function logout(checkLogged) {
    return new Promise(async (resolve)=> {
        await fetch(new URL(import.meta.env.VITE_API_URL + "/logout"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
        checkLogged().then(()=> {
            resolve()
        })
    })
}

function useAuth() {
    const { checkLogged } = useAuthContext();
    return {
        login: function({ email, password }) {
            return login(checkLogged, { email, password });
        },
        register: function({ email, password, passwordverify, firstname, lastname, gender, address, postcode, city, country, birthofdate, username }) {
            return register(checkLogged, { email, password, passwordverify, firstname, lastname, gender, address, postcode, city, country, birthofdate, username });
        },
        logout: function() {
            return logout(checkLogged);
        }
    };
}

export default useAuth;