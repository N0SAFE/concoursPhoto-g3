import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BOList from "@/components/organisms/BO/List";
import useApiFetch from "@/hooks/useApiFetch.js";

export default function OrganizationList() {
    const [Organizations, setOrganizations] = useState([]);
    const apiFetch = useApiFetch();

    const navigate = useNavigate();

    function getOrganizations() {
        apiFetch("/organizations", {
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
                console.debug(data["hydra:member"]);
                setOrganizations(data["hydra:member"]);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        getOrganizations();
    }, []);

    const handleDelete = (id) => {
        apiFetch("/organizations/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.code === 401) {
                    throw new Error(data.message);
                }
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                getOrganizations();
            });
    };

    return (
        <div>
            <h1>Listes des organisations</h1>
            <BOList
                entityList={Organizations}
                fields={[
                    { property: "id", display: "ID" },
                    { property: "state", display: "Statut" },
                    { property: "organizer_name", display: "Nom de l'organisation" },
                    { property: "description", display: "description" },
                    { property: "address", display: "addresse" },
                    { property: "postcode", display: "code postal" },
                    { property: "city", display: "ville" },
                    { property: "number_phone", display: "téléphone" },
                    { property: "email", display: "email" },
                    { property: "website_url", display: "site web" },
                    { property: "organization_type", display: "type d'organisation" },
                    { property: "country", display: "Pays" },
                    { property: "competitions", display: "Nom du Concour" },
                ]}
                customAction={({ entity, property }) => {
                    if (property === "organization_type") {
                        console.debug(entity);
                        return entity.organization_type.label;
                    }
                    if (property === "competitions") {
                        return entity.competitions.map((competition) => competition.competition_name).join(", ");
                    }
                    if (property === "state") {
                        return entity.state === "validated" ? "Validée" : "En attente";
                    }
                    return entity[property];
                }}
                actions={[
                    {
                        label: "Modifier",
                        color: "blue",
                        textColor: "white",
                        action: ({ entity }) => {
                            navigate("/BO/organization/edit/" + entity.id);
                        },
                    },
                    {
                        label: "Supprimer",
                        color: "red",
                        textColor: "white",
                        action: ({ entity }) => {
                            if (confirm("Êtes-vous sûr de vouloir supprimer cette organisation ?")) {
                                return handleDelete(entity.id);
                            }
                        },
                    },
                    {
                        label: "Voir",
                        action: ({ entity }) => {
                            navigate("/BO/organization/" + entity.id);
                        },
                    },
                ]}
            />
        </div>
    );
}
