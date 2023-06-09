import Navbar from '@/components/molecules/Navbar';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import Login from '@/components/organisms/auth/Login';
import Register from '@/components/organisms/auth/Register';
import useAuth from '@/hooks/useAuthFunction';
import { toast } from 'react-toastify';
import style from './style.module.scss';
import logoSite from '@/assets/logo-concoursPhoto.png';

export default function Header(environment) {
    const { logout } = useAuth();
    const { isLogged } = useAuthContext();
    const navigate = useNavigate();

    const listRight = [];
    const listLeft = [];

    if (environment.environment === 'backoffice') {
        listLeft.push({ type: 'classic', title: 'Accueil', to: '/' });
        listLeft.push({
            type: 'dropdown',
            title: 'Utilisateur',
            links: [
                { title: 'Liste des utilisateurs', to: '/BO/user' },
                { title: "Ajout d'un utilisateur", to: '/BO/user/create' },
            ],
        });
        listLeft.push({
            type: 'dropdown',
            title: 'Organisations',
            links: [
                { title: 'Liste des organisations', to: '/BO/organization' },
                {
                    title: "Ajout d'une organisation",
                    to: '/BO/organization/create',
                },
            ],
        });
        listLeft.push({
            type: 'dropdown',
            title: 'Concours',
            links: [
                { title: 'Liste des concours', to: '/BO/competition' },
                { title: "Ajout d'un concours", to: '/BO/competition/create' },
            ],
        });
        listLeft.push({
            type: 'dropdown',
            title: 'Photographes',
            links: [
                {
                    title: 'Liste des photographes',
                    to: '/BO/user/photographer',
                },
            ],
        });
        listLeft.push({
            type: 'dropdown',
            title: 'Publicités',
            links: [
                {
                    title: 'Liste des publicités',
                    to: '/BO/pub',
                },
                {
                    title: "Ajout d'une publicité",
                    to: '/BO/pub/create',
                },
            ],
        });
    } else {
        listLeft.push({ type: 'classic', title: 'Accueil', to: '/' });
        listLeft.push({
            type: 'classic',
            title: 'Concours photo',
            to: '/competitiondetails',
        });
        listLeft.push({
            type: 'classic',
            title: 'Photographes',
            to: '/photographer',
        });
        listLeft.push({
            type: 'classic',
            title: 'Organisateurs',
            to: '/organization',
        });
        listLeft.push({
            type: 'classic',
            title: 'Créer votre concours',
            to: '/CreateCompetition',
        });
    }

    if (environment.environment === 'backoffice') {
        console.log(isLogged())
        if (isLogged()) {
            listRight.push({
                type: 'dropdown',
                title: 'Mon compte',
                links: [
                    {
                        title: 'Deconnexion',
                        action: function () {
                            const promise = logout().then(() => {
                                navigate('/');
                            });
                            toast.promise(promise, {
                                pending: 'Déconnexion en cours',
                                success: 'Déconnexion réussie',
                                error: 'Erreur lors de la déconnexion',
                            });
                        },
                    },
                    { title: 'Mon profil', to: '/profile' },
                ],
            });
        } else {
            listRight.push({
                type: 'modal',
                title: 'Connexion',
                component: <Login />,
            });
        }
    } else {
        if (isLogged()) {
            listRight.push({
                type: 'button',
                title: 'Mon compte',
                icon: 'user-plus',
                to: '/profile',
            });
            listRight.push({
                type: 'button',
                action: function () {
                    const promise = logout().then(() => {
                        navigate('/');
                    });
                    toast.promise(promise, {
                        pending: 'Déconnexion en cours',
                        success: 'Déconnexion réussie',
                        error: 'Erreur lors de la déconnexion',
                    });
                },
                title: 'Se déconnecter',
                icon: 'sign-out',
            });
        } else {
            listRight.push({
                type: 'modal',
                component: <Register />,
                title: "S'inscrire",
                icon: 'user-plus',
            });
            listRight.push({
                type: 'modal',
                component: <Login />,
                title: 'Se connecter',
                icon: 'sign-in',
            });
        }
    }

    return (
        <>
            <header className={style.headerContainer}>
                <Navbar
                    icon={
                        <img
                            src={logoSite}
                            className={style.logoSite}
                            alt="logo de concoursPhoto"
                        />
                    }
                    listLeft={listLeft}
                    listRight={listRight}
                />
            </header>
        </>
    );
}
