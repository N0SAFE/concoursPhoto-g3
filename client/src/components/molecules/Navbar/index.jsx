import style from './style.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import Dropdown from '@/components/atoms/Dropdown';
import { useEffect, useRef } from 'react';
import Icon from '@/components/atoms/Icon';
import Button from '@/components/atoms/Button';
import Modal from '@/components/atoms/Modal';
import { useModal } from '@/contexts/ModalContext/index.jsx';

export default function Navbar({ listLeft = [], listRight = [] }) {
    const { isLogged } = useAuthContext();
    const navbarRef = useRef('');
    const navigate = useNavigate();
    const { showModal, setModalContent } = useModal();

    const handleNavbar = e => {
        e.preventDefault();
        navbarRef.current.classList.toggle(style.navbarShow);
    };

    function list(disposition) {
        return disposition.map((item, index) => {
            if (item.type === 'classic') {
                return (
                    <li key={index}>
                        <Link className={style.navbarStyle} to={item.to}>
                            {item.title}
                        </Link>
                    </li>
                );
            } else if (item.type === 'dropdown') {
                return (
                    <Dropdown
                        links={item.links}
                        title={item.title}
                        requireLogin={isLogged}
                        requireToken={true}
                    />
                );
            } else if (item.type === 'modal') {
                return (
                    <Button
                        name={item.title}
                        borderRadius={'5px'}
                        padding={'5px 10px'}
                        icon={item.icon}
                        type="button"
                        onClick={() => {
                            setModalContent(item.component);
                            showModal();
                        }}
                    />
                );
            } else if (item.type === 'button') {
                return (
                    <Button
                        name={item.title}
                        borderRadius={'5px'}
                        padding={'5px 10px'}
                        icon={item.icon}
                        onClick={() =>
                            typeof item.action === 'function'
                                ? item.action()
                                : navigate(item.to)
                        }
                    />
                );
            }
        });
    }

    return (
        <>
            <nav className={style.navbarContainer}>
                <ul>{list(listLeft)}</ul>
                <ul>{list(listRight)}</ul>
                <ul
                    className={style.navbarResponsive}
                    style={{ display: 'none' }}
                >
                    <div ref={navbarRef}>
                        {list(listLeft)}
                        {list(listRight)}
                    </div>
                </ul>
                <ul
                    className={style.navbarResponsive}
                    style={{ display: 'none' }}
                    onClick={e => handleNavbar(e)}
                >
                    <Icon
                        className={style.icon}
                        icon={'menu'}
                        size={30}
                        color={'white'}
                    />
                </ul>
            </nav>
        </>
    );
}
