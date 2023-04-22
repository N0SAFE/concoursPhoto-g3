import style from "./style.module.scss";
import Card from "@/components/molecules/Card";
import {useEffect, useState} from "react";
import useApiFetch from "@/hooks/useApiFetch";
import {toast} from "react-toastify";
import useLocation from "@/hooks/useLocation";

export default function FOCompetitionList() {
    const apiFetch = useApiFetch();
    const {getCityByCode, getDepartmentByCode, getRegionByCode} = useLocation();
    const [usersInCompetition, setUsersInCompetition] = useState([]);
    const [competitions, setCompetitions] = useState([]);

    function getListCompetitions(controller) {
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
                const _competitions = data['hydra:member'].map(function (c) {
                    const {numOfPictures, numOfVotes} = c.pictures.reduce(({numOfPictures, set, numOfVotes}, p) => {
                        if (!set.has(p.user.id)) {
                            set.add(p.user.id)
                            return {numOfPictures: numOfPictures + 1, set, numOfVotes: numOfVotes + p.votes.length}
                        }
                        return {numOfPictures, set, numOfVotes: numOfVotes + p.votes.length}
                    }, {numOfPictures: 0, set: new Set(), numOfVotes: 0})
                    c.numberOfUser = numOfPictures;
                    c.numberOfVotes = numOfVotes
                    return c
                })
                console.debug(_competitions)
                setCompetitions(data["hydra:member"]);
                return data["hydra:member"];
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        const controller = new AbortController();
        const promise = Promise.all([getListCompetitions(controller)]);
        if(import.meta.env.MODE === 'development'){
            toast.promise(promise, {
                pending: "Chargement des concours",
                success: "Concours chargés",
                error: "Erreur lors du chargement des concours",
            });
        }
        return () => setTimeout(() => controller.abort());
    }, []);

    return (
        <div className={style.lastCompetition}>
            <div>
                {competitions.map((competition) => {
                    return (
                        <Card
                            idContent={competition.id}
                            title={competition.competition_name}
                            imagePath={competition.competition_visual.path}
                            filters={[
                                competition.organization?.users.map((user) => (user.firstname + " " + user.lastname)),
                                competition?.theme.map((item) => (item.label)),
                                competition.state ? "En cours" : "Terminé",
                            ]}
                            stats={[
                                {name: competition.numberOfUser, icon: "user-plus"},
                                {name: competition.pictures.length, icon: "camera"},
                                {name: competition.numberOfVotes, icon: "like"},
                            ]}
                            finalDate={new Date(competition.submission_end_date).toLocaleDateString("fr-FR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        />
                    );
                })}
            </div>
        </div>
    );
}
