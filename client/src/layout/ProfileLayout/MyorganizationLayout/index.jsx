import Button from '@/components/atoms/Button/index.jsx';
import Navlink from '@/components/molecules/Navlink/index.jsx';
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import style from './style.module.scss';

const myorganizationRouteList = [
    { content: 'Identité & coordonnées', to: '' },
    { content: 'Administrateurs', to: '/admin' },
    { content: 'Concours', to: '/competition' },
    { content: 'Publicités', to: '/pub' },
];

export default function () {
    const navigate = useNavigate()
    const context = useOutletContext();
    return (
        <div className={style.container}>
            <div className={style.navlinkContainer}>
                <Button onClick={() => navigate('/profile/myorganization')}>
                    Retour
                </Button>
                <Navlink
                    className={style.navlink}
                    base={'/profile/myorganization/' + context.idOrganisation}
                    list={myorganizationRouteList}
                    orientation="vertical"
                />
            </div>
            <div className={style.content}>
                <Outlet context={context} />
            </div>
        </div>
    );
}
