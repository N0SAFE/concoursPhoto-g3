import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import BOList from "@/components/organisms/BO/List";

export default function OrganizationList() {
    const { token } = useAuthContext();
    const [Organizations, setOrganizations] = useState([]);

    const navigate = useNavigate();

    function getOrganizations() {
        fetch(new URL(import.meta.env.VITE_API_URL + "/organizations").href, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
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
    }, [token]);

    const handleDelete = (id) => {
        fetch(new URL(import.meta.env.VITE_API_URL + "/organizations/" + id).href, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
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
                    { property: "organization_type", display: "type d'organisation" },
                ]}
                customAction={({ entity, property }) => {
                    if (property === "organization_type") {
                        return entity.organization_type.label;
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
