import style from "@/components/atoms/Dropdown/style.module.scss";
import {Link} from "react-router-dom";
import Icon from "@/components/atoms/Icon/index.jsx";
import {useAuthContext} from "@/contexts/AuthContext.jsx";

const handleDropdown = () => {
    const dropdown = document.querySelector(`.${style.dropdown}`);
    dropdown.classList.toggle(style.show);

    const icon = document.querySelector(`.${style.icon}`);
    icon.classList.toggle(style.rotate);
}

export default function Dropdown() {
    const {token} = useAuthContext();

    return (
        <div>
            <div className={style.alignDropdown}>
                <Link onClick={() => handleDropdown()}>Mon compte</Link>
                <Icon className={style.icon} icon="cheveron-up" size={20} color="white" />
            </div>
            <div className={style.dropdown}>
                {token === null ? (
                    <li>
                        <Link to={"/login"}>Connexion</Link>
                    </li>
                ) : (
                    <li>
                        <Link to={"/logout"}>Déconnexion</Link>
                    </li>
                )}
            </div>
        </div>
    )
}
