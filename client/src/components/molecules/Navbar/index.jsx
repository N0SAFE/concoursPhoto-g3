import style from "./style.module.scss";
import {Link, useNavigate} from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import Dropdown from "@/components/atoms/Dropdown";
import {useEffect, useRef} from "react";
import Icon from "@/components/atoms/Icon";
import Button from "@/components/atoms/Button";
import Modal from "@/components/atoms/Modal";

export default function Navbar({listLeft = [], listRight = []}) {
    const { isLogged } = useAuthContext();
    const navbarRef = useRef('');
    const navigate = useNavigate();

    const handleNavbar = (e) => {
        e.preventDefault();
        navbarRef.current.classList.toggle(style.show);
    }

    function list(disposition) {
        return disposition.map((item, index) => {
            if (item.type === "classic") {
                return (
                    <li key={index}>
                        <Link className={style.navbarStyle} to={item.to}>{item.title}</Link>
                    </li>
                )
            } else if (item.type === "dropdown") {
                return (
                    <Dropdown
                        className={style.navbarStyle}
                        links={item.links}
                        title={item.title}
                        requireLogin={isLogged}
                        requireToken={true}
                    />
                )
            } else if (item.type === "modal") {
                return (
                    <Modal title={item.title} buttonSelected={<Button
                        name={item.title}
                        borderRadius={"5px"}
                        padding={"5px 10px"}
                        icon={item.icon}
                    />} component={item.component} />
                )
            } else if (item.type === "button") {
                return (
                    <Button
                        name={item.title}
                        borderRadius={"5px"}
                        padding={"5px 10px"}
                        icon={item.icon}
                        onClick={() => navigate(item.to)}
                    />
                )
            }
        })
    }

    return (
        <>
            <nav className={style.navbarContainer}>
                <ul>
                    {list(listLeft)}
                </ul>
                <ul>
                    {list(listRight)}
                </ul>
                <ul className={style.navbarResponsive} style={{ display: "none" }}>
                    <div ref={navbarRef}>
                        {list(listLeft)}
                        {list(listRight)}
                    </div>
                </ul>
                <ul className={style.navbarResponsive} style={{ display: "none" }} onClick={(e) => handleNavbar(e)}>
                    <Icon className={style.icon} icon={"menu"} size={30} color={"white"} />
                </ul>
            </nav>
        </>
    );
}
