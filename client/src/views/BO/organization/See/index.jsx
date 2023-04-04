import React from "react";
import BOSee from "@/components/organisms/BO/See";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useApiFetch from "@/hooks/useApiFetch";
import useLocation from "@/hooks/useLocation.js";
import { toast } from "react-toastify";

export default function () {
    const apiFetch = useApiFetch();
    const { getCityByCode } = useLocation();
    const [entity, setEntity] = useState({});
    const { id: organizationId } = useParams();

    const getOrganizations = () => {
        return apiFetch("/organizations/" + organizationId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.debug(data);
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                setEntity(data);
                getCityByCode(data.city).then((city) => {
                    setEntity((entity) => {
                        return {
                            ...entity,
                            city: city.nom,
                        };
                    });
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        const promise = getOrganizations();
        toast.promise(promise, {
            pending: "Chargement de l'oranisation",
            success: "l'Organization a bien chargé",
            error: "Erreur lors du chargement de l'organisation",
        });
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
                    display: "Site web",
                    name: "website_url",
                },
                {
                    display: "Description",
                    name: "description",
                },
                { display: "Logo", name: "logo" },
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
                        console.log(entity);
                        return entity?.competitions?.map((competition) => competition.competition_name).join(", ");
                    },
                },
            ]}
        />
    );
}
