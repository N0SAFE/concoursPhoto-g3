import BOForm from "@/components/organisms/BO/Form/index.jsx";
import Input from "@/components/atoms/Input/index.jsx";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import useApiFetch from "@/hooks/useApiFetch.js";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext.jsx";
import Button from "@/components/atoms/Button";
import useLocationPosibility from "@/hooks/useLocationPosibility.js";
import style from "./style.module.scss";
import Navlink from "@/components/molecules/Navlink/index.jsx";
import Loader from "@/components/atoms/Loader/index.jsx";

export default function Myorganization() {
    const [entityPossibility, setEntityPossibility] = useState({ organization: [], types: [] });
    const { me } = useAuthContext();
    const [isLoading, setIsLoading] = useState(true)

    const profileRouteList = [
        { content: "Mon profil", to: "/me" },
        { content: "Mes préférences", to: "/preference" },
        { content: "Mes organisations", to: "/myorganization" },
        { content: "Concours créés par mon organisation", to: "/me" },
        { content: "Concours auxquels j’ai participé", to: "/me" },
        { content: "Mes publicités", to: "/me" },
    ];

    const [locationPossibility, updateLocationPossibility] = useLocationPosibility(["cities"], {}, { updateOnStart: false });
    const citiesPossibility = locationPossibility.citiesPossibility.map((c) => ({ label: `${c.nom} [${c.codesPostaux.join(",")}]`, value: c.code }));
    const postalCodesPossibility = [...new Set(locationPossibility.citiesPossibility.map((c) => c.codesPostaux).flat())].map((c) => ({ label: c, value: c }));
    const [locationPossibilityIsLoading, setLocationPossibilityIsLoading] = useState(false);
    const [entity, setEntity] = useState({
        ...me.Manage[0],
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
        Types: null,
    });
    
    console.log(entity)
    
    const updateEntity = (key, value) => {
        setEntity({ ...entity, [key]: value });
    };
    const updateEntityState = (key, value) => {
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

    useEffect(() => {
        setEntity(me.Manage[0]);
        const promise = Promise.all([getOrganizationTypePossibility()]).then(([types]) => setEntityPossibility({ types }));
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
        <Loader active={isLoading} >
        <div className={style.formContainer}>
            <Navlink base="/profile" list={profileRouteList} />
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
                        organizationType: entity.organization_type.value,
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
                        });
                    toast.promise(promise, {
                        pending: "Modification en cours",
                        success: "Votre organisation a bien été modifié",
                        error: "Erreur lors de la modification de votre organisation",
                    });
                }}
                hasSubmit={true}
            >
                <div className="container" style={{ display: "flex", flexDirection: "row", gap: "50px" }}>
                    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                        <Input type="text" name="organizer_name" label="Nom de l'organisation" onChange={(d) => updateEntity("organizer_name", d)} defaultValue={entity.organizer_name} />
                        <Input
                            type="select"
                            name="type"
                            label="Type"
                            extra={{ options: entityPossibility.types, required: true, value: entity.organization_type }}
                            onChange={(d) => updateEntityState("organization_type", d)}
                        />

                            <Input type="text" name="email" label="Email" onChange={(d) => updateEntity("email", d)} defaultValue={entity.email} />
                            <Input type="text" name="number_phone" label="Numéro de téléphone" onChange={(d) => updateEntity("number_phone", d)} defaultValue={entity.number_phone} />
                            <Input type="text" name="website_url" label="Site web" onChange={(d) => updateEntity("website_url", d)} defaultValue={entity.website_url} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                            {" "}
                            <Input type="text" name="address" label="Adresse" onChange={(d) => updateEntity("address", d)} defaultValue={entity.address} />
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <Input
                                    type="select"
                                    defaultValue={entity.city}
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
                            <Input type="text" name="country" label="Pays" onChange={(d) => updateEntity("country", d)} defaultValue={entity.country} />
                            <Input type="text" name="intra_community_vat" label="Numéro de TVA" onChange={(d) => updateEntity("intra_community_vat", d)} defaultValue={entity.intra_community_vat} />
                            <Input type="text" name="number_siret" label="Numéro de SIRET" onChange={(d) => updateEntity("number_siret", d)} defaultValue={entity.number_siret} />
                        </div>
                    </div>
                    <div className="test">
                        <h2>Présentation</h2>
                    </div>

                    <Input type="textarea" name="description" extra={{ rows: 16 }} label="Description" onChange={(d) => updateEntity("country", d)} defaultValue={entity.description}></Input>
                    <h2>Réseaux sociaux de l’organisation</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
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
                    </div>
                    <div className={style.registerSubmit}>
                        <Button type="submit" name="Mettre à jour" color={"black"} textColor={"white"} padding={"14px 30px"} border={false} borderRadius={"44px"} width={"245px"} />
                    </div>
                </BOForm>
            </div>
        </Loader>
    );
}
