import style from "./style.module.scss";
import FOCompetitionList from "@/components/organisms/FO/FOCompetitionList";
import FOStats from "@/components/organisms/FO/FOStats";
import FOPortalList from "@/components/organisms/FO/FOPortalList";
import Loader from "@/components/atoms/Loader/index.jsx";

export default function Home() {
    return (
            <div className={style.homeContainer}>
                <div className={style.homeBanner}>
                    <div>
                        <h1>Le portail des concours photo</h1>
                    </div>
                    <FOStats />
                </div>
                <FOPortalList
                    boxSingle={{ type: "picture", path: "/fixtures-upload/952-2160-2160.jpg", alt: "Photo de la page d'accueil" }}
                    boxUp={{ type: "picture", path: "/fixtures-upload/952-2160-2160.jpg", alt: "Photo de la page d'accueil" }}
                    boxDown={{ type: "picture", path: "/fixtures-upload/952-2160-2160.jpg", alt: "Photo de la page d'accueil" }}
                />

                <h2>Derniers concours photo publiés</h2>
                <FOCompetitionList />
            </div>
    );
}
