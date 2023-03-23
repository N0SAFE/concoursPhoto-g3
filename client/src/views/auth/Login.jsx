import React from "react";
import useAuth from "../../hooks/useAuth.js";
import {useNavigate} from "react-router-dom";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        const { email, password } = e.target.elements;
        login({ email: email.value, password: password.value })
            .then(function() {
                navigate("/BO");
                console.log("Logged in");
            })
            .catch(function(error) {
                console.error(error);
            });
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
