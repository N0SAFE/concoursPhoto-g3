import Button from '@/components/atoms/Button/index.jsx';
import Navlink from '@/components/molecules/Navlink/index.jsx';
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import style from './style.module.scss';
import { useAuthContext } from '@/contexts/AuthContext.jsx';
import Input from '@/components/atoms/Input/index.jsx';
import Hbar from '@/components/atoms/Hbar/index.jsx';
import { useEffect, useState } from 'react';
import useApiFetch from '@/hooks/useApiFetch.js';
import Loader from '@/components/atoms/Loader/index.jsx';

const myorganizationRouteList = [
    { content: 'Identité & coordonnées', to: '' },
    { content: 'Administrateurs', to: '/admin' },
    { content: 'Concours', to: '/competition' },
    { content: 'Publicités', to: '/pub' },
];

export default function () {
    const apiFetch = useApiFetch();
    const navigate = useNavigate();
    const context = useOutletContext();
    const { me } = useAuthContext();

    const [selectedOrganisation, setSelectedOrganisation] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    
    function getOrganization(id ){
        setIsLoading(true);
        apiFetch('/organizations/' + id + "?groups[]=organization:admin:read&groups[]=user:read", {
            method: 'GET',
        })
            .then(r => r.json())
            .then(res => {
                const _organisation = {
                    ...res,
                    organizationType: res.organization_type
                        ? {
                              label: res.organization_type.label,
                              value: res.organization_type['@id'],
                          }
                        : null,
                };

                setSelectedOrganisation(_organisation);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        getOrganization(context.idOrganisation);
    }, []);

    console.log(selectedOrganisation);

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
                <Loader active={isLoading} takeInnerContent={true} style={{borderRadius: "10px"}}>
                    <Input
                        type="select"
                        name="organisation"
                        label="selectionner une organisation"
                        extra={{
                            options: me.Manage.map(function ({
                                organizer_name,
                                id,
                            }) {
                                return { value: id, label: organizer_name };
                            }),
                            required: true,
                            value: {
                                label: selectedOrganisation.organizer_name,
                                value: selectedOrganisation.id,
                            },
                        }}
                        onChange={d => {
                            getOrganization(d.value)
                        }}
                    />
                    <Hbar />
                    <Outlet context={{ ...context, selectedOrganisation }} />
                </Loader>
            </div>
        </div>
    );
}
