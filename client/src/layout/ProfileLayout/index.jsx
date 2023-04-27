import Loader from "@/components/atoms/Loader/index.jsx";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import useApiFetch from "@/hooks/useApiFetch.js";
import Navlink from "@/components/molecules/Navlink";

const profileRouteList = [
    { content: "Mon profil", to: "/me" },
    { content: "Mes préférences", to: "/preference" },
    { content: "Mes organisations", to: "/myorganization" },
    { content: "Concours créés par mon organisation", to: "/me" },
    { content: "Concours auxquels j’ai participé", to: "/me" },
    { content: "Mes publicités", to: "/me" },
];

export default function ProfileLayout() {
    const apiFetch = useApiFetch()
    const [gendersPossibility, setGendersPossibility] = useState({ list: [], isLoading: true });
    const getGendersPossibility = () => {
        return apiFetch("/genders", {
            method: "GET",
        })
            .then((r) => r.json())
            .then((data) => {
                return data["hydra:member"].map(function (item) {
                    return { label: item.label, value: item["@id"] };
                });
            });
    };
    useEffect(() => {
        getGendersPossibility().then((data) => {
            setGendersPossibility({ list: data, isLoading: false });
        });
    }, []);
    return (
        <Loader active={gendersPossibility.isLoading}>
            <h2 style={{marginTop: "20px", marginBottom: "20px"}}>Mon profile</h2>
            <Navlink base="/profile" list={profileRouteList} />
            <Outlet context={{ gendersPossibility }} />
        </Loader>
    );
}
