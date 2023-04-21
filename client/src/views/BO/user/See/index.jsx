import React from "react";
import BOSee from "@/components/organisms/BO/See";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useApiFetch from "@/hooks/useApiFetch";
import useLocation from "@/hooks/useLocation";
import { toast } from "react-toastify";

export default function () {
    const apiFetch = useApiFetch();
    const { getCityByCode } = useLocation();
    const [entity, setEntity] = useState({});
    const { id: userId } = useParams();

    const getUser = (controller) => {
        return apiFetch("/users/" + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            signal: controller?.signal,
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                return getCityByCode(data.city).then((city) => {
                    return setEntity({ ...data, city: city.nom });
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        const controller = new AbortController();
        const promise = getUser(controller);
        if(import.meta.env.MODE === 'development'){
            toast.promise(promise, {
                pending: "Chargement de l'utilisateur",
                success: "Utilisateur chargé",
                error: "Erreur lors du chargement de l'utilisateur",
            });
        }
        return () => setTimeout(() => controller.abort());
    }, []);

    return (
        <BOSee
            entity={entity}
            properties={[
                {
                    display: "Nom",
                    name: "lastname",
                },
                {
                    display: "Prénom",
                    name: "firstname",
                },
                {
                    display: "Email",
                    name: "email",
                },
                {
                    display: "Téléphone",
                    name: "phone_number",
                },
                {
                    display: "Adresse",
                    name: "address",
                },
                {
                    display: "Code postal",
                    name: "postcode",
                },
                {
                    display: "Statut",
                    name: "personal_statut",
                    customData({ entity, property }) {
                        return entity?.personal_statut?.label;
                    },
                },
                {
                    display: "Ville",
                    name: "city",
                },
                {
                    display: "Pays",
                    name: "country",
                },
                {
                    display: "Date de naissance",
                    name: "date_of_birth",
                    customData({ entity, property }) {
                        return new Date(entity?.date_of_birth).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        });
                    },
                },
                {
                    display: "Genre",
                    name: "gender",
                    customData({ entity, property }) {
                        return entity?.gender?.label;
                    },
                },
                {
                    display: "Roles",
                    name: "roles",
                    customData({ entity, property }) {
                        return "[" + (entity?.roles?.join(", ") || "") + "]";
                    },
                },
            ]}
        />
    );
}
