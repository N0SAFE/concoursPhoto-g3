import Input from "@/components/atoms/Input/index.jsx";
import BOCreate from "@/components/organisms/BO/Form";
import useApiFetch from "@/hooks/useApiFetch.js";
import { useState, useEffect } from "react";

export default function OrganizationCreate() {
    const apiFetch = useApiFetch();
    const [citiesPossibility, setCitiesPossibility] = useState([]);
    const [postalCodesPossibility, setPostalCodesPossibility] = useState([]);
    const [typePossibility, setTypePossibility] = useState([]);

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
    const onClear = () => {
        setValue("");
    };
    const getTypePossibility = () => {
        apiFetch("/organization_types", {
            method: "GET",
        })
            .then((r) => r.json())
            .then((data) => {
                console.debug(data);
                setTypePossibility(
                    data["hydra:member"].map(function (item) {
                        return { label: item.label, value: item.id };
                    })
                );
            });
    };

    const getCitiesPossibility = () => {
        console.debug("postalCode", postcode);
        console.debug("city", city);

        const filter = [postcode ? `codePostal=${postcode}` : "", city ? `nom=${city}` : ""];

        console.debug(`https://geo.api.gouv.fr/communes?${filter.join("&")}&fields=nom,codesPostaux&format=json&geometry=centre`);

        fetch(`https://geo.api.gouv.fr/communes?${filter.join("&")}&fields=nom,codesPostaux&format=json&geometry=centre`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                data.length = 30;
                const [cityPossibility, postalCodesPossibility] = data.reduce(
                    ([cityResponse, postalCodeResponse], c) => {
                        cityResponse.push({ label: c.nom, value: c.code });
                        postalCodeResponse.push(...c.codesPostaux);
                        return [cityResponse, postalCodeResponse];
                    },
                    [[], []]
                );
                setCitiesPossibility(cityPossibility);
                setPostalCodesPossibility(postalCodesPossibility.map((c) => ({ label: c, value: c })));
                console.debug("data", postcode);
            });
    };
    useEffect(() => {
        getTypePossibility();
    }, []);
    useEffect(() => {
        getCitiesPossibility();
    }, [postcode, city]);

    console.debug("postalCodesPossibility", postalCodesPossibility);

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
                    <label htmlFor="organizerName">organizerName</label>
                    <Input type="text" name="organizerName" label="Nom de l'organisation" extra={{ required: true }} setState={setOrganizerName} />
                    <div>{errors.organizerName}</div>
                </div>
                <div>
                    <label htmlFor="description">description</label>
                    <Input type="text" name="description" label="Description" extra={{ required: true }} setState={setDescription} />
                    <div>{errors.description}</div>
                </div>
                <div>
                    <label htmlFor="phoneNumber">phoneNumber</label>
                    <Input type="text" name="phoneNumber" label="Numéro de téléphone" extra={{ required: true }} setState={setPhoneNumber} />
                    <div>{errors.phoneNumber}</div>
                </div>
                <div>
                    <label htmlFor="logo">logo</label>
                    <Input type="file" name="logo" label="Logo" setState={setLogo} />
                    <div>{errors.logo}</div>
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
                <div>
                    <label htmlFor="websiteUrl">websiteUrl</label>
                    <Input type="text" name="websiteUrl" label="WebsiteUrl" defaultValue={websiteUrl} extra={{ required: true }} setState={setWebsiteUrl} />
                    <div>{errors.websiteUrl}</div>
                </div>
                <div>
                    <label htmlFor="type">Type</label>
                    <Input type="select" name="type" label="Type" defaultValue={type} extra={{ options: typePossibility, required: true }} setState={setType} />
                    <div>{errors.type}</div>
                </div>
                <div style={{ display: "flex", gap: "30px" }}>
                    <div>
                        <label htmlFor="city">city</label>
                        <Input
                            type="select"
                            name="city"
                            label="Ville"
                            extra={{
                                clearable: true,
                                required: true,
                                options: citiesPossibility,
                                multiple: false,
                                onInputChange: (item, { action }) => {
                                    if (action === "input-change") {
                                        setCity(item);
                                    }
                                },
                            }}
                            setState={(item) => setCity(item.label)}
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
                                clearable: true,
                                required: true,
                                options: postalCodesPossibility,
                                multiple: false,
                                onInputChange: (item, { action }) => {
                                    if (action === "input-change") {
                                        setPostcode(item);
                                    }
                                },
                            }}
                            setState={(item) => setPostcode(item.label)}
                            defaultValue={postcode}
                        />
                        <div>{errors.postalCode}</div>
                    </div>
                </div>
            </BOCreate>
        </div>
    );
}
