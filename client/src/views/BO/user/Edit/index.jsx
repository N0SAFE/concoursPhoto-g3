import Input from "@/components/atoms/Input/index.jsx";
import BOForm from "@/components/organisms/BO/Form";
import useApiFetch from "@/hooks/useApiFetch.js";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useLocationPosibility from "@/hooks/useLocationPosibility.js";
import useLocation from "@/hooks/useLocation.js";
import { toast } from "react-toastify";

export default function UserCreate() {
    const apiFetch = useApiFetch();
    const { id: userId } = useParams();

    const { getCityByCode } = useLocation();

    const [entityPossibility, setEntityPossibility] = useState({ genders: [] });
    const [possibility, updatePossibility] = useLocationPosibility(["cities"], {}, { updateOnStart: false });
    const citiesPossibility = possibility.citiesPossibility.map((c) => ({ label: `${c.nom} [${c.codesPostaux.join(",")}]`, value: c.code }));
    const postalCodesPossibility = [...new Set(possibility.citiesPossibility.map((c) => c.codesPostaux).flat())].map((c) => ({ label: c, value: c }));

    const getGendersPossibility = () => {
        return apiFetch("/genders", {
            method: "GET",
        })
            .then((r) => r.json())
            .then((data) => {
                console.debug(data);
                return data["hydra:member"].map(function (item) {
                    return { label: item.label, value: item.id };
                });
            });
    };

    function getUser() {
        apiFetch("/users/" + userId, {
            method: "GET",
        })
            .then((r) => r.json())
            .then((data) => {
                console.debug(data);
                setGender({ label: data.gender.label, value: data.gender.id });
                setState(data.state);
                setEmail(data.email);
                setFirstname(data.firstname);
                setLastname(data.lastname);
                setAddress(data.address);
                setPhoneNumber(data.phone_number);
                setRoles(data.roles);
                setPostcode({ value: data.postcode, label: data.postcode });
                getCityByCode(data.city).then((city) => {
                    setCity({ label: city.nom, value: city.code });
                });
            });
    }

    const [state, setState] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postcode, setPostcode] = useState();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [roles, setRoles] = useState([]);
    const [errors, setErrors] = useState({});
    const [gender, setGender] = useState();

    useEffect(() => {
        const promise = Promise.all([getGendersPossibility(), getUser()]).then(([genders]) => setEntityPossibility({ genders }));
        toast.promise(promise, {
            pending: "Chargement des données",
            success: "Données chargées",
            error: "Erreur lors du chargement des données",
        });
    }, []);

    useEffect(() => {
        updatePossibility({ args: { codeCity: city?.value, postcode: postcode?.value } });
    }, [postcode, city]);

    return (
        <div>
            <BOForm
                title="Modifier un utilisateur"
                handleSubmit={function () {
                    console.debug("handleSubmit");
                    console.debug("fetch");
                    const data = {
                        state,
                        email,
                        plainPassword: password || undefined,
                        firstname,
                        lastname,
                        address,
                        city: city.value,
                        postcode: postcode.value,
                        phoneNumber,
                        gender: "/api/genders/" + gender.value,
                        // dateOfBirth: new Date().toISOString(),
                        // country: "France",
                        // isVerified: true,
                    };
                    console.debug("data", data);
                    if (password !== passwordConfirm) {
                        setErrors({ password: "Les mots de passe ne correspondent pas" });
                        return;
                    }
                    const promise = apiFetch("/users/" + userId, {
                        method: "PATCH",
                        body: JSON.stringify(data),
                        headers: {
                            "Content-Type": "application/merge-patch+json",
                        },
                    })
                        .then((r) => r.json())
                        .then((data) => {
                            console.debug(data);
                            if (data["@type"] === "hydra:Error") {
                                throw new Error(data.description);
                            }
                        });

                    toast.promise(promise, {
                        pending: "Modification en cours",
                        success: "Utilisateur modifié",
                        error: "Erreur lors de la modification de l'utilisateur",
                    });
                }}
            >
                <div>
                    <label htmlFor="firstname">Prenom</label>
                    <Input type="text" name="firstname" label="Prénom" extra={{ required: true }} setState={setFirstname} defaultValue={firstname} />
                    <div>{errors.firstname}</div>
                </div>
                <div>
                    <label htmlFor="lastname">Nom</label>
                    <Input type="text" name="lastname" label="Nom" extra={{ required: true }} setState={setLastname} defaultValue={lastname} />
                    <div>{errors.lastname}</div>
                </div>
                <div>
                    <label htmlFor="email">email</label>
                    <Input type="email" name="email" label="Adresse mail" extra={{ required: true }} setState={setEmail} defaultValue={email} />
                    <div>{errors.email}</div>
                </div>
                <div>
                    <label htmlFor="state">state</label>
                    <Input type="checkbox" name="state" label="Actif" defaultValue={state} setState={setState} />
                    <div>{errors.state}</div>
                </div>
                <div>
                    <label htmlFor="address">address</label>
                    <Input type="text" name="address" label="Adresse" defaultValue={address} extra={{ required: true }} setState={setAddress} />
                    <div>{errors.address}</div>
                </div>
                <div style={{ display: "flex", gap: "30px" }}>
                    <div>
                        <label htmlFor="city">city</label>
                        <Input
                            type="select"
                            name="city"
                            label="Ville"
                            extra={{
                                value: city,
                                isClearable: true,
                                required: true,
                                options: citiesPossibility,
                                multiple: false,
                                onInputChange: (text, { action }) => {
                                    if (action === "menu-close") {
                                        updatePossibility({ id: "city" });
                                    }
                                    if (action === "input-change") {
                                        updatePossibility({ id: "city", args: { name: text } });
                                    }
                                },
                            }}
                            setState={setCity}
                        />
                        <div>{errors.city}</div>
                    </div>
                    <div>
                        <label htmlFor="postalCode">postalCode</label>
                        <Input
                            type="select"
                            name="postalCode"
                            label="Code postal"
                            extra={{
                                value: postcode,
                                isClearable: true,
                                required: true,
                                options: postalCodesPossibility,
                                multiple: false,
                                onInputChange: (postcode, { action }) => {
                                    if (action === "menu-close") {
                                        updatePossibility({ id: "city" });
                                    }
                                    if (action === "input-change" && postcode.length === 5) {
                                        updatePossibility({ id: "city", args: { postcode } });
                                    }
                                },
                            }}
                            setState={setPostcode}
                        />
                        <div>{errors.postalCode}</div>
                    </div>
                </div>
                <div>
                    <label htmlFor="phoneNumber">phoneNumber</label>
                    <Input type="tel" name="phoneNumber" label="Numéro de téléphone" extra={{ required: true }} setState={setPhoneNumber} defaultValue={phoneNumber} />
                    <div>{errors.phoneNumber}</div>
                </div>
                <div style={{ display: "flex", gap: "30px" }}>
                    <div>
                        <label htmlFor="gender">genre</label>
                        <Input type="select" name="gender" label="Genre" extra={{ value: gender, options: entityPossibility.genders, required: true }} setState={setGender} />
                        <div>{errors.gender}</div>
                    </div>
                </div>
                <div>
                    <label htmlFor="password">password</label>
                    <Input type="password" name="password" label="Mot de passe" setState={setPassword} defaultValue={password} />
                    <Input type="password" name="passwordConfirm" label="Confirmation du mot de passe" setState={setPasswordConfirm} defaultValue={passwordConfirm} />
                    <div>{errors.password}</div>
                </div>
            </BOForm>
        </div>
    );
}
