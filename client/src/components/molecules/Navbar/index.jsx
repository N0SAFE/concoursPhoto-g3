import style from "./style.module.scss";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import Dropdown from "@/components/atoms/Dropdown";

export default function Navbar() {
    const { me, isLogged } = useAuthContext();
    return (
        <nav className={style.nav}>
            <ul>
                <li>
                    <Link to={"/BO"}>Page d'accueil</Link>
                </li>
                <Dropdown
                    links={[
                        { title: "Liste des utilisateurs", to: "/BO/user" },
                        { title: "Ajout d'un utilisateur", to: "/BO/user/create" },
                    ]}
                    title={"Utilisateur"}
                    requireLogin={isLogged}
                    requireToken={true}
                />
                <Dropdown
                    links={[
                        { title: "Liste des organisations", to: "/BO/organization" },
                        { title: "Ajout d'une organisation", to: "/BO/organization/create" },
                    ]}
                    title={"Organisations"}
                    requireLogin={isLogged}
                    requireToken={true}
                />
                <Dropdown
                    links={[
                        { title: "Liste des concours", to: "/BO/competition" },
                        { title: "Ajout d'un concours", to: "/BO/competition/create" },
                    ]}
                    title={"Concours"}
                    requireLogin={isLogged}
                    requireToken={true}
                />
            </ul>
            <ul>
                <Dropdown
                    links={[
                        { title: "Connexion", to: "/login", requireToken: true, alternative: "Déconnexion", alternativeTo: "/logout" },
                        { title: "Mon profil", to: "/register" },
                    ]}
                    title={isLogged ? me.email : "Mon compte"}
                    requireLogin={isLogged}
                />
            </ul>
        </nav>
    );
}
