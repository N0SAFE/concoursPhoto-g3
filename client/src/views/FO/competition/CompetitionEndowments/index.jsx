import {useOutletContext, useParams} from "react-router-dom";
import Navlink from "@/components/molecules/Navlink/index.jsx";
import PicturesAside from "@/views/FO/competition/PicturesAside/index.jsx";
import style from "./style.module.scss"

export default function(){
    const { competition } = useOutletContext();

    const competitionRouteList = [
        { content: "Le concours", to: "" },
        { content: "Règlement", to: "/rules" },
        { content: "Prix à gagner", to: "/endowments" },
        { content: "Membres du Jury", to: "/jury" },
        { content: "Les photos", to: "/pictures" },
        { content: "Résultats", to: "/results" },
    ]

    return (
        <div>
            <div className={style.container}>
                <div className={style.endowmentsContainer}>
                    <Navlink base="/competition/:id" list={competitionRouteList} />
                    {competition.endowments}
                </div>
                <PicturesAside requestType={"last-pictures-obtained-votes"} />
            </div>
        </div>
    );
}
