import Input from "@/components/atoms/Input/index.jsx";
import BOForm from "@/components/organisms/BO/Form";
import useApiFetch from "@/hooks/useApiFetch.js";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useLocationPosibility from "@/hooks/useLocationPosibility.js";
import useLocation from "@/hooks/useLocation.js";
import { toast } from "react-toastify";
import useApiPath from "@/hooks/useApiPath.js";
import useFilesUploader from "@/hooks/useFilesUploader.js";
import Loader from "@/components/atoms/Loader/index.jsx";

export default function OrganizationEdit() {
    const [isLoading, setIsLoading] = useState(true)
    const apiPathComplete = useApiPath();
    const { id: organizationId } = useParams();
    const apiFetch = useApiFetch();
    const { getCityByCode } = useLocation();
    const { deleteFile, uploadFile } = useFilesUploader();
    const navigate = useNavigate();

    const [locationPossibility, updateLocationPossibility] = useLocationPosibility(["cities"], {}, { updateOnStart: false });
    const citiesPossibility = locationPossibility.citiesPossibility.map((c) => ({ label: `${c.nom} [${c.codesPostaux.join(",")}]`, value: c.code }));
    const postalCodesPossibility = [...new Set(locationPossibility.citiesPossibility.map((c) => c.codesPostaux).flat())].map((c) => ({ label: c, value: c }));
    const [locationPossibilityIsLoading, setLocationPossibilityIsLoading] = useState(true);

    const [entityPossibility, setEntityPossibility] = useState({ types: [] });
    const [updatedFile, setUpdatedFile] = useState({
        logo: null,
    });
    const [entity, setEntity] = useState({
        organizerName: null,
        description: null,
        address: null,
        city: null,
        postcode: null,
        phoneNumber: null,
        email: null,
        state: false,
        logo: null,
        country: null,
        creationDate: null,
        websiteUrl: null,
        organizationType: null,
        numberSiret: null,
        intraCommunityVat: null,
    });

    const updateEntityState = (key, value) => {
        setEntity({ ...entity, [key]: value });
    };
    const updateFileState = (key, value) => {
        setUpdatedFile({ ...updatedFile, [key]: value });
    };

    const [errors, setErrors] = useState({});

    const getOrganizationTypePossibility = (controller) => {
        return apiFetch("/organization_types", {
            method: "GET",
            signal: controller?.signal,
        })
            .then((r) => r.json())
            .then((data) => {
                return data["hydra:member"].map(function (item) {
                    return { label: item.label, value: item["@id"] };
                });
            });
    };

    function getOrganizations(controller) {
        return apiFetch("/organizations/" + organizationId, {
            method: "GET",
            signal: controller?.signal,
        })
            .then((r) => r.json())
            .then((data) => {
                console.debug(data);
                return Promise.all([getCityByCode(data.citycode)]).then(([city]) => {
                    const _organization = {
                        organizerName: data.organizer_name,
                        description: data.description,
                        address: data.address,
                        phoneNumber: data.number_phone,
                        email: data.email,
                        state: data.state,
                        logo: data.logo || null,
                        country: data.country,
                        creationDate: data.creation_date,
                        websiteUrl: data.website_url,
                        city: { label: city.nom, value: city.code },
                        postcode: { value: data.postcode, label: data.postcode },
                        organizationType: { value: data.organization_type["@id"], label: data.organization_type.label },
                        numberSiret: data.number_siret,
                        intraCommunityVat: data.intra_community_vat,
                    };
                    const _organizationFile = {
                        logo: data.logo ? { to: apiPathComplete(data.logo.path), name: data.logo.default_name } : null,
                    };
                    setEntity(_organization);
                    setUpdatedFile(_organizationFile);
                });
            });
    }

    useEffect(() => {
        const controller = new AbortController();
        const promise = Promise.all([getOrganizationTypePossibility(controller), getOrganizations(controller)]).then(([types]) => setEntityPossibility({ types }));
        promise.then(function(){
            setIsLoading(false)
        })
        if(import.meta.env.MODE === 'development'){
            toast.promise(promise, {
                pending: "Chargement des données",
                success: "Données chargées",
                error: "Erreur lors du chargement des données",
            });
        }
        return () => setTimeout(() => controller.abort());
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
        <Loader active={isLoading}>
            <BOForm
                title="Modifier une organisation"
                handleSubmit={function () {
                    const promise = new Promise(async (resolve, reject) => {
                        try {
                            const newLogoId = await (async () => {
                                if (updatedFile.logo === null) {
                                    return null;
                                } else if (updatedFile.logo.file) {
                                    return await uploadFile({ file: updatedFile.logo.file }).then((r) => r["@id"]);
                                }
                            })();

                            const data = {
                                organizerName: entity.organizerName,
                                description: entity.description,
                                address: entity.address,
                                citycode: entity.city.value,
                                postcode: entity.postcode.value,
                                numberPhone: entity.phoneNumber,
                                email: entity.email,
                                state: entity.state,
                                logo: newLogoId,
                                country: "France",
                                websiteUrl: entity.websiteUrl,
                                organizationType: entity.organizationType.value,
                                numberSiret: entity.numberSiret,
                                intraCommunityVat: entity.intraCommunityVat,
                            };
                            console.debug("data", data);
                            const res = await apiFetch("/organizations/" + organizationId, {
                                method: "PATCH",
                                body: JSON.stringify(data),
                                headers: {
                                    "Content-Type": "application/merge-patch+json",
                                },
                            })
                                .then((r) => r.json())
                                .then(async (data) => {
                                    console.debug(data);
                                    if (data["@type"] === "hydra:Error") {
                                        throw new Error(data.description);
                                    }
                                    if (updatedFile.logo === null && entity.logo) {
                                        await deleteFile({ path: entity.logo["@id"] });
                                    }
                                });
                            resolve(res);
                        } catch (e) {
                            console.error(e);
                            reject(e);
                        }
                    });

                    promise.then(function () {
                        navigate("/BO/organization");
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
                        onChange={(d) => updateEntityState("organizerName", d)}
                        defaultValue={entity.organizerName}
                    />

                    <Input type="text" name="description" label="Description" extra={{ required: true }} onChange={(d) => updateEntityState("description", d)} defaultValue={entity.description} />

                    <Input
                        type="tel"
                        name="phoneNumber"
                        label="Numéro de téléphone"
                        extra={{ required: true }}
                        onChange={(d) => updateEntityState("phoneNumber", d)}
                        defaultValue={entity.phoneNumber}
                    />

                    <Input type="file" name="logo" label="Logo" onChange={(d) => updateFileState("logo", d)} extra={{ value: updatedFile.logo, type: "image" }} />

                    <Input type="email" name="email" label="Adresse mail" extra={{ required: true }} onChange={(d) => updateEntityState("email", d)} defaultValue={entity.email} />

                    <Input type="checkbox" name="state" label="Actif" onChange={(d) => updateEntityState("state", d)} defaultValue={entity.state} />

                    <Input type="text" name="address" label="Adresse" extra={{ required: true }} onChange={(d) => updateEntityState("address", d)} defaultValue={entity.address} />
                    <Input type="text" name="numberSiret" label="Numéro SIRET" extra={{ required: true }} onChange={(d) => updateEntityState("numberSiret", d)} defaultValue={entity.numberSiret} />
                    <Input
                        type="text"
                        name="intraCommunityVat"
                        label="Numéro TVA"
                        extra={{ required: true }}
                        onChange={(d) => updateEntityState("intraCommunityVat", d)}
                        defaultValue={entity.intraCommunityVat}
                    />
                    <Input type="text" name="websiteUrl" label="Site internet" extra={{ required: true }} onChange={(d) => updateEntityState("websiteUrl", d)} defaultValue={entity.websiteUrl} />

                    <Input
                        type="select"
                        name="type"
                        label="Type"
                        extra={{ options: entityPossibility.types, required: true, value: entity.organizationType }}
                        onChange={(d) => updateEntityState("organizationType", d)}
                    />

                    <div style={{ display: "flex", gap: "10px" }}>
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
                            onChange={(d) => updateEntityState("city", d)}
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
                            onChange={(d) => updateEntityState("postcode", d)}
                        />
                    </div>
                </div>
            </BOForm>
        </Loader>
    );
}
