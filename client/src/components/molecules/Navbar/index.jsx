import style from './style.module.scss';
import { Link } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext.jsx";
import Icon from "@/components/atoms/Icon/index.jsx";
import Dropdown from "@/components/atoms/Dropdown";

export default function Navbar() {
    const {token} = useAuthContext()

    return (
        <nav className={style.nav}>
            <ul>
                <li>
                    <Link to={"/BO"}>Page d'accueil</Link>
                </li>
                {token !== null && (
                    <li>
                        <Link to={"/BO/user"}>Liste des utilisateurs</Link>
                    </li>
                )}
                {token !== null && (
                    <li>
                        <Link to={"/BO/user/create"}>Ajout d'un utilisateur</Link>
                    </li>
                )}
            </ul>
            <ul>
                <Dropdown />
            </ul>
        </nav>
    );
}
