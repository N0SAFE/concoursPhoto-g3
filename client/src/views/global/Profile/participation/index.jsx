import {useAuthContext} from "@/contexts/AuthContext.jsx";
import Navlink from "@/components/molecules/Navlink/index.jsx";
import Table from "@/components/molecules/Table"
import useApiFetch from "@/hooks/useApiFetch.js";
import {useEffect, useState} from "react";
import style from "./style.module.scss";
import Chip from "@/components/atoms/Chip/index.jsx";

export default function CompetitionParticipation() {
    const {me} = useAuthContext();
    const apiFetch = useApiFetch();
    const [userCompetitions, setUserCompetitions] = useState([]);

    const getUserCompetitions = () => {
        return apiFetch(`/users/${me.id}/user-competitions`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json()).then((data) => {
            console.debug(data);
            if (data.code === 401) {
                throw new Error(data.message);
            }
            setUserCompetitions(data['hydra:member']);
            return data;
        }).catch((error) => {
            console.error(error);
        });
    }

    useEffect(() => {
        const controller = new AbortController();

        // get last pictures posted in this competition
        getUserCompetitions();

        return () => setTimeout(() => controller.abort());
    }, []);

    const profileRouteList = [
        {content: "Mon profil", to: "/me"},
        {content: "Mes préférences", to: "/preference"},
        {content: "Mes organisations", to: "/myorganization"},
        {content: "Concours créés par mon organisation", to: "/me"},
        {content: "Concours auxquels j’ai participé", to: "/participations"},
        {content: "Mes publicités", to: "/me"},
    ];

    return (
        <div className={style.participationsContainer}>
            <h1>Mon compte</h1>
            <Navlink base="/profile" list={profileRouteList}/>
            <Table entityList={userCompetitions}
                   fields={[
                       {property: "competition_name", display: "Nom du concours"},
                       {property: "submission_start_date", display: "Date de début du concours"},
                       {property: "submission_end_date", display: "Date de fin du concours"},
                       {property: "state", display: "Statut"},
                       {property: "number_of_pictures", display: "Mes photos"},
                       {property: "results_date", display: "Résultat"},
                   ]}
                   customAction={({entity, property}) => {
                       if (property === "state") {
                           return entity.state ? <Chip backgroundColor={"#00CE3A"} color={"white"} title={"En cours"} /> : <Chip backgroundColor={"#F1F1F1"} title={"Terminé"} />;
                       }
                       if (property === "submission_start_date") {
                           return new Date(entity.submission_start_date).toLocaleDateString("fr-FR", {
                               year: "numeric",
                               month: "long",
                               day: "numeric",
                           });
                       }
                       if (property === "submission_end_date") {
                           return new Date(entity.submission_end_date).toLocaleDateString("fr-FR", {
                               year: "numeric",
                               month: "long",
                               day: "numeric",
                           });
                       }
                       if (property === "results_date") {
                           return new Date(entity.results_date).toLocaleDateString("fr-FR", {
                               year: "numeric",
                               month: "long",
                               day: "numeric",
                           });
                       }
                   }}
            />
        </div>
    )
}