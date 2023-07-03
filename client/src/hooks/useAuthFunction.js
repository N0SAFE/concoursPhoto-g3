import { useAuthContext } from '@/contexts/AuthContext.jsx';

function useAuthFunction() {
    const { setToken, clearToken } = useAuthContext();

    function login({ identifier, password }) {
        return new Promise((resolve, reject) => {
            fetch(new URL(import.meta.env.VITE_API_URL + '/login_check'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: identifier,
                    password,
                }),
                credentials: 'include',
            })
                .then(res => res.json())
                .then(async data => {
                    if (data.code === 401) {
                        reject(data.message);
                        return;
                    }
                    resolve(await setToken(data.token));
                })
                .catch(error => {
                    console.error(error);
                    reject(error);
                });
        });
    }

    function register({
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
    }) {
        return fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identifier,
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
            .then(res => res.json())
            .then(data => {
                return login({ identifier, password });
            })
            .catch(error => {
                console.error(error);
            });
    }

    function logout() {
        return new Promise(async resolve => {
            resolve(clearToken());
        });
    }

    return {
        login,
        register,
        logout,
    };
}

export default useAuthFunction;
