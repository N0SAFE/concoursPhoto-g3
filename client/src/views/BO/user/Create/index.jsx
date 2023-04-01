import Input from "@/components/atoms/Input/index.jsx";
import BOCreate from "@/components/organisms/BO/Create";
import useApiFetch from "@/hooks/useApiFetch.js";
import useLocationPosibility from "@/hooks/useLocationPosibility.js";
import { useState, useEffect } from "react";

export default function UserCreate() {
    const apiFetch = useApiFetch();

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

    const [state, setState] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState();
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState();
    const [postcode, setPostcode] = useState();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [errors, setErrors] = useState({});
    const [gender, setGender] = useState();
    const [dateOfBirth, setDateOfBirth] = useState();

    useEffect(() => {
        Promise.all([getGendersPossibility()]).then(([genders]) => {
            setEntityPossibility({ genders });
        });
    }, []);

    useEffect(() => {
        updatePossibility({ args: { codeCity: city?.value, postcode: postcode?.value } });
    }, [postcode, city]);

    return (
        <div>
            <h1>Ajout d'un utilisateur</h1>
            <BOCreate
                handleSubmit={function () {
                    console.debug("handleSubmit");
                    console.debug("fetch");
                    const data = {
                        state,
                        email,
                        password,
                        passwordConfirm,
                        firstname,
                        lastname,
                        address,
                        city: city.value,
                        postcode: postcode.value,
                        phoneNumber,
                        role: [],
                        gender: "/api/genders/" + gender.value,
                        creationDate: new Date().toISOString(),
                        dateOfBirth: new Date().toISOString(),
                        country: "France",
                        isVerified: true,
                    };
                    console.debug("data", data);
                    if (password !== passwordConfirm) {
                        setErrors({ password: "Les mots de passe ne correspondent pas" });
                        return;
                    }
                    apiFetch("/users", {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                        .then((r) => r.json())
                        .then((data) => {
                            console.debug(data);
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
                    <label htmlFor="dateOfBirth">dateOfBirth</label>
                    <Input type="date" name="dateOfBirth" label="Date de Naissance" extra={{ required: true }} setState={setDateOfBirth} defaultValue={dateOfBirth} />
                    <div>{errors.dateOfBirth}</div>
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
                        <Input type="select" name="gender" label="Genre" extra={{ value: gender, required: true, options: entityPossibility.genders }} setState={setGender} />
                        <div>{errors.gender}</div>
                    </div>
                </div>
                <div>
                    <label htmlFor="password">password</label>
                    <Input type="password" name="password" label="Mot de passe" extra={{ required: true }} setState={setPassword} defaultValue={password} />
                    <Input type="password" name="passwordConfirm" label="Confirmation du mot de passe" extra={{ required: true }} setState={setPasswordConfirm} defaultValue={passwordConfirm} />
                    <div>{errors.password}</div>
                </div>
            </BOCreate>
        </div>
    );
}
