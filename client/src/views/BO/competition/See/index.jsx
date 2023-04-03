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
    const { id: competitionId } = useParams();

    const getCompetitions = () => {
        return apiFetch("/competitions/" + competitionId, {
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
                Promise.all(data.city_criteria.map((cityCode) => {
                    return getCityByCode(cityCode).then((city) => city.nom);
                })).then((cities => {
                    setEntity((entity) => {
                        return {
                            ...entity,
                            city_criteria: cities,
                        };
                    });
                }))
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        const promise = getCompetitions();
        toast.promise(promise, {
            pending: "Chargement de du concours",
            success: "Concours chargé",
            error: "Erreur lors du chargement ddu consours",
        });
    }, []);

    return (
        <BOSee
            entity={entity}
            properties={[
                {
                    display: "nom",
                    name: "competition_name",
                },
                {
                    display: "Description",
                    name: "description",
                },
                {
                    display: "Date de création",
                    name: "creation_date",
                    type: "date",
                },
                {
                    display: "endowments",
                    name: "endowments",
                },
                {
                    display: "max age",
                    name: "max_age_criteria",
                },
                {
                    display: "min age",
                    name: "min_age_criteria",
                },
                {
                    display: "nombre de vote max",
                    name: "number_of_max_votes",
                },
                {
                    display: "nombre de prix",
                    name: "number_of_prices",
                },
                {
                    display: "organisation",
                    name: "organization",
                    customData({ entity, property }) {
                        return entity?.organization?.organizer_name;
                    },
                },
                {
                    display: "date de publication",
                    name: "publication_date",
                    type: "date",
                },
                {
                    display: "date début publication",
                    name: "publication_start_date",
                    type: "date",
                },
                {
                    display: "date début de soummision",
                    name: "submission_start_date",
                    type: "date",
                },
                {
                    display: "date de fin de soummision",
                    name: "submission_end_date",
                    type: "date",
                },
                {
                    display: "date de début de vote",
                    name: "voting_start_date",
                    type: "date",
                },
                {
                    display: "date de fin de vote",
                    name: "voting_end_date",
                    type: "date",
                },
                {
                    display: "date résultat",
                    name: "results_date",
                    type: "date",
                },
                {
                    display: "pondération vote jury",
                    name: "weighting_of_jury_votes",
                },
                {
                    display: "theme",
                    name: "theme",
                    customData({ entity, property }) {
                        return entity?.theme?.map((theme) => theme.label).join(", ");
                    },
                },
                {
                    display: "Ville",
                    name: "city_criteria",
                },
                {
                    display: "Pays",
                    name: "country_criteria",
                },
                {
                    display: "status",
                    name: "state",
                },
                {
                    display: "departement",
                    name: "department_criteria",

                },
                {
                    display: "rglement",
                    name: "rules",
                },

            ]}
        />
    );
}
