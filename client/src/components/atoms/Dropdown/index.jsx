import style from "@/components/atoms/Dropdown/style.module.scss";
import { Link } from "react-router-dom";
import Icon from "@/components/atoms/Icon";
import React, { useRef, useState } from "react";

export default function Dropdown({title, links, className }) {
    const dropdownRef = useRef('');
    const [isIconRotated, setIsIconRotated] = useState(false);

    const handleDropdown = (e) => {
        e.preventDefault();
        dropdownRef.current.classList.toggle(style.dropdownShow);
        // 'react-icomoon' doesn't support useRef, we have to use a state to rotate the icon
        setIsIconRotated(!isIconRotated);
    }

    return (
        <div className={style.dropdownContainer}>
            <div>
                <li>
                    <Link className={className} onClick={(e) => handleDropdown(e)}>{title}</Link>
                    <Icon className={`${style.dropdownIcon} ${isIconRotated ? style.dropdownRotate : ''}`} icon="cheveron-up" size={20} color="white" />
                </li>
            </div>
            <div ref={dropdownRef} className={style.dropdown}>
                {links.map((link, index) => {
                    return (
                        <li key={index}>
                            <Link className={className} to={link.to}>{link.title}</Link>
                        </li>
                    )
                })}
            </div>
        </div>
    );
}
