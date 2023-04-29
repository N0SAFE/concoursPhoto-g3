import style from '@/components/atoms/Dropdown/style.module.scss';
import { Link } from 'react-router-dom';
import Icon from '@/components/atoms/Icon';
import React, { useRef, useState } from 'react';

export default function Dropdown({ title, links = [], className, iconColor }) {
    const dropdownRef = useRef('');
    const [isIconRotated, setIsIconRotated] = useState(false);

    const handleDropdown = e => {
        e.preventDefault();
        dropdownRef.current.classList.toggle(style.dropdownShow);
        // 'react-icomoon' doesn't support useRef, we have to use a state to rotate the icon
        setIsIconRotated(!isIconRotated);
    };

    return (
        <div className={style.dropdownContainer}>
            <div>
                <li>
                    <Link
                        className={className}
                        onClick={e => handleDropdown(e)}
                    >
                        {title}
                    </Link>
                    <Icon
                        className={`${style.dropdownIcon} ${
                            isIconRotated ? style.dropdownRotate : ''
                        }`}
                        icon="cheveron-up"
                        size={20}
                        color={iconColor}
                        onClick={(e) => handleDropdown(e)}
                    />
                </li>
            </div>
            <div ref={dropdownRef} className={style.dropdown}>
                {links.map((link, index) => {
                    return (
                        <li key={index}>
                            <Link
                                className={className}
                                onClick={e => {
                                    if (typeof link?.action === 'function') {
                                        e.preventDefault();
                                        link.action();
                                    }
                                }}
                                to={
                                    typeof link?.action !== 'function' &&
                                    link.to
                                }
                            >
                                {link.title}
                            </Link>
                        </li>
                    );
                })}
            </div>
        </div>
    );
}
