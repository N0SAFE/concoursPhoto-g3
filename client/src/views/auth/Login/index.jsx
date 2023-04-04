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
        login({ email: email.value, password: password.value })
            .then(function (me) {
                console.log(me)
                if (me.roles.includes("ROLE_ADMIN")) {
                    navigate("/BO");
                } else {
                    navigate("/");
                }
                toast.success("Vous êtes connecté");
            })
            .catch(function (error) {
                toast.error(error.message);
                console.error(error);
            });
    };

    return (
        <div className={style.container}>
            <div>
                <h1 className={style.title}>Connexion au BackOffice</h1>
            </div>
            <div>
                <form onSubmit={handleSubmit} className={style.input}>
                    <div>
                        <div>
                            <label>Adresse mail</label>
                        </div>
                        <div>
                            <Input name="email" type="email" placeholder="Email" />
                        </div>
                    </div>
                    <div>
                        <div>
                            <label>Mot de passe</label>
                        </div>
                        <div>
                            <Input name="password" type="password" placeholder="Password" />
                        </div>
                    </div>
                    <div className={style.containerButton}>
                        <Button type="submit" name="Login" color={"green"} textColor={"white"} padding={"5px"} border={false} borderRadius={"10px"}/>
                    </div>
                </form>
            </div>
        </div>
    );
}
