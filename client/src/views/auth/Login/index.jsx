import React from "react";
import useAuth from "@/hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import style from "./style.module.scss";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { toast } from "react-toastify";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = e.target.elements;
        const promise = login({ email: email.value, password: password.value }).then(function (me) {
            console.debug(me);
            if (me.roles.includes("ROLE_ADMIN")) {
                navigate("/BO");
            } else {
                navigate("/");
            }
        });
        toast.promise(promise, {
            pending: "Connexion en cours",
            success: "Connexion réussie",
            error: {
                render({ data }) {
                    return data.message;
                },
            },
        });
    };

    return (
        <div className={style.container}>
            <div>
                <h1>Se connecter</h1>
            </div>
            <div>
                <form onSubmit={handleSubmit} className={style.input}>
                    <div>
                        <div>
                            <Input label="Email" name="email" type="email" placeholder="Email" />
                        </div>
                    </div>
                    <div>
                        <div>
                            <Input label="Mot de passe" name="password" type="password" placeholder="Password" />
                        </div>
                    </div>
                    <div className={style.containerButton}>
                        <Button type="submit" name="Login" color={"green"} textColor={"white"} padding={"5px"} border={false} borderRadius={"10px"} />
                    </div>
                </form>
            </div>
        </div>
    );
}
