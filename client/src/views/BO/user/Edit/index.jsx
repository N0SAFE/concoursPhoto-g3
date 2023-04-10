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
    const { getCityByCode } = useLocation();
    const { id: userId } = useParams();

    const [locationPossibility, updateLocationPossibility] = useLocationPosibility(["cities"], {}, { updateOnStart: false });
    const citiesPossibility = locationPossibility.citiesPossibility.map((c) => ({ label: `${c.nom} [${c.codesPostaux.join(",")}]`, value: c.code }));
    const postalCodesPossibility = [...new Set(locationPossibility.citiesPossibility.map((c) => c.codesPostaux).flat())].map((c) => ({ label: c, value: c }));
    const [locationPossibilityIsLoading, setLocationPossibilityIsLoading] = useState(false);

    const [entityPossibility, setEntityPossibility] = useState({ genders: [], statut: [] });
    const [entity, setEntity] = useState({
        state: false,
        email: "",
        password: "",
        passwordConfirm: "",
        firstname: "",
        lastname: "",
        address: "",
        city: "",
        postcode: "",
        phoneNumber: "",
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

    function getUser() {
        apiFetch("/users/" + userId, {
            method: "GET",
        })
            .then((r) => r.json())
            .then((data) => {
                console.debug(data);
                return Promise.all([getCityByCode(data.city)]).then(([city]) => {
                    const _user = {
                        state: data.state,
                        email: data.email,
                        firstname: data.firstname,
                        lastname: data.lastname,
                        address: data.address,
                        phoneNumber: data.phone_number,
                        roles: data.roles,
                        postcode: { value: data.postcode, label: data.postcode },
                        city: { label: city.nom, value: city.code },
                        gender: { label: data.gender.label, value: data.gender["@id"] },
                        statut: { label: data.personal_statut.label, value: data.personal_statut["@id"] },
                        dateOfBirth: new Date(data.date_of_birth),
                    };
                    console.debug(_user);
                    setEntity(_user);
                });
            });
    }

    useEffect(() => {
        const promise = Promise.all([getGendersPossibility(), getPersonalstatus(), getUser()]).then(([genders, statut]) => setEntityPossibility({ genders, statut }));
        toast.promise(promise, {
            pending: "Chargement des données",
            success: "Données chargées",
            error: "Erreur lors du chargement des données",
        });
    }, []);

    useEffect(() => {
        updateLocationPossibility({ args: { codeCity: entity.city?.value, postcode: entity.postcode?.value } }).then((d) => {
            if (d.length === 1 && d[0].id === "cities" && d[0].data.length === 1) {
                if (d[0].data[0].codesPostaux.length === 1 && !entity.postcode) {
                    setEntity({ ...entity, postcode: { label: d[0].data[0].codesPostaux[0], value: d[0].data[0].codesPostaux[0] } });
                } else if (!entity.city) {
                    setEntity({ ...entity, city: { label: d[0].data[0].nom, value: d[0].data[0].code } });
                }
            } // this if statement set the value of the city and postcode if there is only one possibility for the given value (lagny le sec {code: 60341} as one postcode so the postcode will be set in the entity)
            setLocationPossibilityIsLoading(false);
        });
    }, [entity.postcode, entity.city]);

    return (
        <div>
            <BOForm
                title="Modifier un utilisateur"
                handleSubmit={function () {
                    const data = {
                        state: entity.state,
                        email: entity.email,
                        plainPassword: entity.password || undefined,
                        firstname: entity.firstname,
                        lastname: entity.lastname,
                        address: entity.address,
                        city: entity.city.value,
                        postcode: entity.postcode.value,
                        phoneNumber: entity.phoneNumber,
                        gender: entity.gender.value,
                        personalStatut: entity.statut.value,
                        dateOfBirth: entity.dateOfBirth.toISOString(),
                    };
                    console.debug("data", data);
                    if (data.password !== data.passwordConfirm) {
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
                    <Input type="text" name="firstname" label="Prénom" extra={{ required: true }} onChange={(d) => updateEntity("firstname", d)} defaultValue={entity.firstname} />
                    <div>{errors.firstname}</div>
                </div>
                <div>
                    <label htmlFor="lastname">Nom</label>
                    <Input type="text" name="lastname" label="Nom" extra={{ required: true }} onChange={(d) => updateEntity("lastname", d)} defaultValue={entity.lastname} />
                    <div>{errors.lastname}</div>
                </div>
                <div>
                    <label htmlFor="dateOfBirth">Date de Naissance</label>
                    <Input type="date" name="dateOfBirth" label="Date de naissance" extra={{ required: true }} onChange={(d) => updateEntity("dateOfBirth", d)} defaultValue={entity.dateOfBirth} />
                    <div>{errors.dateOfBirth}</div>
                </div>
                <label htmlFor="statut">Statut</label>
                <Input
                    type="select"
                    name="personalStatut"
                    label="Statut"
                    extra={{ value: entity.statut, options: entityPossibility.statut, required: true }}
                    onChange={(d) => updateEntity("statut", d)}
                />
                <div>{errors.statut}</div>
                <div>
                    <label htmlFor="email">email</label>
                    <Input type="email" name="email" label="Adresse mail" extra={{ required: true }} onChange={(d) => updateEntity("email", d)} defaultValue={entity.email} />
                    <div>{errors.email}</div>
                </div>
                <div>
                    <label htmlFor="state">state</label>
                    <Input type="checkbox" name="state" label="Actif" defaultValue={entity.state} onChange={(d) => updateEntity("state", d)} />
                    <div>{errors.state}</div>
                </div>
                <div>
                    <label htmlFor="address">address</label>
                    <Input type="text" name="address" label="Adresse" defaultValue={entity.address} extra={{ required: true }} onChange={(d) => updateEntity("address", d)} />
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
                                isLoading: locationPossibilityIsLoading,
                                value: entity.city,
                                isClearable: true,
                                required: true,
                                options: citiesPossibility,
                                multiple: false,
                                onInputChange: (cityName, { action }) => {
                                    if (action === "menu-close") {
                                        updateLocationPossibility({ id: "city", args: { codeCity: entity.city?.value, city: "" } });
                                    }
                                    if (action === "input-change") {
                                        updateLocationPossibility({ id: "city", args: { city: cityName } });
                                    }
                                },
                            }}
                            onChange={(d) => updateEntity("city", d)}
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
                                isLoading: locationPossibilityIsLoading,
                                value: entity.postcode,
                                isClearable: true,
                                required: true,
                                options: postalCodesPossibility,
                                multiple: false,
                                onInputChange: (_postcode, { action }) => {
                                    if (action === "menu-close") {
                                        updateLocationPossibility({ id: "city", args: { postcode: entity.postcode?.value } });
                                    }
                                    if (action === "input-change" && _postcode.length === 5) {
                                        updateLocationPossibility({ id: "city", args: { postcode: _postcode } });
                                    }
                                },
                            }}
                            onChange={(d) => updateEntity("postcode", d)}
                        />
                        <div>{errors.postalCode}</div>
                    </div>
                </div>
                <div>
                    <label htmlFor="phoneNumber">phoneNumber</label>
                    <Input type="tel" name="phoneNumber" label="Numéro de téléphone" extra={{ required: true }} onChange={(d) => updateEntity("phoneNumber", d)} defaultValue={entity.phoneNumber} />
                    <div>{errors.phoneNumber}</div>
                </div>
                <div style={{ display: "flex", gap: "30px" }}>
                    <div>
                        <label htmlFor="gender">genre</label>
                        <Input
                            type="select"
                            name="gender"
                            label="Genre"
                            extra={{ value: entity.gender, options: entityPossibility.genders, required: true }}
                            onChange={(d) => updateEntity("gender", d)}
                        />
                        <div>{errors.gender}</div>
                    </div>
                </div>
                <div>
                    <label htmlFor="password">password</label>
                    <Input type="password" name="password" label="Mot de passe" onChange={(d) => updateEntity("password", d)} defaultValue={entity.password} />
                    <Input type="password" name="passwordConfirm" label="Confirmation du mot de passe" onChange={(d) => updateEntity("passwordConfirm", d)} defaultValue={entity.passwordConfirm} />
                    <div>{errors.password}</div>
                </div>
            </BOForm>
        </div>
    );
}
