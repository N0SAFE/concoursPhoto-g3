import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {useAuthContext} from "@/contexts/AuthContext";
import FOCompetitionList from "@/components/organisms/FO/FOCompetitionList";
import FOCompetitionPortalList from "@/components/organisms/FO/FOCompetitionPortalList";

export default function Home() {
    return (
        <div>
            <h1>Le portail des concours photo</h1>
            <FOCompetitionPortalList />

            <h2>Derniers concours photo publiés</h2>
            <FOCompetitionList />
        </div>
    )
}
