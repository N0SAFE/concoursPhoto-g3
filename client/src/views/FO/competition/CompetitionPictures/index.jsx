import useApiPath from "@/hooks/useApiPath.js";
import useApiFetch from "@/hooks/useApiFetch.js";
import useLocation from "@/hooks/useLocation.js";
import {useEffect, useState} from "react";
import {Outlet, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import style from "./style.module.scss";
import Chip from "@/components/atoms/Chip/index.jsx";

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
        toast.promise(promise, {
            pending: "Chargement du concours",
            success: "Concours chargé",
            error: "Erreur lors du chargement du concours",
        });
        return () => setTimeout(() => controller.abort());
    }, []);

    return (
        <>
            <div>
                <div className={style.picturesContainer}>
                    {entity.pictures && entity.pictures.map((picture) => (
                        <div key={picture.id}>
                            <div>
                                <img src={import.meta.env.VITE_API_URL + "/" + picture.file.path} alt={picture.picture_name} />
                            </div>
                            <div className={style.picturesStats}>
                                <div>
                                    <Chip backgroundColor={"#F5F5F5"} title={`${picture.user.firstname} ${picture.user.lastname}`} icon={"user-plus"} />
                                </div>
                                <div>
                                    <Chip backgroundColor={"#F5F5F5"} icon={"user-plus"} />
                                    <Chip iconColor={"white"} color={"white"} backgroundColor={"#A8A8A8"} title={"Voter"} icon={"like"} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
