import BOForm from "@/components/organisms/BO/Form/index.jsx";
import Input from "@/components/atoms/Input/index.jsx";
import {toast} from "react-toastify";
import {useState} from "react";
import useApiFetch from "@/hooks/useApiFetch.js";
import {useNavigate, useParams} from "react-router-dom";
import {useAuthContext} from "@/contexts/AuthContext.jsx";


export default function Profile() {

    const { me } = useAuthContext();

    const [email, setEmail] = useState(me?.email);
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [errors, setErrors] = useState({});
    const apiFetch = useApiFetch()

    const navigate = useNavigate();

    return (
        <div>
            <h1>Profil</h1>
            <BOForm
                handleSubmit={function () {
                    console.debug("handleSubmit");
                    console.debug("fetch");
                    const data = {
                        email: email,
                        plainPassword: password || undefined,
                    };
                    console.debug("data", data);
                    if (password !== passwordConfirm) {
                        setErrors({ password: "Les mots de passe ne correspondent pas" });
                        return;
                    }
                    const promise = apiFetch("/users/" + me.id , {
                        method: "PATCH",
                        body: JSON.stringify(data),
                        headers: {
                            "Content-Type": "application/merge-patch+json",
                        },
                    }).then(r => r.json()).then((data) => {
                        console.debug(data)
                        if (data['@type'] === "hydra:Error") {
                            console.error(data);
                            throw new Error(data.description);
                        }
                        navigate('/auth/logout')
                    });

                    toast.promise(promise, {
                        pending: "Modification en cours",
                        success: "Votre utilisateur a bien été modifié",
                        error: "Erreur lors de la modification de votre profil",
                    });
                }}
            >
                <div>
                    <label htmlFor="firstname">Adresse mail</label>
                    <Input type="email" name="email" label="Adresse email" extra={{ required: true }} setState={setEmail} defaultValue={me.email} />
                    <div>{errors.email}</div>
                </div>
                <div>
                    <label htmlFor="password">password</label>
                    <Input type="password" name="password" label="Mot de passe" setState={setPassword} defaultValue={password} />
                    <Input type="password" name="passwordConfirm" label="Confirmation du mot de passe" setState={setPasswordConfirm} defaultValue={passwordConfirm} />
                    <div>{errors.password}</div>
                </div>
            </BOForm>
        </div>
    )
}
