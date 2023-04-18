import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function () {
    const location = useLocation();
    const activeTo = location.pathname;
    const list = [
        { content: "Mon profil", to: "/profile/me" },
        { content: "Mes préférences", to: "/profile/preference" },
        { content: "Mes organisations", to: "/profile/myorganization" },
    ];
    if (activeTo) {
        list.find((item) => item.to === activeTo).active = true;
    }
    return (
        <div>
            <h1>Mon compte</h1>
            <div>
                {list.map(({ content, to, active }, index) => (
                    <Link to={to}>
                        <li key={index} className={active ? "active" : ""}>
                            {content}
                        </li>
                    </Link>
                ))}
            </div>
            <Outlet />
        </div>
    );
}
