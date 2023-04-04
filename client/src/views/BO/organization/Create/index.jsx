import Input from "@/components/atoms/Input/index.jsx";
import BOCreate from "@/components/organisms/BO/Form";
import useApiFetch from "@/hooks/useApiFetch.js";
import { useState, useEffect } from "react";
import useLocationPosibility from "@/hooks/useLocationPosibility.js";
import { toast } from "react-toastify";

export default function OrganizationCreate() {
    const apiFetch = useApiFetch();
    
    const [entityPossibility, setEntityPossibility] = useState({ types: [] });
    const [possibility, updatePossibility] = useLocationPosibility(["cities"], {}, { updateOnStart: false });
    const citiesPossibility = possibility.citiesPossibility.map((c) => ({ label: `${c.nom} [${c.codesPostaux.join(",")}]`, value: c.code }));
    const postalCodesPossibility = [...new Set(possibility.citiesPossibility.map((c) => c.codesPostaux).flat())].map((c) => ({ label: c, value: c }));

    const [state, setState] = useState(false);
    const [organizerName, setOrganizerName] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postcode, setPostcode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [logo, setLogo] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState([]);
    const [type, setType] = useState([]);
    const [errors, setErrors] = useState({});
    
    const getTypePossibility = () => {
        return apiFetch("/organization_types", {
            method: "GET",
        })
            .then((r) => r.json())
    };
    
    useEffect(() => {
        const promise = Promise.all([getTypePossibility()]).then(([typePossibility]) => {
            setEntityPossibility({ types: typePossibility });
        });
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
            <BOCreate
                title="Création d'une organisation"
                handleSubmit={function () {
                    console.debug("handleSubmit");
                    console.debug("fetch");
                    const data = {
                        organizerName: organizerName,
                        description: description,
                        address: address,
                        city: city,
                        postcode: postcode,
                        numberPhone: phoneNumber,
                        email: email,
                        state,
                        logo: logo,
                        country: "France",
                        creationDate: new Date().toISOString(),
                        websiteUrl,
                        organizationType: "/api/organization_types/" + type.value,
                    };
                    console.debug("data", data);
                    apiFetch("/organizations", {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                        .then((r) => r.json())
                        .then((data) => {
                            console.debug(data);
                            if (data["@type"] === "hydra:Error") {
                                throw new Error(data.description);
                            }
                        });
                }}
            >
                <div>
                    <label htmlFor="organizerName">Nom de l'organisation</label>
                    <Input type="text" name="organizerName" label="Nom de l'organisation" extra={{ required: true }} setState={setOrganizerName} />
                    <div>{errors.organizerName}</div>
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <Input type="text" name="description" label="Description" extra={{ required: true }} setState={setDescription} />
                    <div>{errors.description}</div>
                </div>
                <div>
                    <label htmlFor="phoneNumber">Numéro de télephone</label>
                    <Input type="text" name="phoneNumber" label="Numéro de téléphone" extra={{ required: true }} setState={setPhoneNumber} />
                    <div>{errors.phoneNumber}</div>
                </div>
                <div>
                    <label htmlFor="logo">Logo</label>
                    <Input type="file" name="logo" label="Logo" setState={setLogo} />
                    <div>{errors.logo}</div>
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <Input type="email" name="email" label="Adresse mail" extra={{ required: true }} setState={setEmail} defaultValue={email} />
                    <div>{errors.email}</div>
                </div>
                <div>
                    <label htmlFor="state">Statut</label>
                    <Input type="checkbox" name="state" label="Actif" defaultValue={state} setState={setState} />
                    <div>{errors.state}</div>
                </div>
                <div>
                    <label htmlFor="address">Adresse</label>
                    <Input type="text" name="address" label="Adresse" defaultValue={address} extra={{ required: true }} setState={setAddress} />
                    <div>{errors.address}</div>
                </div>
                <div>
                    <label htmlFor="websiteUrl">Adresse site internet</label>
                    <Input type="text" name="websiteUrl" label="WebsiteUrl" defaultValue={websiteUrl} extra={{ required: true }} setState={setWebsiteUrl} />
                    <div>{errors.websiteUrl}</div>
                </div>
                <div>
                    <label htmlFor="type">Type</label>
                    <Input type="select" name="type" label="Type" defaultValue={type} extra={{ options: entityPossibility.types, required: true }} setState={setType} />
                    <div>{errors.type}</div>
                </div>
                <div style={{ display: "flex", gap: "30px" }}>
                    <div>
                        <label htmlFor="city">Ville</label>
                        <Input
                            type="select"
                            name="city"
                            label="Ville"
                            extra={{
                                isClearable: true,
                                required: true,
                                options: citiesPossibility,
                                multiple: false,
                                value: city,
                                onInputChange: (text, { action }) => {
                                    console.log(action)
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
                        <label htmlFor="postalCode">Code Postal</label>
                        <Input
                            type="select"
                            name="postalCode"
                            label="Code postal"
                            extra={{
                                isClearable: true,
                                required: true,
                                options: postalCodesPossibility,
                                multiple: false,
                                value: postcode,
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
            </BOCreate>
        </div>
    );
}
