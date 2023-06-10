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

    function getOrganization(id) {
        setIsLoading(true);
        apiFetch('/organizations/' + id, {
            query: {
                groups: [
                    'organization:admin:read',
                    'user:read',
                    'organization:organizationType:read',
                    'organizationType:read',
                    'organization:organizationLinks:read',
                    'organizationLink:read',
                    'organizationLink:socialNetworks:read',
                    'socialNetworks:read',
                    'organization:file:read',
                    'file:read',
                ],
            },
            method: 'GET',
        })
            .then(r => r.json())
            .then(res => {
                const _organisation = {
                    ...res,
                    organizationType: res.organizationType
                        ? {
                              label: res.organizationType.label,
                              value: res.organizationType['@id'],
                          }
                        : null,
                    organizationLinks: new Map(
                        res.organizationLinks.map(l => {
                            return [
                                l?.socialNetworks?.['@id'],
                                {
                                    organization: l.organization,
                                    socialNetworks: l?.socialNetworks?.['@id'],
                                    link: l.link,
                                },
                            ];
                        })
                    ),
                };

                setSelectedOrganisation(_organisation);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        getOrganization(context.idOrganisation);
    }, []);

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
                <Loader
                    active={isLoading}
                    takeInnerContent={true}
                    style={{ borderRadius: '10px' }}
                >
                    <Input
                        type="select"
                        name="organisation"
                        label="Sélectionner une organisation"
                        extra={{
                            options: me.Manage.map(function ({
                                organizerName,
                                id,
                            }) {
                                return { value: id, label: organizerName };
                            }),
                            required: true,
                            value: {
                                label: selectedOrganisation.organizerName,
                                value: selectedOrganisation.id,
                            },
                        }}
                        onChange={d => {
                            getOrganization(d.value);
                        }}
                    />
                    <Hbar />
                    <Outlet
                        context={{
                            ...context,
                            selectedOrganisation,
                            idOrganisation: selectedOrganisation.id,
                        }}
                    />
                </Loader>
            </div>
        </div>
    );
}
