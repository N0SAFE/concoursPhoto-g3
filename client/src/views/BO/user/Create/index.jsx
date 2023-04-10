import Input from "@/components/atoms/Input/index.jsx";
import BOForm from "@/components/organisms/BO/Form";
import useApiFetch from "@/hooks/useApiFetch.js";
import useLocationPosibility from "@/hooks/useLocationPosibility.js";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function UserCreate() {
    const apiFetch = useApiFetch();

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

    useEffect(() => {
        const promise = Promise.all([getGendersPossibility(), getPersonalstatus()]).then(([genders, statut]) => setEntityPossibility({ genders, statut }));
        toast.promise(promise, {
            pending: "Chargement des possibilités",
            success: "Possibilités chargées",
            error: "Erreur lors du chargement des possibilités",
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
                title="Ajouter un utilisateur"
                handleSubmit={async function () {
                    const { codeRegion, codeDepartement } = await fetch(`https://geo.api.gouv.fr/communes/${entity.city.value}?fields=codeRegion,codeDepartement&format=json&geometry=centre`)
                        .then((r) => r.json())
                        .catch((e) => {
                            console.error(e);
                            throw new Error("500: the city code is not valid on the gouv api");
                        });
                    const data = {
                        state: entity.state,
                        email: entity.email,
                        plainPassword: entity.password || undefined,
                        firstname: entity.firstname,
                        lastname: entity.lastname,
                        address: entity.address,
                        city: entity.city.value,
                        department: codeDepartement,
                        region: codeRegion,
                        postcode: entity.postcode.value,
                        phoneNumber: entity.phoneNumber,
                        role: [],
                        gender: entity.gender.value,
                        personalStatut: entity.statut.value,
                        dateOfBirth: entity.dateOfBirth.toISOString(),
                        creationDate: new Date().toISOString(),
                        country: "FRANCE",
                        isVerified: true,
                    };
                    console.debug("data", data);
                    if (data.password !== data.passwordConfirm) {
                        setErrors({ password: "Les mots de passe ne correspondent pas" });
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
                        pending: "Ajout de l'utilisateur",
                        success: "Utilisateur ajouté",
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
                }}
            >
                <div>
                    <label htmlFor="firstname">Prénom</label>
                    <Input type="text" name="firstname" label="Prénom" extra={{ required: true }} onChange={(d) => updateEntity("firstname", d)} defaultValue={entity.firstname} />
                    <div>{errors.firstname}</div>
                </div>
                <div>
                    <label htmlFor="lastname">Nom</label>
                    <Input type="text" name="lastname" label="Nom" extra={{ required: true }} onChange={(d) => updateEntity("lastname", d)} defaultValue={entity.lastname} />
                    <div>{errors.lastname}</div>
                </div>
                <label htmlFor="statut">Statut</label>
                <Input
                    type="select"
                    name="personalStatut"
                    label="Statut"
                    defaultValue={entity.statut}
                    extra={{ options: entityPossibility.statut, required: true }}
                    onChange={(d) => updateEntity("statut", d)}
                />
                <div>{errors.statut}</div>
                <div>
                    <label htmlFor="dateOfBirth">Date de Naissance</label>
                    <Input type="date" name="dateOfBirth" label="Date de naissance" extra={{ required: true }} onChange={(d) => updateEntity("dateOfBirth", d)} defaultValue={entity.dateOfBirth} />
                    <div>{errors.dateOfBirth}</div>
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <Input type="email" name="email" label="Adresse mail" extra={{ required: true }} onChange={(d) => updateEntity("email", d)} defaultValue={entity.email} />
                    <div>{errors.email}</div>
                </div>
                <div>
                    <label htmlFor="state">Statut</label>
                    <Input type="checkbox" name="state" label="Actif" defaultValue={entity.state} onChange={(d) => updateEntity("state", d)} />
                    <div>{errors.state}</div>
                </div>
                <div>
                    <label htmlFor="address">Adresse</label>
                    <Input type="text" name="address" label="Adresse" defaultValue={entity.address} extra={{ required: true }} onChange={(d) => updateEntity("address", d)} />
                    <div>{errors.address}</div>
                </div>
                <div style={{ display: "flex", gap: "30px" }}>
                    <div>
                        <label htmlFor="city">Ville</label>
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
                                        setLocationPossibilityIsLoading(true);
                                        updateLocationPossibility({ id: "city", args: { city: cityName } }).then(function () {
                                            setLocationPossibilityIsLoading(false);
                                        });
                                    }
                                },
                            }}
                            onChange={(d) => updateEntity("city", d)}
                        />
                        <div>{errors.city}</div>
                    </div>
                    <div>
                        <label htmlFor="postalCode">Code postal</label>
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
                                        setLocationPossibilityIsLoading(true);
                                        updateLocationPossibility({ id: "city", args: { postcode: _postcode } }).then(function () {
                                            setLocationPossibilityIsLoading(false);
                                        });
                                    }
                                },
                            }}
                            onChange={(d) => updateEntity("postcode", d)}
                        />
                        <div>{errors.postalCode}</div>
                    </div>
                </div>
                <div>
                    <label htmlFor="phoneNumber">Numéro de télephone</label>
                    <Input type="tel" name="phoneNumber" label="Numéro de téléphone" extra={{ required: true }} onChange={(d) => updateEntity("phoneNumber", d)} defaultValue={entity.phoneNumber} />
                    <div>{errors.phoneNumber}</div>
                </div>
                <div style={{ display: "flex", gap: "30px" }}>
                    <div>
                        <label htmlFor="gender">Genre</label>
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
                    <label htmlFor="password">Mot de passe</label>
                    <Input type="password" name="password" label="Mot de passe" extra={{ required: true }} onChange={(d) => updateEntity("password", d)} defaultValue={entity.password} />
                    <Input
                        type="password"
                        name="passwordConfirm"
                        label="Confirmation du mot de passe"
                        extra={{ required: true }}
                        onChange={(d) => updateEntity("passwordConfirm", d)}
                        defaultValue={entity.passwordConfirm}
                    />
                    <div>{errors.password}</div>
                </div>
            </BOForm>
        </div>
    );
}
