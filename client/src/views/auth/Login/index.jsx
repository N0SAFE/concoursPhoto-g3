import React from "react";
import useAuth from "@/hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/atoms/Icon";
import style from "./style.module.scss";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = e.target.elements;
        login({ email: email.value, password: password.value })
            .then(function () {
                navigate("/BO");
                console.log("Logged in");
            })
            .catch(function (error) {
                console.error(error);
            });
    };

    return (
        <div>
            <h1 className={style.title}>Connexion au BackOffice</h1>
            <form onSubmit={handleSubmit} className={style.input}>
                <label>
                    Email
                    <input name="email" type="email" placeholder="Email" />
                </label>
                <br />
                <label>
                    Password
                    <input name="password" type="password" placeholder="Password" />
                </label>
                <br />
                <button type="submit">
                    Login
                    <Icon icon="sign-out" size={20} color="black" />
                </button>
            </form>
        </div>
    );
}
