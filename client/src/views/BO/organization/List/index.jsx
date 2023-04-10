import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BOList from "@/components/organisms/BO/List";
import useApiFetch from "@/hooks/useApiFetch.js";
import Button from "@/components/atoms/Button";
import useLocation from "@/hooks/useLocation";
import { toast } from "react-toastify";
import style from "./style.module.scss";

export default function OrganizationList() {
    const [Organizations, setOrganizations] = useState([]);
    const apiFetch = useApiFetch();
    const navigate = useNavigate();
    const { getCityByCode } = useLocation();

    function getOrganizations() {
        return apiFetch("/organizations", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then(async (data) => {
                console.debug(data);
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                const organizations = await Promise.all(data["hydra:member"].map((organization) => getCityByCode(organization.city).then((city) => ({...organization, city: city.nom}))));
                setOrganizations(organizations);
                return organizations;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        const promise = getOrganizations();
        toast.promise(promise, {
            pending: "Chargement des organisations",
            success: "Organisations chargées",
            error: "Erreur lors du chargement des organisations",
        });
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
                console.debug(data);
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
        <div className={style.containerList}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <h1>Liste des organisations</h1>
                <Button color="green" textColor="white" name="Créer une organisation" onClick={() => navigate("/BO/organization/create")}></Button>
            </div>
            <BOList
                entityList={Organizations}
                fields={[
                    { property: "id", display: "ID" },
                    { property: "state", display: "Statut" },
                    { property: "organizer_name", display: "Nom de l'organisation" },
                    { property: "description", display: "Description" },
                    { property: "address", display: "Addresse" },
                    { property: "postcode", display: "Code postal" },
                    { property: "city", display: "Ville" },
                    { property: "number_phone", display: "Téléphone" },
                    { property: "email", display: "Adresse mail" },
                    { property: "website_url", display: "Site web" },
                    { property: "organization_type", display: "Type d'organisation" },
                    { property: "country", display: "Pays" },
                    { property: "competitions", display: "Nom du concours" },
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
