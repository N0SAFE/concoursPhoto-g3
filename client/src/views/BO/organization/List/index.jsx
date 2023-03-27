import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
                console.log(data);
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                console.log(data["hydra:member"]);
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
            <Link to={"/BO/organization/create"}>Créer un utilisateur</Link>
            <h1>Listes des organisations</h1>
            <BOList
                entityList={Organizations}
                fields={[
                    { property: "id", display: "ID" },
                    { property: "state", display: "Statut" },
                    { property: "organizer_name", display: "Nom de l'organisation" },
                    { property: "description", display: "description" },
                    { property: "address", display: "address" },
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
                        label: "Edit",
                        action: ({ entity }) => {
                            navigate("/BO/user/" + entity.id);
                        },
                    },
                    {
                        label: "Delete",
                        action: ({ entity }) => {
                            if (confirm("Êtes-vous sûr de vouloir supprimer cet organisation ?")) {
                                return handleDelete(entity.id);
                            }
                        },
                    },
                ]}
            />
        </div>
    );
}