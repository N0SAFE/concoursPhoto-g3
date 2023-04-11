import Navbar from "@/components/molecules/Navbar";
import {Outlet, useLocation} from "react-router-dom";
import {useAuthContext} from "@/contexts/AuthContext";

export default function Header(environment) {
    const location = useLocation();
    const { isLogged, me } = useAuthContext();

    if (environment.environment === "backoffice" && location.pathname.includes("BO") && isLogged && me.roles.includes("ROLE_ADMIN")) {
        return (
            <header>
                <Navbar
                    listLeft={[
                        {type: "classic", title: "Accueil", to: "/"},
                        {
                            type: "dropdown", title: "Utilisateur", links: [
                                {title: "Liste des utilisateurs", to: "/BO/user"},
                                {title: "Ajout d'un utilisateur", to: "/BO/user/create"},
                            ]
                        },
                        {
                            type: "dropdown", title: "Organisations", links: [
                                {title: "Liste des organisations", to: "/BO/organization"},
                                {title: "Ajout d'une organisation", to: "/BO/organization/create"},
                            ]
                        },
                        {
                            type: "dropdown", title: "Concours", links: [
                                {title: "Liste des concours", to: "/BO/competition"},
                                {title: "Ajout d'un concours", to: "/BO/competition/create"},
                            ]
                        },
                    ]}
                    listRight={[
                        {
                            type: "dropdown", title: "Mon compte", links: [
                                {
                                    title: "Connexion",
                                    to: "/auth/login",
                                    requireToken: true,
                                    alternative: "Déconnexion",
                                    alternativeTo: "/auth/logout"
                                },
                                {title: "Mon profil", to: "/profile"},
                            ]
                        },
                    ]}
                />
                <Outlet/>
            </header>
        )
    } else {
        return (
            <header>
                <Navbar
                    listLeft={[
                        {type: "classic", title: "Accueil", to: "/BO"},
                        {type: "classic", title: "Concours photo", to: "/"},
                        {type: "classic", title: "Photographes", to: "/"},
                        {type: "classic", title: "Organisateurs", to: "/"},
                        {type: "classic", title: "Créer votre concours", to: "/"},
                        {type: "classic", title: "Blog", to: "/"},
                    ]}
                    listRight={[
                        {
                            type: "dropdown", title: "Mon compte", links: [
                                {
                                    title: "Connexion",
                                    to: "/auth/login",
                                    requireToken: true,
                                    alternative: "Déconnexion",
                                    alternativeTo: "/auth/logout"
                                },
                                {title: "Mon profil", to: "/profile"},
                            ]
                        },
                    ]}
                />
                <Outlet/>
            </header>
        )
    }

}
