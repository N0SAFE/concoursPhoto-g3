import Button from '@/components/atoms/Button/index.jsx';
import Navlink from '@/components/molecules/Navlink/index.jsx';
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';

const myorganizationRouteList = [
    { content: 'Identité & coordonnées', to: '' },
    { content: 'Administrateurs', to: '/admin' },
    { content: 'Concours', to: '/competition' },
    { content: 'Publicités', to: '/pub' },
];

export default function () {
    const navigate = useNavigate()
    const context = useOutletContext();
    console.log(context);
    return (
        <div style={{ display: 'flex', gap: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: "200px", minWidth: "200px" }}>
                <Button onClick={() => navigate('/profile/myorganization')}>
                    Retour
                </Button>
                <Navlink
                    style={{ marginTop: '20px' }}
                    base={'/profile/myorganization/' + context.idOrganisation}
                    list={myorganizationRouteList}
                    orientation="vertical"
                />
            </div>
            <div style={{flexGrow: "1"}}>
                <Outlet context={context} />
            </div>
        </div>
    );
}
