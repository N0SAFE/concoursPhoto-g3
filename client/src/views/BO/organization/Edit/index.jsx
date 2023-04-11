import Input from "@/components/atoms/Input/index.jsx";
import BOForm from "@/components/organisms/BO/Form";
import useApiFetch from "@/hooks/useApiFetch.js";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useLocationPosibility from "@/hooks/useLocationPosibility.js";
import useLocation from "@/hooks/useLocation.js";
import { toast } from "react-toastify";

export default function OrganizationEdit() {
    const { id: organizationId } = useParams();
    const apiFetch = useApiFetch();
    const { getCityByCode } = useLocation();

    const [locationPossibility, updateLocationPossibility] = useLocationPosibility(["cities"], {}, { updateOnStart: false });
    const citiesPossibility = locationPossibility.citiesPossibility.map((c) => ({ label: `${c.nom} [${c.codesPostaux.join(",")}]`, value: c.code }));
    const postalCodesPossibility = [...new Set(locationPossibility.citiesPossibility.map((c) => c.codesPostaux).flat())].map((c) => ({ label: c, value: c }));
    const [locationPossibilityIsLoading, setLocationPossibilityIsLoading] = useState(true);

    const [entityPossibility, setEntityPossibility] = useState({ types: [] });
    const [entity, setEntity] = useState({
        organizerName: null,
        description: null,
        address: null,
        city: null,
        postcode: null,
        phoneNumber: null,
        email: null,
        state: null,
        logo: null,
        country: null,
        creationDate: null,
        websiteUrl: null,
        organizationType: null,
    });

    const updateEntity = (key, value) => {
        setEntity({ ...entity, [key]: value });
    };

    const [errors, setErrors] = useState({});

    const getOrganizationTypePossibility = () => {
        return apiFetch("/organization_types", {
            method: "GET",
        })
            .then((r) => r.json())
            .then((data) => {
                return data["hydra:member"].map(function (item) {
                    return { label: item.label, value: item["@id"] };
                });
            });
    };

    function getOrganizations() {
        return apiFetch("/organizations/" + organizationId, {
            method: "GET",
        })
            .then((r) => r.json())
            .then((data) => {
                console.debug(data);
                return Promise.all([getCityByCode(data.city)]).then(([city]) => {
                    const _organization = {
                        organizerName: data.organizer_name,
                        description: data.description,
                        address: data.address,
                        phoneNumber: data.number_phone,
                        email: data.email,
                        state: data.state,
                        logo: data.logo,
                        country: data.country,
                        creationDate: data.creation_date,
                        websiteUrl: data.website_url,
                        city: { label: city.nom, value: city.code },
                        postcode: { value: data.postcode, label: data.postcode },
                        organizationType: { value: data.organization_type["@id"], label: data.organization_type.label },
                    };
                    setEntity(_organization);
                });
            });
    }

    useEffect(() => {
        const promise = Promise.all([getOrganizationTypePossibility(), getOrganizations()]).then(([types]) => setEntityPossibility({ types }));
        toast.promise(promise, {
            pending: "Chargement des données",
            success: "Données chargées",
            error: "Erreur lors du chargement des données",
        });
    }, []);

    useEffect(() => {
        updateLocationPossibility({ args: { codeCity: entity.city?.value, postcode: entity.postcode?.value } }).then(function (d) {
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
                title="Modifier une organisation"
                handleSubmit={function () {
                    const data = {
                        organizerName: entity.organizerName,
                        description: entity.description,
                        address: entity.address,
                        city: entity.city.value,
                        postcode: entity.postcode.value,
                        numberPhone: entity.phoneNumber,
                        email: entity.email,
                        state: entity.state,
                        logo: entity.logo,
                        country: "France",
                        websiteUrl: entity.websiteUrl,
                        organizationType: entity.organizationType.value,
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
                    <Input
                        type="text"
                        name="organizerName"
                        label="Nom de l'organisation"
                        extra={{ required: true }}
                        onChange={(d) => updateEntity("organizerName", d)}
                        defaultValue={entity.organizerName}
                    />

                    <Input type="text" name="description" label="Description" extra={{ required: true }} onChange={(d) => updateEntity("description", d)} defaultValue={entity.description} />

                    <Input type="tel" name="phoneNumber" label="Numéro de téléphone" extra={{ required: true }} onChange={(d) => updateEntity("phoneNumber", d)} defaultValue={entity.phoneNumber} />

                    <Input type="file" name="logo" label="Logo" onChange={(d) => updateEntity("logo", d)} defaultValue={entity.logo} />

                    <Input type="email" name="email" label="Adresse mail" extra={{ required: true }} onChange={(d) => updateEntity("email", d)} defaultValue={entity.email} />

                    <Input type="checkbox" name="state" label="Actif" onChange={(d) => updateEntity("state", d)} defaultValue={entity.state} />

                    <Input type="text" name="address" label="Adresse" extra={{ required: true }} onChange={(d) => updateEntity("address", d)} defaultValue={entity.address} />

                    <Input type="text" name="websiteUrl" label="Site internet" extra={{ required: true }} onChange={(d) => updateEntity("websiteUrl", d)} defaultValue={entity.websiteUrl} />

                    <Input
                        type="select"
                        name="type"
                        label="Type"
                        extra={{ options: entityPossibility.types, required: true, value: entity.organizationType }}
                        onChange={(d) => updateEntity("organizationType", d)}
                    />

                    <div style={{ display: "flex", gap: "30px" }}>
                        <Input
                            type="select"
                            name="city"
                            label="Ville"
                            extra={{
                                isLoading: entity.locationPossibilityIsLoading,
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
                    </div>
                </div>
            </BOForm>
        </div>
    );
}
