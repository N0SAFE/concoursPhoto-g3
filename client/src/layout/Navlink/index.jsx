import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import style from "./style.module.scss";

export default function ({ list }) {
    const location = useLocation();
    const activeTo = location.pathname;
    list.forEach((item) => (item.active = false));
    if (activeTo) {
        list.find((item) => item.to === activeTo).active = true;
    }
    return (
        <div className={style.navLinkContainer}>
            <h1>Mon compte</h1>
            <div>
                {list.map(({ content, to, active }, index) => (
                    <li key={index} className={active ? style.active : ""}>
                        <Link to={to}>{content}</Link>
                    </li>
                ))}
            </div>
            <Outlet />
        </div>
    );
}
