import style from "./style.module.scss";
import Card from "@/components/molecules/Card";
import { useEffect, useState } from "react";
import useApiFetch from "@/hooks/useApiFetch";
import { toast } from "react-toastify";
import useLocation from "@/hooks/useLocation";

export default function FOCompetitionList() {
    const apiFetch = useApiFetch();
    const { getCityByCode, getDepartmentByCode, getRegionByCode } = useLocation();

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
                setCompetitions(data["hydra:member"]);
                return data["hydra:member"];
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const getVotes = (controller) => {
        return apiFetch("/votes", {
            method: "GET",
            signal: controller?.signal,
        })
            .then((r) => r.json())
            .then((data) => {
                console.log(data);
                console.debug(data);
                return data["hydra:member"].map(function (item) {
                    return { label: item.vote_date, value: item["@id"] };
                });
            });
    };

    useEffect(() => {
        const controller = new AbortController();
        const promise = Promise.all([getListCompetitions(controller), getVotes(controller)]);
        toast.promise(promise, {
            pending: "Chargement des concours",
            success: "Concours chargés",
            error: "Erreur lors du chargement des concours",
        });
        return () => setTimeout(() => controller.abort());
    }, []);

    return (
        <div className={style.lastCompetition}>
            <div>
                {competitions.map((competition) => {
                    return (
                        <Card
                            title={competition.competition_name}
                            imagePath={"https://florianbompan.com/wp-content/uploads/2021/08/P1088718-2-scaled.jpg"}
                            filters={[
                                "Organisateur",
                                competition.theme.map((item) => {
                                    item.label;
                                }),
                                competition.state ? "En cours" : "Terminé",
                            ]}
                            stats={[
                                { name: competition.pictures.length, icon: "user-plus" },
                                { name: competition.pictures.length, icon: "camera" },
                                { name: competition.number_of_max_votes, icon: "like" },
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
