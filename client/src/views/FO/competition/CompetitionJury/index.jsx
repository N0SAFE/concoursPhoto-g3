import useApiPath from "@/hooks/useApiPath.js";
import useApiFetch from "@/hooks/useApiFetch.js";
import useLocation from "@/hooks/useLocation.js";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import style from "./style.module.scss";

export default function(){
    const apiPath = useApiPath();
    const apiFetch = useApiFetch();
    const {getCityByCode, getDepartmentByCode, getRegionByCode } = useLocation();
    const [entity, setEntity] = useState({});
    const { id: competitionId } = useParams();

    const getCompetitions = (controller) => {
        return apiFetch("/competitions/" + competitionId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            signal: controller?.signal,
        })
            .then((res) => res.json())
            .then((data) => {
                console.debug(data);
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                Promise.all([
                    Promise.all(data.city_criteria.map(getCityByCode)),
                    Promise.all(data.department_criteria.map(getDepartmentByCode)),
                    Promise.all(data.region_criteria.map(getRegionByCode)),
                ]).then(([cities, departments, regions]) => {
                    const _competition = {
                        ...data,
                        city_criteria: cities,
                        department_criteria: departments,
                        region_criteria: regions,
                        numberOfUser: data.pictures.reduce(
                            (set, p) => set.add(p.user.id),
                            new Set()).size,
                        numberOfVotes: data.pictures.reduce(
                            (sum, p) => sum + p.votes.length,
                            0),
                    }
                    setEntity(_competition);
                    return _competition;
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        const controller = new AbortController();
        const promise = getCompetitions(controller);
        if(import.meta.env.MODE === 'development'){
            toast.promise(promise, {
                pending: "Chargement du concours",
                success: "Concours chargé",
                error: "Erreur lors du chargement du concours",
            });
        }
        return () => setTimeout(() => controller.abort());
    }, []);

    return (
        <div className={style.juryContainer}>
            {entity.memberOfTheJuries && entity.memberOfTheJuries.length > 0 && (
                <div>
                    <h2>{entity.memberOfTheJuries.length} membre(s) du jury</h2>
                    <ul>
                        {entity.memberOfTheJuries.map((jury) => (
                            <li key={jury.id}>
                                {jury.user.firstname} {jury.user.lastname}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
