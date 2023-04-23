import Loader from "@/components/atoms/Loader/index.jsx";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import useApiFetch from "@/hooks/useApiFetch.js";

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
            <Outlet context={{ gendersPossibility }} />
        </Loader>
    );
}
