import Input from "@/components/atoms/Input/index.jsx";
import BOForm from "@/components/organisms/BO/Form";
import useApiFetch from "@/hooks/useApiFetch.js";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useLocationPosibility from "@/hooks/useLocationPosibility.js";
import useLocation from "@/hooks/useLocation.js";
import { toast } from "react-toastify";

export default function OrganizationEdit() {
    const apiFetch = useApiFetch();
    const { id: organizationId } = useParams();

    const { getCityByCode } = useLocation();
    const [entityPossibility, setEntityPossibility] = useState({ organizationTypes: [] });
    const [possibility, updatePossibility] = useLocationPosibility(["cities"], {}, { updateOnStart: false });
    const citiesPossibility = possibility.citiesPossibility.map((c) => ({ label: `${c.nom} [${c.codesPostaux.join(",")}]`, value: c.code }));
    const postalCodesPossibility = [...new Set(possibility.citiesPossibility.map((c) => c.codesPostaux).flat())].map((c) => ({ label: c, value: c }));
    const getTypePossibility = () => {
        return apiFetch("/organization_types", {
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
    function getOrganizations() {
        return apiFetch("/organizations/" + organizationId, {
            method: "GET",
        })
            .then((r) => r.json())
            .then((data) => {
                console.debug(data);
                setState(data.state);
                setOrganizerName(data.organizer_name);
                setDescription(data.description);
                setCountry(data.country);
                setAddress(data.address);
                setPhoneNumber(data.number_phone);
                setEmail(data.email);
                setWebsiteUrl(data.website_url);
                setType({ value: data.organization_type.id, label: data.organization_type.label });
                setLogo(data.logo);
                setPostcode({ value: data.postcode, label: data.postcode });
                getCityByCode(data.city).then((city) => {
                    setCity({ label: city.nom, value: city.code });
                });
            });
    }

    const [state, setState] = useState(false);
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postcode, setPostcode] = useState();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [organizerName, setOrganizerName] = useState("");
    const [type, setType] = useState("");
    const [country, setCountry] = useState("");
    const [typePossibility, setTypePossibility] = useState([]);
    const [errors, setErrors] = useState({});
    const [logo, setLogo] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");

    useEffect(() => {
        const promise = Promise.all([getTypePossibility(), getOrganizations()]).then(([organizationTypes]) => setEntityPossibility({ organizationTypes }));
        promise.catch(console.error);
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
                title="Modifier une organisation"
                handleSubmit={function () {
                    console.debug("handleSubmit");
                    console.debug("fetch");
                    console.debug("type", type);
                    const data = {
                        organizerName: organizerName,
                        description: description,
                        address: address,
                        city: city.value,
                        postcode: postcode.value,
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
                    const promise = apiFetch("/organizations/" + organizationId, {
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
                        success: "Organisation modifiée",
                        error: "Erreur lors de la modification de l'organisation",
                    });
                }}
            >
                <div>
                    <label htmlFor="organizerName">Nom del'organisation</label>
                    <Input type="text" name="organizerName" label="Nom de l'organisation" extra={{ required: true }} setState={setOrganizerName} defaultValue={organizerName} />
                    <div>{errors.organizerName}</div>
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <Input type="text" name="description" label="Description" extra={{ required: true }} setState={setDescription} defaultValue={description} />
                    <div>{errors.description}</div>
                </div>
                <div>
                    <label htmlFor="phoneNumber">Numéro télephone</label>
                    <Input type="tel" name="phoneNumber" label="Numéro de téléphone" extra={{ required: true }} setState={setPhoneNumber} defaultValue={phoneNumber} />
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
                    <Input type="select" name="type" label="Type" extra={{ options: typePossibility, required: true, value: type }} setState={setType} />
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
                        <label htmlFor="postalCode">Code Postal</label>
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
            </BOForm>
        </div>
    );
}
