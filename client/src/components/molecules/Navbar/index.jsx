import style from './style.module.scss';
import { Link } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import Dropdown from "@/components/atoms/Dropdown";

export default function Navbar() {
    const { token } = useAuthContext();
    return (
        <nav className={style.nav}>
            <ul>
                <li>
                    <Link to={"/BO"}>Page d'accueil</Link>
                </li>
                <Dropdown
                    links={[
                        {'title': 'Liste des utilisateurs', 'to': '/BO/user'},
                        {'title': 'Ajout d\'un utilisateur', 'to': '/BO/user/create'},
                    ]}
                    title={'Utilisateur'}
                    token={token}
                    requireToken={true}
                />
            </ul>
            <ul>
                <Dropdown
                    links={[
                        {'title': 'Connexion', 'to': '/login', 'requireToken': true, alternative: 'Déconnexion', alternativeTo: '/logout'},
                        {'title': 'Mon profil', 'to': '/register'},
                    ]}
                    title={'Mon compte'}
                    token={token}
                />
            </ul>
        </nav>
    );
}
