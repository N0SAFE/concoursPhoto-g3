import useApiFetch from "@/hooks/useApiFetch";
import { useEffect, useState } from "react";
import style from "./style.module.scss";
import { toast } from "react-toastify";

export default function FOStats() {
    const apiFetch = useApiFetch();
    const [competitions, setCompetitions] = useState([]);
    const [organizers, setOrganizers] = useState([]);
    const [pictures, setPictures] = useState([]);
    const [members, setMembers] = useState([]);
    const [photographers, setPhotographers] = useState([]);

    const getCompetitions = (controller) => {
        return apiFetch("/competitions", {
            method: "GET",
            signal: controller?.signal,
        })
            .then((r) => r.json())
            .then((data) => {
                console.debug(data);
                setCompetitions(data["hydra:member"].length);
            });
    };

    const getPictures = (controller) => {
        return apiFetch("/pictures", {
            method: "GET",
            signal: controller?.signal,
        })
            .then((r) => r.json())
            .then((data) => {
                console.debug(data);
                setPictures(data["hydra:member"].length);
            });
    };

    const getMembers = (controller) => {
        return apiFetch("/users", {
            method: "GET",
            signal: controller?.signal,
        })
            .then((r) => r.json())
            .then((data) => {
                console.debug(data["hydra:member"]);
                setMembers(data["hydra:member"].length);

                const photographers = [];
                data["hydra:member"].map((item) => {
                    if (item.roles.includes("ROLE_PHOTOGRAPHER")) {
                        photographers.push(item);
                    }
                });
                setPhotographers(photographers.length);

                const organizers = [];
                data["hydra:member"].map((item) => {
                    if (item.roles.includes("ROLE_ORGANIZER")) {
                        organizers.push(item);
                    }
                });
                setOrganizers(organizers.length);
            });
    };

    useEffect(() => {
        const controller = new AbortController();
        const promise = Promise.all([getCompetitions(controller), getPictures(controller), getMembers(controller)]);
        toast.promise(promise, {
            pending: "Chargement des statistiques",
            success: "Statistiques chargées",
            error: "Erreur lors du chargement des statistiques",
        });
        return () => setTimeout(() => controller.abort());
    }, []);

    return (
        <div className={style.containerStats}>
            <span>{competitions} concours publiés</span>
            <span>|</span>
            <span>{organizers} organisateurs</span>
            <span>|</span>
            <span>{photographers} photographes</span>
            <span>|</span>
            <span>{pictures} photos</span>
            <span>|</span>
            <span>{members} membres</span>
        </div>
    );
}
