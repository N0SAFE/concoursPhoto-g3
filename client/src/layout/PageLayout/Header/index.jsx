import Navbar from "@/components/molecules/Navbar/index.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext.jsx";
import Login from "@/components/organisms/auth/Login/index.jsx";
import Register from "@/components/organisms/auth/Register/index.jsx";
import { useModal } from "@/contexts/ModalContext/index.jsx";
import useAuth from "@/hooks/useAuth.js";
import { toast } from "react-toastify";

export default function Index(environment) {
    const { showModal, setModalContent } = useModal();
    const { logout } = useAuth();
    const { isLogged, me } = useAuthContext();
    const navigate = useNavigate();

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
                        action: function () {
                            const promise = logout().then(() => {
                                navigate("/");
                            });
                            toast.promise(promise, {
                                pending: "Déconnexion en cours",
                                success: "Déconnexion réussie",
                                error: "Erreur lors de la déconnexion",
                            });
                        },
                    },
                    { title: "Mon profil", to: "/profile/me" },
                ],
            });
        } else {
            listRight.push({ type: "modal", title: "Connexion", component: <Login /> });
        }
    } else {
        listRight.push({ type: "modal", component: <Register />, title: "S'inscrire", icon: "user-plus" });
        if (isLogged) {
            listRight.push({
                type: "button",
                action: function () {
                    const promise = logout().then(() => {
                        navigate("/");
                    });
                    toast.promise(promise, {
                        pending: "Déconnexion en cours",
                        success: "Déconnexion réussie",
                        error: "Erreur lors de la déconnexion",
                    });
                },
                title: "Se déconnecter",
                icon: "sign-out",
            });
        } else {
            listRight.push({ type: "modal", component: <Login />, title: "Se connecter", icon: "sign-in" });
        }
    }

    return (
        <>
            <header>
                <Navbar listLeft={listLeft} listRight={listRight} />
            </header>
        </>
    );
}