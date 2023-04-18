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

export default function Myorganisation() {
    const [entityPossibility, setEntityPossibility] = useState({ organization: [], types: [] });
    const { me } = useAuthContext();
    const { getCityByCode } = useLocation();

    const [locationPossibility, updateLocationPossibility] = useLocationPosibility(["cities"], {}, { updateOnStart: false });
    const citiesPossibility = locationPossibility.citiesPossibility.map((c) => ({ label: `${c.nom} [${c.codesPostaux.join(",")}]`, value: c.code }));
    const postalCodesPossibility = [...new Set(locationPossibility.citiesPossibility.map((c) => c.codesPostaux).flat())].map((c) => ({ label: c, value: c }));
    const [locationPossibilityIsLoading, setLocationPossibilityIsLoading] = useState(false);
    const [entity, setEntity] = useState({
        id: null,
        organizerName: null,
        email: null,
        numberPhone: null,
        websiteUrl: null,
        address: null,
        city: null,
        postcode: null,
        intraCommunityVat: null,
        numberSiret: null,
        country: null,
        organizationType: null,
        description: null,
        socialNetworks: null,
    });
    const updateEntity = (key, value) => {
        setEntity({ ...entity, [key]: value });
    };

    const [errors, setErrors] = useState({});
    const apiFetch = useApiFetch();
    const navigate = useNavigate();

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

    const getOrganizations = () => {
        return apiFetch("/organizations", {
            method: "GET",
        })
            .then((r) => r.json())
            .then((data) => {
                console.debug(data);
                const _user = {
                    postcode: { value: data.postcode, label: data.postcode },
                    city: { label: city.nom, value: city.code },
                };
                return data["hydra:member"].map(function (item) {
                    return { label: item.label, value: item["@id"] };
                });
            });
    };

    useEffect(() => {
        setEntity(me.Manage[0]);
        console.log(me.Manage[0]);
        const promise = Promise.all([getOrganizations(), getOrganizationTypePossibility()]).then(([organization, types]) => setEntityPossibility({ organization, types }));
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
                handleSubmit={function () {
                    const data = {
                        organizerName: entity.organizer_name,
                        email: entity.email,
                        numberPhone: entity.number_phone,
                        websiteUrl: entity.website_url,
                        address: entity.address,
                        city: entity.city?.value,
                        postcode: entity.postcode?.value,
                        intraCommunityVat: entity.intra_community_vat,
                        numberSiret: entity.number_siret,
                        country: entity.country,
                        // organizationType: { value: data.organization_type["@id"], label: data.organization_type.label },
                        organizationType: entity.organizationType.value,
                        description: entity.description,
                    };
                    const promise = apiFetch(`/organizations/${entity.id}`, {
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
                            toast.success("Votre organization a bien été modifié");
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
                        {" "}
                        <Input type="text" name="organizer_name" label="Nom" onChange={(d) => updateEntity("organizer_name", d)} defaultValue={entity.organizer_name} />
                        <Input
                            type="select"
                            name="type"
                            label="Type"
                            extra={{ options: entityPossibility.types, required: true, value: entity.organizationType }}
                            onChange={(d) => updateEntityState("organizationType", d)}
                        />
                        <Input type="text" name="email" label="Email" onChange={(d) => updateEntity("email", d)} defaultValue={entity.email} />
                        <Input type="text" name="number_phone" label="Numéro de téléphone" onChange={(d) => updateEntity("number_phone", d)} defaultValue={entity.number_phone} />
                        <Input type="text" name="website_url" label="Site web" onChange={(d) => updateEntity("website_url", d)} defaultValue={entity.website_url} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {" "}
                        <Input type="text" name="address" label="Adresse" onChange={(d) => updateEntity("address", d)} defaultValue={entity.address} />
                        <div style={{ display: "flex", flexDirection: "row" }}>
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
                        </div>
                        <Input type="text" name="country" label="Pays" onChange={(d) => updateEntity("country", d)} defaultValue={entity.country} />
                        <Input type="text" name="intra_community_vat" label="Numéro de TVA" onChange={(d) => updateEntity("intra_community_vat", d)} defaultValue={entity.intra_community_vat} />
                        <Input type="text" name="number_siret" label="Numéro de SIRET" onChange={(d) => updateEntity("number_siret", d)} defaultValue={entity.number_siret} />
                    </div>
                </div>
                <div className="test">
                    <h3 style={{ marginTop: "5%" }}>Présentation</h3>
                </div>

                <Input type="textarea" name="description" label="Description" onChange={(d) => updateEntity("country", d)} defaultValue={entity.description}></Input>
                <h3>Réseaux sociaux de l’organisation</h3>
                <div className="container" style={{ display: "flex", flexDirection: "row", gap: "50px" }}>
                    <Input type="text" label="Votre page Facebook"></Input>
                    <Input type="text" label="Votre chaîne Youtube"></Input>
                </div>
                <div className="container" style={{ display: "flex", flexDirection: "row", gap: "50px" }}>
                    <Input type="text" label="Votre page Instagram"></Input>
                    <Input type="text" label="Votre compte Twitter"></Input>
                </div>
                <div className="container" style={{ display: "flex", flexDirection: "row", gap: "50px" }}>
                    <Input type="text" label="Votre page Linkedin"></Input>
                    <Input type="text" label="Votre compte TikTok"></Input>
                </div>
            </BOForm>
        </div>
    );
}
