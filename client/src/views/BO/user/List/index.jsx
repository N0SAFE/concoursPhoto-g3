import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BOList from "@/components/organisms/BO/List";
import useApiFetch from "@/hooks/useApiFetch";

export default function UserList() {
    const apiFetch = useApiFetch();
    const [users, setUsers] = useState([]);
    const [filterState, setFilterState] = useState("all");
    const [filterVerified, setFilterVerified] = useState("all");

    const navigate = useNavigate();

    function getUsers() {
        const params = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };
        if (filterState) {
            params.params = {
                state: filterState,
            };
        }
        if (filterVerified) {
            params.params = {
                is_verified: filterVerified,
            };
        }
        apiFetch("/users", {
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
                setUsers(data["hydra:member"]);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        getUsers();
    }, [filterState, filterVerified]);

    const handleDelete = (id) => {
        apiFetch("/users/" + id, {
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
                getUsers();
            });
    };

    const handleFilterChange = (e) => {
        if (e.target.id === "state-filter") {
            setFilterState(e.target.value);
        }
        if (e.target.id === "state-verifiedFilter") {
            setFilterVerified(e.target.value);
        }
    };

    const userFiltering = () => {
        let filteredUsers = users.filter((user) => {
            if (filterState !== "all") {
                if (filterVerified && user.state !== (filterState === "true")) {
                    return false;
                }
            }
            if (filterVerified !== "all") {
                if (filterState && user.is_verified !== (filterVerified === "true")) {
                    return false;
                }
            }
            return true;
        });
        return filteredUsers;
    };

    return (
        <div>
            <Link to={"/BO/user/create"}>Créer un utilisateur</Link>
            <h1>Liste des utilisateurs</h1>
            <div>
                <label htmlFor="state-filter">Filtrer par état :</label>
                <select id="state-filter" value={filterState} onChange={handleFilterChange}>
                    <option value="all">Tous</option>
                    <option value="true">Actif</option>
                    <option value="false">Inactif</option>
                </select>
                <label htmlFor="state-verifiedFilter">Filtrer par vérification :</label>
                <select id="state-verifiedFilter" value={filterVerified} onChange={handleFilterChange}>
                    <option value="all">Tous</option>
                    <option value="true">Vérifié</option>
                    <option value="false">Non vérifié</option>
                </select>
            </div>
            <BOList
                entityList={userFiltering()}
                fields={[
                    { property: "id", display: "ID" },
                    { property: "state", display: "Etat" },
                    { property: "email", display: "Email" },
                    { property: "roles", display: "Roles" },
                    { property: "firstname", display: "Prénom" },
                    { property: "lastname", display: "Nom" },
                    { property: "date_of_birth", display: "Date de naissance" },
                    { property: "creation_date", display: "Date de création" },
                    { property: "gender", display: "Genre" },
                    { property: "address", display: "Adresse" },
                    { property: "postcode", display: "Code postal" },
                    { property: "city", display: "Ville" },
                    { property: "country", display: "Pays" },
                    { property: "phone_number", display: "Numéro de téléphone" },
                    { property: "is_verified", display: "Vérification" },
                ]}
                customAction={({ entity, property }) => {
                    if (property === "roles") {
                        return (
                            <div>
                                {entity.roles.map((role, index) => (
                                    <span key={index}>{role}</span>
                                ))}
                            </div>
                        );
                    }
                    if (property === "state") {
                        return entity.state ? "Actif" : "Inactif";
                    }

                    if (property === "is_verified") {
                        return entity.is_verified ? "Vérifié" : "Non vérifié";
                    }

                    if (property === "creation_date") {
                        return new Date(entity.creation_date).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        });
                    }
                    if (property === "date_of_birth") {
                        return new Date(entity.creation_date).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        });
                    }

                    if (property === "gender") {
                        return entity.gender.label;
                    }
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
                            if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
                                return handleDelete(entity.id);
                            }
                        },
                    },
                ]}
            />
        </div>
    );
}
