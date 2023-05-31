import style from './style.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import Dropdown from '@/components/atoms/Dropdown';
import { useRef } from 'react';
import Icon from '@/components/atoms/Icon';
import Button from '@/components/atoms/Button';
import { useModal } from '@/contexts/ModalContext/index.jsx';

export default function Navbar({ icon, listLeft = [], listRight = [] }) {
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
                    <li key={index} className={style.navbarElement}>
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
                        borderRadius={'5px'}
                        padding={'5px 10px'}
                        icon={item.icon}
                        type="button"
                        onClick={() => {
                            setModalContent(item.component);
                            showModal();
                        }}
                    >
                        {item.title}
                    </Button>
                );
            } else if (item.type === 'button') {
                return (
                    <Button
                        borderRadius={'5px'}
                        padding={'5px 10px'}
                        icon={item.icon}
                        onClick={() =>
                            typeof item.action === 'function'
                                ? item.action()
                                : navigate(item.to)
                        }
                    >
                        {item.title}
                    </Button>
                );
            }
        });
    }

    return (
        <>
            <nav className={style.navbarContainer}>
                <ul>
                    {icon}
                    {list(listLeft)}
                </ul>
                <ul>{list(listRight)}</ul>
                <ul
                    className={style.navbarResponsive}
                    style={{ display: 'none' }}
                >
                    {icon}
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
