import React from "react";
import useAuth from "@/hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import style from "./style.module.scss";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = e.target.elements;
        login({ email: email.value, password: password.value })
            .then(function (me) {
                console.log(me)
                if (me.roles.includes("ROLE_ADMIN")) {
                    navigate("/BO");
                } else {
                    navigate("/");
                }
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
                    <Input name="email" type="email" placeholder="Email" />
                </label>
                <label>
                    Password
                    <Input name="password" type="password" placeholder="Password" />
                </label>
                <Button type="submit" name="Login" />
            </form>
        </div>
    );
}
