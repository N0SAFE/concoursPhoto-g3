import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BOList from "@/components/organisms/BO/List";
import useApiFetch from "@/hooks/useApiFetch.js";

export default function CompetitionsList() {
    const apiFetch = useApiFetch();
    const navigate = useNavigate();
    const [competitions, setCompetitions] = useState([]);

    function getCompetitions() {
        apiFetch("/competitions", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                console.debug(data);
                setCompetitions(data["hydra:member"]);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        getCompetitions();
    }, []);

    const handleDelete = (id) => {
        apiFetch("/competitions/" + id, {
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
                getCompetitions();
            });
    };

    return (
        <div>
            <Link to={"/BO/competitions/create"}>Créer un concours</Link>
            <h1>Liste des concours</h1>
            <BOList
                entityList={competitions}
                fields={[
                    { property: "id", display: "ID" },
                    { property: "state", display: "Statut" },
                    { property: "competition_name", display: "Nom" },
                    { property: "description", display: "description" },
                    { property: "rules", display: "Règlement" },
                    { property: "endowments", display: "Dotation" },
                    { property: "creation_date", display: "Date de création" },
                    { property: "publication_date", display: "Date de publication" },
                    { property: "publication_start_date", display: "Date de commencement" },
                    { property: "voting_start_date", display: "Date début vote" },
                ]}
                customAction={({ entity, property }) => {
                    if (property === "creation_date") {
                        return new Date(entity.creation_date).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        });
                    }
                    if (property === "voting_start_date") {
                        return new Date(entity.voting_start_date).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        });
                    }
                    if (property === "publication_date") {
                        return new Date(entity.publication_date).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        });
                    }
                    if (property === "publication_start_date") {
                        return new Date(entity.publication_start_date).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        });
                    }
                    if (property === "state") {
                        return entity.state ? "Validée" : "En attente";
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
