import style from "./style.module.scss";
import Card from "@/components/molecules/Card";
import { useEffect, useState } from "react";
import useApiFetch from "@/hooks/useApiFetch";
import {toast} from "react-toastify";
import useLocation from "@/hooks/useLocation";

export default function FOCompetitionList() {
    const apiFetch = useApiFetch();
    const { getCityByCode, getDepartmentByCode, getRegionByCode } = useLocation();

    const [competitions, setCompetitions] = useState([]);

    function getListCompetitions() {
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
                const _competitions = await Promise.all(
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
                console.log(_competitions);
                setCompetitions(_competitions);
                return _competitions;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const getVotes = () => {
        return apiFetch("/votes", {
            method: "GET",
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
        const promise = getListCompetitions()
        toast.promise(promise, {
            pending: "Chargement des concours",
            success: "Concours chargés",
            error: "Erreur lors du chargement des concours",
        });
        getVotes()
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
                                        item.label
                                    }
                                ),
                                competition.state ? "En cours" : "Terminé",
                            ]}
                            stats={[
                                {name: competition.pictures.length, icon: "user-plus"},
                                {name: competition.pictures.length, icon: "camera"},
                                {name: competition.number_of_max_votes, icon: "like"}
                            ]}
                            finalDate={new Date(competition.submission_end_date).toLocaleDateString("fr-FR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        />
                    )
                })}
            </div>
        </div>
    );
}
