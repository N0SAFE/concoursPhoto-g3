import BOForm from "@/components/organisms/BO/Form/index.jsx";
import Input from "@/components/atoms/Input/index.jsx";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import useApiFetch from "@/hooks/useApiFetch.js";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext.jsx";
import Button from "@/components/atoms/Button";
import useLocation from "@/hooks/useLocation.js";
import useLocationPosibility from "@/hooks/useLocationPosibility.js";

export default function Profile() {
    const [entityPossibility, setEntityPossibility] = useState({ statut: [], gender: [], category: [] });
    const { me } = useAuthContext();
    const [email, setEmail] = useState(me?.email);
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState(me?.firstname);
    const [lastname, setLastname] = useState(me?.lastname);
    const [dateOfBirth, setDateOfBirth] = useState(me?.dateOfBirth);
    const [statut, setstatut] = useState(me?.personal_statut || "");
    const [address, setAddress] = useState(me?.address);
    const [city, setCity] = useState(me?.city);
    const [postcode, setPostcode] = useState(me?.postcode);
    const [pseudonym, setPseudonym] = useState(me?.pseudonym);
    const [gender, setGender] = useState(me?.gender || "");
    const { getCityByCode } = useLocation();

    const [locationPossibility, updateLocationPossibility] = useLocationPosibility(["cities"], {}, { updateOnStart: false });
    const citiesPossibility = locationPossibility.citiesPossibility.map((c) => ({ label: `${c.nom} [${c.codesPostaux.join(",")}]`, value: c.code }));
    const postalCodesPossibility = [...new Set(locationPossibility.citiesPossibility.map((c) => c.codesPostaux).flat())].map((c) => ({ label: c, value: c }));
    const [locationPossibilityIsLoading, setLocationPossibilityIsLoading] = useState(false);
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
        category: "",
        dateOfBirth: null,
        pseudonym: "",
        photographerDescription: "",
        websiteUrl: "",
    });
    const updateEntity = (key, value) => {
        setEntity({ ...entity, [key]: value });
    };

    const [errors, setErrors] = useState({});
    const apiFetch = useApiFetch();
    const navigate = useNavigate();

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

    const getCategoryPossibility = () => {
        return apiFetch("/photographer_categories", {
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
        apiFetch("/users/" + me.id, {
            method: "GET",
        })
            .then((r) => r.json())
            .then((data) => {
                console.debug(data);
                return Promise.all([getCityByCode(data.city)]).then(([city]) => {
                    const _user = {
                        email: data.email,
                        firstname: data.firstname,
                        lastname: data.lastname,
                        address: data.address,
                        postcode: { value: data.postcode, label: data.postcode },
                        city: { label: city.nom, value: city.code },
                        gender: { label: data.gender.label, value: data.gender["@id"] },
                        statut: { label: data.personal_statut.label, value: data.personal_statut["@id"] },
                        dateOfBirth: new Date(data.date_of_birth),
                        pseudonym: data.pseudonym,
                        photographerDescription: data.photographer_description,
                        category: { label: data.photographer_category.label, value: data.photographer_category["@id"] },
                        websiteUrl: data.website_url,
                    };
                    console.debug(_user);
                    setEntity(_user);
                });
            });
    }

    useEffect(() => {
        const promise = Promise.all([getGendersPossibility(), getPersonalstatus(), getCategoryPossibility(), getUser()]).then(([genders, statut, category]) =>
            setEntityPossibility({ genders, statut, category })
        );
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
            <h1>Mon compte</h1>
            <BOForm
                handleSubmit={function () {
                    const data = {
                        email: entity.email,
                        plainPassword: entity.password || undefined,
                        firstname: entity.firstname,
                        lastname: entity.lastname,
                        address: entity.address,
                        city: entity.city.value,
                        postcode: entity.postcode.value,
                        gender: entity.gender.value,
                        personalStatut: entity.statut.value,
                        dateOfBirth: entity.dateOfBirth.toISOString(),
                        pseudonym: entity.pseudonym,
                        photographerDescription: entity.photographerDescription,
                        photographerCategory: entity.category.value,
                        websiteUrl: entity.websiteUrl,
                    };
                    console.debug("data", data);
                    // if (password !== passwordConfirm) {
                    //     setErrors({ password: "Les mots de passe ne correspondent pas" });
                    //     return;
                    // }
                    const promise = apiFetch("/users/" + me.id, {
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
                                console.error(data);
                                throw new Error(data.description);
                            }
                            navigate("/auth/logout");
                            toast.success("Votre profil a bien été modifié, veuillez vous reconnecter");
                        });

                    toast.promise(promise, {
                        pending: "Modification en cours",
                        success: "Votre utilisateur a bien été modifié",
                        error: "Erreur lors de la modification de votre profil",
                    });
                }}
            >
                <div className="container" style={{ display: "flex", flexDirection: "row", gap: "50px" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <Input type="radioList" name="genre" label="genre" onChange={(d) => updateEntity("gender", d)} extra={{ value: entity.gender, options: entityPossibility.genders }} />
                        <Input type="text" name="Prénom*" label="Prénom" onChange={(d) => updateEntity("firstname", d)} defaultValue={entity.firstname} />
                        <Input type="text" name="Nom*" label="Nom" onChange={(d) => updateEntity("lastname", d)} defaultValue={entity.lastname} />
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <Input type="date" name="Date de naissance$" label="Date de naissance" onChange={(d) => updateEntity("dateOfBirth", d)} defaultValue={entity.dateOfBirth} />
                            <Input type="select" name="vous êtes*" label="Statut" onChange={(d) => updateEntity("statut", d)} extra={{ value: entity.statut, options: entityPossibility.statut }} />
                        </div>
                        <Input type="email" name="Email*" label="Adresse email" extra={{ required: true }} onChange={(d) => updateEntity("email", d)} defaultValue={entity.email} />
                        <Input type="password" name="Mot de passe*" label="Mot de passe" onChange={(d) => updateEntity("password", d)} defaultValue={entity.password} />
                        <h3 style={{ marginTop: "20%", marginBottom: "3%" }}>Si vous êtes photographe</h3>
                        <Input
                            type="textarea"
                            name="photographerDescription"
                            label="Description Photographe"
                            onChange={(d) => updateEntity("photographerDescription", d)}
                            defaultValue={entity.photographerDescription}
                        />
                        <Input
                            type="select"
                            name="PhotographeCategory"
                            label="Votre catégorie en tant que photographe ?"
                            onChange={(d) => updateEntity("category", d)}
                            extra={{ value: entity.category, options: entityPossibility.category }}
                        />
                        <Input type="text" name="websiteUrl" label="Réseaux sociaux" onChange={(d) => updateEntity("websiteUrl", d)} defaultValue={entity.websiteUrl} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <Input type="text" name="Adresse" label="Adresse" onChange={(d) => updateEntity("adress", d)} defaultValue={entity.address} />
                        <Input
                            type="select"
                            name="Ville"
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
                        <Input
                            type="select"
                            name="Code Postal"
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
                        <div>
                            <Input type="text" name="pseudonym" label="Pseudonyme" onChange={(d) => updateEntity("pseudonym", d)} defaultValue={entity.pseudonym} />
                        </div>
                    </div>
                </div>
            </BOForm>
        </div>
    );
}
