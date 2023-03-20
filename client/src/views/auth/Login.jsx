import React from "react";
import {useAuthContext} from "../../contexts/AuthContext";

export default function Login() {
    const { setToken } = useAuthContext();

    const handleSubmit = async e => {
        e.preventDefault();
        const { email, password } = e.target.elements;
        try {
            console.log(fetch("/api/login_check"))
            await fetch("/api/login_check", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.value,
                    password: password.value
                })
            })
                .then(res => res.text())
                .then(data => {
                    console.log(data);
                    return data;
                }).catch(error => {
                    console.log(error);
                });
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Email
                    <input name="email" type="email" placeholder="Email" />
                </label>
                <label>
                    Password
                    <input name="password" type="password" placeholder="Password" />
                </label>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
