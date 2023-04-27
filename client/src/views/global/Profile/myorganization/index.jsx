import BOForm from "@/components/organisms/BO/Form/index.jsx";
import Input from "@/components/atoms/Input/index.jsx";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import useApiFetch from "@/hooks/useApiFetch.js";
import { useAuthContext } from "@/contexts/AuthContext.jsx";
import Button from "@/components/atoms/Button";
import useLocationPosibility from "@/hooks/useLocationPosibility.js";
import style from "./style.module.scss";
import Hbar from "@/components/atoms/Hbar/index.jsx";
import useLocation from "@/hooks/useLocation.js";

export default function Myorganization() {
    const { me } = useAuthContext();
    const [typePossibility, setTypePossibility] = useState({ isLoading: true, list: [] });
    const [cityIsLoading, setCityIsLoading] = useState(true);
    const { getCityByCode } = useLocation();

    const [locationPossibility, updateLocationPossibility] = useLocationPosibility(["cities"], {}, { updateOnStart: false });
    const citiesPossibility = locationPossibility.citiesPossibility.map((c) => ({ label: `${c.nom} [${c.codesPostaux.join(",")}]`, value: c.code }));
    const postalCodesPossibility = [...new Set(locationPossibility.citiesPossibility.map((c) => c.codesPostaux).flat())].map((c) => ({ label: c, value: c }));
    const [locationPossibilityIsLoading, setLocationPossibilityIsLoading] = useState(false);
    const [organisation, setOrganisation] = useState(
        me.Manage.length > 0
            ? {
                  ...me.Manage[0],
                  postcode: { label: me.Manage[0].postcode, value: me.Manage[0].postcode },
                  organizationType: { label: me.Manage[0].organization_type.label, value: me.Manage[0].organization_type["@id"] },
              }
            : null
    );

    const updateOrgnisation = (key, value) => {
        setOrganisation({ ...organisation, [key]: value });
    };
    const [errors, setErrors] = useState({});
    const apiFetch = useApiFetch();

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

    const getCity = (controller, cityCode) => {
        return getCityByCode(cityCode, { controller });
    };

    useEffect(() => {
        const controller = new AbortController();
        getCity(controller, organisation.citycode).then((data) => {
            updateOrgnisation("city", { label: data.nom, value: data.code });
            setCityIsLoading(false);
        });
        getOrganizationTypePossibility().then((data) => setTypePossibility({ list: data, isLoading: false }));
    }, []);

    useEffect(() => {
        updateLocationPossibility({ args: { codeCity: organisation.city?.value, postcode: organisation.postcode?.value } }).then(function (d) {
            if (d.length === 1 && d[0].id === "cities" && d[0].data.length === 1) {
                if (d[0].data[0].codesPostaux.length === 1 && !organisation.postcode) {
                    setOrganisation({ ...organisation, postcode: { label: d[0].data[0].codesPostaux[0], value: d[0].data[0].codesPostaux[0] } });
                } else if (!organisation.city) {
                    console.log("ui");
                    setOrganisation({ ...organisation, city: { label: d[0].data[0].nom, value: d[0].data[0].code } });
                }
            } // this if statement set the value of the city and postcode if there is only one possibility for the given value (lagny le sec {code: 60341} as one postcode so the postcode will be set in the organisation)
            setLocationPossibilityIsLoading(false);
        });
    }, [organisation.postcode, organisation.city]);

    return (
        <div className={style.formContainer}>
            <Input
                type="select"
                name="organisation"
                label="selectionner une organisation"
                extra={{
                    options: me.Manage.map(function ({ organizer_name, id }) {
                        return { value: id, label: organizer_name };
                    }),
                    required: true,
                    value: { label: organisation.organizer_name, value: organisation.id },
                }}
                onChange={(d) => {
                    const o = me.Manage.find((o) => o.id === d.value);
                    setOrganisation({ ...o, cityCode: o.city });
                }}
            />
            <Hbar />
            <BOForm
                handleSubmit={function () {
                    const data = {
                        organizerName: organisation.organizer_name,
                        email: organisation.email,
                        numberPhone: organisation.number_phone,
                        websiteUrl: organisation.website_url,
                        address: organisation.address,
                        city: organisation.city?.value,
                        postcode: organisation.postcode?.value,
                        intraCommunityVat: organisation.intra_community_vat,
                        numberSiret: organisation.number_siret,
                        country: organisation.country,
                        organizationType: organisation.organizationType.value,
                        description: organisation.description,
                    };
                    const promise = apiFetch(`/organizations/${organisation.id}`, {
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
                        <Input
                            type="text"
                            name="organizer_name"
                            label="Nom de l'organisation"
                            onChange={(d) => updateOrgnisation("organizer_name", d)}
                            extra={{ value: organisation.organizer_name }}
                        />
                        <Input
                            type="select"
                            name="type"
                            label="Type"
                            extra={{ isLoading: typePossibility.isLoading, options: typePossibility.list, required: true, value: organisation.organizationType }}
                            onChange={(d) => updateOrgnisation("organizationType", d)}
                        />

                        <Input type="text" name="email" label="Email" onChange={(d) => updateOrgnisation("email", d)} extra={{ value: organisation.email }} />
                        <Input type="text" name="number_phone" label="Numéro de téléphone" onChange={(d) => updateOrgnisation("number_phone", d)} extra={{ value: organisation.number_phone }} />
                        <Input type="text" name="website_url" label="Site web" onChange={(d) => updateOrgnisation("website_url", d)} extra={{ value: organisation.website_url }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                        {" "}
                        <Input type="text" name="address" label="Adresse" onChange={(d) => updateOrgnisation("address", d)} extra={{ value: organisation.address }} />
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <Input
                                type="select"
                                name="city"
                                label="Ville"
                                extra={{
                                    isLoading: organisation.locationPossibilityIsLoading,
                                    value: organisation.city,
                                    isClearable: true,
                                    required: true,
                                    options: citiesPossibility,
                                    multiple: false,
                                    onInputChange: (cityName, { action }) => {
                                        if (action === "menu-close") {
                                            updateLocationPossibility({ id: "city", args: { codeCity: organisation.city?.value, city: "" } });
                                        }
                                        if (action === "input-change") {
                                            updateLocationPossibility({ id: "city", args: { city: cityName } });
                                        }
                                    },
                                }}
                                onChange={(d) => updateOrgnisation("city", d)}
                            />

                            <Input
                                type="select"
                                name="postalCode"
                                label="Code postal"
                                extra={{
                                    isLoading: locationPossibilityIsLoading,
                                    value: organisation.postcode,
                                    isClearable: true,
                                    required: true,
                                    options: postalCodesPossibility,
                                    multiple: false,
                                    onInputChange: (_postcode, { action }) => {
                                        if (action === "menu-close") {
                                            updateLocationPossibility({ id: "city", args: { postcode: organisation.postcode?.value } });
                                        }
                                        if (action === "input-change" && _postcode.length === 5) {
                                            updateLocationPossibility({ id: "city", args: { postcode: _postcode } });
                                        }
                                    },
                                }}
                                onChange={(d) => updateOrgnisation("postcode", d)}
                            />
                        </div>
                        <Input type="text" name="country" label="Pays" onChange={(d) => updateOrgnisation("country", d)} extra={{ value: organisation.country }} />
                        <Input
                            type="text"
                            name="intra_community_vat"
                            label="Numéro de TVA"
                            onChange={(d) => updateOrgnisation("intra_community_vat", d)}
                            defaultValue={organisation.intra_community_vat}
                        />
                        <Input type="text" name="number_siret" label="Numéro de SIRET" onChange={(d) => updateOrgnisation("number_siret", d)} extra={{ value: organisation.number_siret }} />
                    </div>
                </div>
                <div className="test">
                    <h2>Présentation</h2>
                </div>

                <Input type="textarea" name="description" extra={{ rows: 16, value: organisation.description }} label="Description" onChange={(d) => updateOrgnisation("country", d)}></Input>
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
                    <Button
                        type="submit"
                        name="Mettre à jour"
                        color={cityIsLoading ? "grey" : "black"}
                        textColor={"white"}
                        padding={"14px 30px"}
                        border={false}
                        borderRadius={"44px"}
                        width={"245px"}
                        disabled={cityIsLoading}
                    />
                </div>
            </BOForm>
        </div>
    );
}
