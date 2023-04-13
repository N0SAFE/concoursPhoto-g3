import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BOList from "@/components/organisms/BO/List";
import useApiFetch from "@/hooks/useApiFetch";
import Button from "@/components/atoms/Button";
import useLocation from "@/hooks/useLocation";
import { toast } from "react-toastify";
import style from "./style.module.scss";

export default function CompetitionsList() {
    const { getCityByCode, getDepartmentByCode, getRegionByCode } = useLocation();
    const apiFetch = useApiFetch();
    const navigate = useNavigate();
    const [competitions, setCompetitions] = useState([]);

    function getCompetitions(controller) {
        return apiFetch("/competitions", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            signal: controller?.signal,
        })
            .then((res) => res.json())
            .then(async (data) => {
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                console.debug(data);
                setCompetitions(data['hydra:member']);
                return data['hydra:member'];
            })
    }

    useEffect(() => {
        const controller = new AbortController();
        const promise = getCompetitions(controller)
        toast.promise(promise, {
            pending: "Chargement des concours",
            success: "Concours chargés",
            error: "Erreur lors du chargement des concours",
        });
        return () => setTimeout(() => controller.abort());
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
        <div className={style.containerList}>
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
                    { property: "submission_start_date", display: "Date de commencement" },
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
                    if (property === "submission_start_date") {
                        return new Date(entity.submission_start_date).toLocaleDateString("fr-FR", {
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
