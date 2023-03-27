import style from "@/components/atoms/Dropdown/style.module.scss";
import {Link} from "react-router-dom";
import Icon from "@/components/atoms/Icon";
import React, { useRef, useState } from "react";

export default function Dropdown({title, links, token, requireToken }) {
    const dropdownRef = useRef('');
    const [isIconRotated, setIsIconRotated] = useState(false);

    const handleDropdown = (e) => {
        e.preventDefault();
        dropdownRef.current.classList.toggle(style.show);
        // 'react-icomoon' doesn't support useRef, we have to use a state to rotate the icon
        setIsIconRotated(!isIconRotated);
    }

    return (
        <div className={style.containerDropdown}>
            <div className={style.alignDropdown}>
                {requireToken === true && token !== null || !requireToken ? (
                    <div>
                        <Link onClick={(e) => handleDropdown(e)}>{title}</Link>
                        <Icon className={`${style.icon} ${isIconRotated ? style.rotate : ''}`} icon="cheveron-up" size={20} color="white" />
                    </div>
                    ) : null
                }
            </div>
            <div ref={dropdownRef} className={style.dropdown}>
                {links.map((link, index) => {
                    if (link.requireToken === true && token === null) {
                        return (
                            <li key={index}>
                                <Link to={link.to}>{link.title}</Link>
                            </li>
                        )
                    } else if (link.requireToken === true) {
                        return (
                            <li key={index}>
                                <Link to={link.alternativeTo}>{link.alternative}</Link>
                            </li>
                        )
                    } else {
                        return (
                            <li key={index}>
                                <Link to={link.to}>{link.title}</Link>
                            </li>
                        )
                    }
                })}
            </div>
        </div>
    );
}
