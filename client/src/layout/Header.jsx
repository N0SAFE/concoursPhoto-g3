import Navbar from "@/components/molecules/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import UserRegister from "@/views/FO/user/Register";
import LoginFO from "@/views/auth/LoginFO";

export default function Header(environment) {
    const location = useLocation();
    const { isLogged, me } = useAuthContext();

    const listRight = [];
    const listLeft = [];

    if (environment.environment === "backoffice") {
        listLeft.push({ type: "classic", title: "Accueil", to: "/" });
        listLeft.push({
            type: "dropdown",
            title: "Utilisateur",
            links: [
                { title: "Liste des utilisateurs", to: "/BO/user" },
                { title: "Ajout d'un utilisateur", to: "/BO/user/create" },
            ],
        });
        listLeft.push({
            type: "dropdown",
            title: "Organisations",
            links: [
                { title: "Liste des organisations", to: "/BO/organization" },
                { title: "Ajout d'une organisation", to: "/BO/organization/create" },
            ],
        });
        listLeft.push({
            type: "dropdown",
            title: "Concours",
            links: [
                { title: "Liste des concours", to: "/BO/competition" },
                { title: "Ajout d'un concours", to: "/BO/competition/create" },
            ],
        });
    } else {
        listLeft.push({ type: "classic", title: "Accueil", to: "/BO" });
        listLeft.push({ type: "classic", title: "Concours photo", to: "/" });
        listLeft.push({ type: "classic", title: "Photographes", to: "/" });
        listLeft.push({ type: "classic", title: "Organisateurs", to: "/" });
        listLeft.push({ type: "classic", title: "Créer votre concours", to: "/" });
    }

    if (environment.environment === "backoffice") {
        if (isLogged) {
            listRight.push({
                type: "dropdown",
                title: "Mon compte",
                links: [
                    {
                        title: "Deconnexion",
                        to: "/auth/logout",
                    },
                    { title: "Mon profil", to: "/profile/me" },
                ],
            });
        } else {
            listRight.push({ type: "modal", title: "Connexion", component: <LoginFO /> });
        }
    } else {
        listRight.push({ type: "modal", component: <UserRegister />, title: "S'inscrire", icon: "user-plus" });
        if (isLogged) {
            listRight.push({ type: "button", to: "/auth/logout", title: "Se déconnecter", icon: "sign-out" });
        } else {
            listRight.push({ type: "modal", component: <LoginFO />, title: "Se connecter", icon: "sign-in" });
        }
    }

    return (
        <>
            <header>
                <Navbar listLeft={listLeft} listRight={listRight} />
            </header>
            <Outlet />
        </>
    );
}
