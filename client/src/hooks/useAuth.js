import { useAuthContext } from "@/contexts/AuthContext.jsx";

function login(checkLogged, { email, password }, autoLogoutOnFail = true) {
    return new Promise((resolve, reject) => {
        fetch(new URL(import.meta.env.VITE_API_URL + "/login_check"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
            credentials: "include",
        })
            .then((res) => res.json())
            .then(async (data) => {
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                return await checkLogged().then(({ isLogged, me }) => {
                    if (!isLogged) {
                        if (autoLogoutOnFail) {
                            return logout(checkLogged).then(() => { // this function is used to avoid fail when the refresh token is not the good one so we remove it to recreate it after
                                return login(checkLogged, { email, password }, false).then(function(){
                                    checkLogged().then(function({ isLogged, me }){
                                        if(!isLogged){
                                            throw new Error("an error occured");
                                        }
                                        resolve(me);
                                    })
                                })
                            });
                        }else {
                            throw new Error("an error occured");
                        }
                    }
                    resolve(me);
                });
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

function register(checkLogged, { email, password, passwordverify, firstname, lastname, gender, address, postcode, city, country, birthofdate, username }) {
    return fetch("/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
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
            username,
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            return login(checkLogged, { email, password });
        })
        .catch((error) => {
            console.error(error);
        });
}

function logout(checkLogged) {
    return new Promise(async (resolve) => {
        await fetch(new URL(import.meta.env.VITE_API_URL + "/logout"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        checkLogged().then(() => {
            resolve();
        });
    });
}

function useAuth() {
    const { checkLogged } = useAuthContext();
    return {
        login: function ({ email, password }) {
            return login(checkLogged, { email, password });
        },
        register: function ({ email, password, passwordverify, firstname, lastname, gender, address, postcode, city, country, birthofdate, username }) {
            return register(checkLogged, { email, password, passwordverify, firstname, lastname, gender, address, postcode, city, country, birthofdate, username });
        },
        logout: function () {
            return logout(checkLogged);
        },
    };
}

export default useAuth;
