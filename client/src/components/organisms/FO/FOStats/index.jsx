import useApiFetch from "@/hooks/useApiFetch";
import {useEffect, useState} from "react";
import style from "./style.module.scss";

export default function FOStats() {
    const apiFetch = useApiFetch();
    const [competitions, setCompetitions] = useState([]);
    const [organizers, setOrganizers] = useState([]);
    const [pictures, setPictures] = useState([]);
    const [members, setMembers] = useState([]);
    const [photographers, setPhotographers] = useState([]);

    const getCompetitions = () => {
        return apiFetch("/competitions", {
            method: "GET",
        })
            .then((r) => r.json())
            .then((data) => {
                console.debug(data);
                setCompetitions(data["hydra:member"].length);
            });
    };

    const getPictures = () => {
        return apiFetch("/pictures", {
            method: "GET",
        })
            .then((r) => r.json())
            .then((data) => {
                console.debug(data);
                setPictures(data["hydra:member"].length);
            });
    };

    const getMembers = () => {
        return apiFetch("/users", {
            method: "GET",
        })
            .then((r) => r.json())
            .then((data) => {
                console.debug(data["hydra:member"]);
                setMembers(data["hydra:member"].length);

                const photographers = [];
                data['hydra:member'].map((item) => {
                    if (item.roles.includes("ROLE_PHOTOGRAPHER")) {
                        photographers.push(item);
                    }
                })
                setPhotographers(photographers.length);

                const organizers = [];
                data['hydra:member'].map((item) => {
                    if (item.roles.includes("ROLE_ORGANIZER")) {
                        organizations.push(item);
                    }
                })
                setOrganizers(organizers.length);

            });
    }

    useEffect(() => {
        getCompetitions()
        getPictures()
        getMembers()
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
    )
}
