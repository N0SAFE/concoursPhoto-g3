import style from "./style.module.scss";
import FOCompetitionList from "@/components/organisms/FO/FOCompetitionList";
import FOCompetitionPortalList from "@/components/organisms/FO/FOCompetitionPortalList";
import FOStats from "@/components/organisms/FO/FOStats";

export default function Home() {
    return (
        <div className={style.homeContainer}>
            <div className={style.homeBanner}>
                <div>
                    <h1>Le portail des concours photo</h1>
                </div>
                <FOStats />
            </div>
            <FOCompetitionPortalList />

            <h2 className={style.titleMargin}>Derniers concours photo publiés</h2>
            <FOCompetitionList />
        </div>
    )
}
