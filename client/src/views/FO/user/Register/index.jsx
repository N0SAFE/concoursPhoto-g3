import Input from "@/components/atoms/Input";
import BOForm from "@/components/organisms/BO/Form";
import useApiFetch from "@/hooks/useApiFetch";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import style from "./style.module.scss";
import Button from "@/components/atoms/Button/index.jsx";
import Modal from "@/components/atoms/Modal/index.jsx";

export default function UserRegister() {
    const apiFetch = useApiFetch();

    const [entityPossibility, setEntityPossibility] = useState({ genders: [], statut: [] });

    const [entity, setEntity] = useState({
        state: false,
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        roles: [],
        gender: "",
        statut: "",
        dateOfBirth: null,
    });

    const updateEntity = (key, value) => {
        setEntity({ ...entity, [key]: value });
    };

    const [errors, setErrors] = useState({});

    const getGendersPossibility = () => {
        return apiFetch("/genders", {
            method: "GET",
        })
            .then((r) => r.json())
            .then((data) => {
                return data["hydra:member"].map(function (item) {
                    return { label: item.label, value: item["@id"] };
                });
            });
    };
    const getPersonalstatus = () => {
        return apiFetch("/personal_statuts", {
            method: "GET",
        })
            .then((r) => r.json())
            .then((data) => {
                console.debug(data);
                return data["hydra:member"].map(function (item) {
                    return { label: item.label, value: item["@id"] };
                });
            });
    };

    useEffect(() => {
        const promise = Promise.all([getGendersPossibility(), getPersonalstatus()]).then(([genders, statut]) => setEntityPossibility({ genders, statut }));
        toast.promise(promise, {
            pending: "Chargement des possibilités",
            success: "Possibilités chargées",
            error: "Erreur lors du chargement des possibilités",
        });
    }, []);

    return (
        <div className={style.registerContainer}>
            <div className={style.registerTrailer}>
                <h2>Inscription</h2>
                <span>Créez votre compte membre, c’est gratuit !</span>
                <span>Vous pourrez voter et participer en tant que photographe aux <br /> concours proposés. Si vous représentez une organisation et <br /> souhaitez publier un concours, créez d’abord votre compte.</span>
            </div>
            <BOForm
                className={style.registerForm}
                handleSubmit={async function () {
                    const data = {
                        state: true,
                        email: entity.email,
                        firstname: entity.firstname,
                        lastname: entity.lastname,
                        roles: ["ROLE_MEMBER"],
                        personalStatut: entity.statut.value,
                        dateOfBirth: entity.dateOfBirth.toISOString(),
                        creationDate: new Date().toISOString(),
                        registrationDate: new Date().toISOString(),
                        country: "FRANCE",
                        isVerified: false,
                        plainPassword: entity.password || undefined,
                    };
                    console.debug("data", data);
                    if (data.firstname && data.lastname && data.dateOfBirth && data.personalStatut && data.email) {
                        if (!data.plainPassword) {
                            console.debug("Le mot de passe est obligatoire");
                            return;
                        } else if (data.plainPassword.length < 8) {
                            console.debug("Le mot de passe doit faire minimum 8 caractères !");
                            // setErrors({plainPassword: "Le mot de passe doit faire minimum 8 caractères !"});
                            return;
                        } else if (!data.plainPassword.match(/^(?=.*[A-Z])(?=.*\d).+$/)) {
                            console.debug("Le mot de passe doit contenir au moins une lettre majuscule et un chiffre !");
                            // setErrors({plainPassword: "Le mot de passe doit contenir au moins une lettre majuscule et un chiffre !"});
                            return;
                        }
                        const promise = apiFetch("/users", {
                            method: "POST",
                            body: JSON.stringify(data),
                            headers: {
                                "Content-Type": "application/json",
                            },
                        })
                            .then((r) => r.json())
                            .then((data) => {
                                if (data["@type"] === "hydra:Error") {
                                    throw data;
                                }
                            });
                        toast.promise(promise, {
                            pending: "Inscription de l'utilisateur",
                            success: "Vous êtes inscrit",
                            error: {
                                render: ({ data }) => {
                                    console.debug(data);
                                    if (data["@type"] === "hydra:Error") {
                                        return data["hydra:description"];
                                    }
                                    return data.message;
                                },
                            },
                        });
                    }
                }}
                hasSubmit={true}
            >
                <div>
                    <Input type="text" name="Prénom" label="Prénom*" extra={{ required: true }} onChange={(d) => updateEntity("firstname", d)} defaultValue={entity.firstname} />
                    <Input type="text" name="lastname" label="Nom*" extra={{ required: true }} onChange={(d) => updateEntity("lastname", d)} defaultValue={entity.lastname} />
                    <div className={style.group}>
                        <div>
                            <Input type="date" name="dateOfBirth" label="Date de naissance*" extra={{ required: true }} onChange={(d) => updateEntity("dateOfBirth", d)} defaultValue={entity.dateOfBirth} />
                        </div>
                        <div>
                            <Input
                                type="select"
                                name="personalStatut"
                                label="Vous êtes*"
                                defaultValue={entity.statut}
                                extra={{ options: entityPossibility.statut, required: true }}
                                onChange={(d) => updateEntity("statut", d)}
                            />
                        </div>
                    </div>
                    <Input type="email" name="email" label="Adresse mail*" extra={{ required: true }} onChange={(d) => updateEntity("email", d)} defaultValue={entity.email} />
                    <Input type="password" name="password" label="Mot de passe*" extra={{ required: true, placeholder: "8 caractères min dont 1 chiffre et 1 lettre majuscule" }} onChange={(d) => updateEntity("password", d)} defaultValue={entity.password} />
                    <div className={style.registerRule}>
                        <Input type="checkbox" />
                        <p>En cochant cette case, j'accepte les <span>conditions générales d'utilisation</span> ainsi que la <span>politique d'utilisation</span> de mes données personnelles.</p>
                    </div>
                    <div className={style.registerSubmit}>
                        <Button type="submit" name="Créer mon compte" color={"black"} textColor={"white"} padding={"14px 30px"} border={false} borderRadius={"44px"} width={"245px"} />
                    </div>
                    <p className={style.registerProposition}>Vous avez déjà un compte ? <a>Connectez-vous</a></p>
                </div>
            </BOForm>
        </div>
    );
}
