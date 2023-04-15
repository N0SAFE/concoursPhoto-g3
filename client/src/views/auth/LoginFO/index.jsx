import useAuth from "@/hooks/useAuth.js";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import BOForm from "@/components/organisms/BO/Form";
import {useState} from "react";
import style from "./style.module.scss";

export default function LoginFO() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [identifier, setIdentifier] = useState("");

    return (
        <BOForm
            handleSubmit={async function () {
                const promise = login({ identifier: identifier, password: password }).then(function (me) {
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
            }}
            hasSubmit={true}
        >
            <div className={style.loginTrailer}>
                <h2>Connexion</h2>
                <span>Veuillez vous identifier pour pouvoir voter et participer.</span>
                <span>Si vous n'avez pas de compte, <a>inscrivez-vous</a>, c'est gratuit.</span>
            </div>
            <div>
                <Input label="Email ou pseudo*" name="email" type="email" placeholder="Email" onChange={setIdentifier} />
                <Input label="Mot de passe*" name="password" type="password" placeholder="Password" onChange={setPassword} />
                <div className={style.loginSubmit}>
                    <Button type="submit" name="Se connecter" color={"black"} textColor={"white"} padding={"14px 30px"} border={false} borderRadius={"44px"} width={"245px"} />
                </div>
            </div>
        </BOForm>
    );
}
