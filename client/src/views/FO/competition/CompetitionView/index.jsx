import useApiPath from "@/hooks/useApiPath.js";
import useApiFetch from "@/hooks/useApiFetch.js";
import useLocation from "@/hooks/useLocation.js";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import style from "./style.module.scss";
import PicturesAside from "@/views/FO/competition/PicturesAside/index.jsx";

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
        <div className={style.container}>
            <div className={style.viewContainer}>
                {entity.description}
            </div>
            <PicturesAside requestType={"last-pictures-posted"} />
        </div>
    );
}
