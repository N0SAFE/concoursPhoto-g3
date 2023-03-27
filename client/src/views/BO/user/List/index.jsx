import {useState, useEffect} from 'react';
import {Link, useNavigate} from "react-router-dom";
import BOList from "@/components/organisms/BO/List";
import useApiFetch from '@/hooks/useApiFetch.js';

export default function UserList() {
    const apiFetch = useApiFetch()
    const [users, setUsers] = useState([]);

    const navigate = useNavigate();

    function getUsers() {
        apiFetch("/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.code === 401) {
                    throw new Error(data.message)
                }
                setUsers(data['hydra:member']);
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        getUsers();
    }, []);

    const handleDelete = (id) => {
        fetch(new URL(import.meta.env.VITE_API_URL + "/users/" + id).href, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.code === 401) {
                    throw new Error(data.message)
                }
            })
            .catch(error => {
                    console.error(error);
                }
            )
            .finally(() => {
                getUsers();
            });
    }

    return (
        <div>
            <Link to={"/BO/user/create"}>Créer un utilisateur</Link>
            <h1>Listes des utilisateurs</h1>
            <BOList
                entityList={users}
                fields={[
                    {property: "id", display: "ID"},
                    {property: "state", display: "Etat"},
                    {property: "email", display: "Email"},
                    {property: "roles", display: "Roles"},
                    {property: "firstname", display: "Prénom"},
                    {property: "lastname", display: "Nom"},
                    {property: "creation_date", display: "Date de création"},
                    {property: "gender", display: "Genre"},
                    {property: "address", display: "Adresse"},
                    {property: "postcode", display: "Code postal"},
                    {property: "city", display: "Ville"},
                    {property: "country", display: "Pays"},
                    {property: "phone_number", display: "Numéro de téléphone"},
                ]}
                customAction={({entity, property}) => {
                    if (property === "roles") {
                        return (
                            <div>
                                {entity.roles.map((role, index) => (
                                    <span key={index}>{role}</span>
                                ))}
                            </div>
                        )
                    }
                    if (property === "state"){
                        return entity.state ? "Actif" : "Inactif"
                    }

                    if (property === "creation_date") {
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
                        action: ({entity}) => {
                            navigate("/BO/user/" +entity.id)
                        }
                    },
                    {
                        label: "Delete",
                        action: ({entity}) => {
                            if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
                                return handleDelete(entity.id);
                            }
                        }
                    }
                ]}
            />
        </div>
    )
}
