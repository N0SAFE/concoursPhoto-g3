import React from "react";
import BOSee from "@/components/organisms/BO/See";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useApiFetch from "@/hooks/useApiFetch";
import useLocation from "@/hooks/useLocation.js";
import { toast } from "react-toastify";
import toApiPath from "@/hooks/useApiFetch";

export default function () {
    const apiFetch = useApiFetch();
    const { getCityByCode } = useLocation();
    const [entity, setEntity] = useState({});
    const { id: organizationId } = useParams();

    const getOrganizations = (controller) => {
        return apiFetch("/organizations/" + organizationId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            signal: controller.signal,
        })
            .then((res) => res.json())
            .then((data) => {
                console.debug(data);
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                return getCityByCode(data.city).then((city) => {
                    return setEntity({ ...data, city: city.nom });
                });
            });
    };

    useEffect(() => {
        const controller = new AbortController();
        const promise = getOrganizations(controller);
        toast.promise(promise, {
            pending: "Chargement de l'oranisation",
            success: "l'Organization a bien chargé",
            error: "Erreur lors du chargement de l'organisation",
        });
        return () => setTimeout(() => controller.abort());
    }, []);

    return (
        <BOSee
            entity={entity}
            properties={[
                {
                    display: "Nom",
                    name: "organizer_name",
                },
                {
                    display: "Ville",
                    name: "city",
                },
                {
                    display: "Adresse",
                    name: "address",
                },
                {
                    display: "Code postal",
                    name: "postcode",
                },
                {
                    display: "pays",
                    name: "country",
                },
                {
                    display: "Téléphone",
                    name: "number_phone",
                },
                {
                    display: "Email",
                    name: "email",
                },
                {
                    display: "Numero de SIRET",
                    name: "number_siret",
                },
                {
                    display: "Numéro de TVA",
                    name: "intra_community_vat",
                },
                {
                    display: "Site web",
                    name: "website_url",
                },
                {
                    display: "Description",
                    name: "description",
                },
                {
                    display: "Logo",
                    name: "logo",
                    type: "img",
                    customData: ({ entity }) => {
                        return entity?.logo?.path ? { to: toApiPath(entity?.logo?.path), name: entity?.logo?.default_name } : null;
                    },
                },
                {
                    display: "Type d'organisation",
                    name: "type_organization",
                    customData: ({ entity }) => {
                        return entity?.organization_type?.label;
                    },
                },
                {
                    display: "Competitions",
                    name: "competitions",
                    customData: ({ entity }) => {
                        return entity?.competitions?.map((competition) => competition.competition_name).join(", ");
                    },
                },
            ]}
        />
    );
}
