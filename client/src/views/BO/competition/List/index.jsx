import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BOList from "@/components/organisms/BO/List";
import useApiFetch from "@/hooks/useApiFetch";
import Button from "@/components/atoms/Button";
import useLocation from "@/hooks/useLocation";
import { toast } from "react-toastify";

export default function CompetitionsList() {
    const { getCityByCode, getDepartmentByCode, getRegionByCode } = useLocation();
    const apiFetch = useApiFetch();
    const navigate = useNavigate();
    const [competitions, setCompetitions] = useState([]);

    function getCompetitions() {
        return apiFetch("/competitions", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then(async (data) => {
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                console.debug(data);
                const hydraMember = data["hydra:member"];
                const _competitions =  await Promise.all(
                    hydraMember.map((competition) => {
                        return Promise.all([
                            Promise.all(competition.city_criteria.map(getCityByCode)),
                            Promise.all(competition.department_criteria.map(getDepartmentByCode)),
                            Promise.all(competition.region_criteria.map(getRegionByCode)),
                        ]).then(([city, department, region]) => {
                            return {
                                ...competition,
                                city_criteria: city,
                                department_criteria: department,
                                region_criteria: region,
                            };
                        });
                    })
                )
                setCompetitions(_competitions);
                return _competitions;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        const promise = getCompetitions()
        toast.promise(promise, {
            pending: "Chargement des concours",
            success: "Concours chargés",
            error: "Erreur lors du chargement des concours",
        });
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
                toast.success("Concours supprimé");
            })
            .catch((error) => {
                console.error(error);
                toast.error("Erreur lors de la suppression du concours");
            })
            .finally(() => {
                getCompetitions();
            });
    };

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <h1>Liste des concours</h1>
                <Button color="green" textColor="white" name="Créer un concours" onClick={() => navigate("/BO/competition/create")}></Button>
            </div>

            <BOList
                entityList={competitions}
                fields={[
                    { property: "id", display: "ID" },
                    { property: "state", display: "Statut" },
                    { property: "competition_name", display: "Nom" },
                    { property: "description", display: "Description" },
                    { property: "rules", display: "Règlement" },
                    { property: "endowments", display: "Dotation" },
                    { property: "creation_date", display: "Date de création" },
                    { property: "publication_date", display: "Date de publication" },
                    { property: "publication_start_date", display: "Date de commencement" },
                    { property: "voting_start_date", display: "Date de début de vote" },
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
                        label: "Modifier",
                        color: "blue",
                        textColor: "white",
                        action: ({ entity }) => {
                            navigate("/BO/competition/edit/" + entity.id);
                        },
                    },
                    {
                        label: "Supprimer",
                        color: "red",
                        textColor: "white",
                        action: ({ entity }) => {
                            if (confirm("Êtes-vous sûr de vouloir supprimer ce concours ?")) {
                                return handleDelete(entity.id);
                            }
                        },
                    },
                    {
                        label: "Voir",
                        action: ({ entity }) => {
                            navigate("/BO/competition/" + entity.id);
                        },
                    },
                ]}
            />
        </div>
    );
}
