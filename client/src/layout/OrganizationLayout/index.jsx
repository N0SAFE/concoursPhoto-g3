import { NavLink, Outlet, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Breadcrumb from '@/components/atoms/Breadcrumb';
import Loader from '@/components/atoms/Loader/index.jsx';
import useApiFetch from '@/hooks/useApiFetch';
import style from './style.module.scss';
import useLocation from '@/hooks/useLocation';
import Navlink from '@/components/molecules/Navlink/index.jsx';

const organizationRouteList = [
    { content: 'Présentation', to: '/' },
    { content: 'Concours photos en cours', to: '/test' },
    { content: 'Concours photos à venir', to: '' },
    { content: 'Concours photos terminés', to: '' },
];

export default function OrganizationLayout() {
    const [isLoading, setIsLoading] = useState(true);
    const { getCityByCode } = useLocation();
    const apiFetch = useApiFetch();
    const [entity, setEntity] = useState({});
    const { id: organizationid } = useParams();

    const getOrganization = controller => {
        return apiFetch('/organizations/' + organizationid, {
            query: {
                groups: [
                    'organization:competition:read',
                    'competition:read',
                    'organization:organizationVisual:read',
                    'file:read',
                    'organization:logo:read',
                    'organization:lastCompetition:read',
                    'competition:competitionVisual:read',
                    'organization:organizationLinks:read',
                    'organizationLink:read',
                    'organizationLink:socialNetworks:read',
                    'socialNetworks:read',
                ],
            },
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller?.signal,
        })
            .then(res => res.json())
            .then(async data => {
                console.debug(data);
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                return getCityByCode(data.citycode).then(city => {
                    const _data = { ...data, city };
                    setEntity(_data);
                });
            });
    };

    useEffect(() => {
        const controller = new AbortController();
        const promise = getOrganization(controller);
        promise.then(function () {
            setIsLoading(false);
        });
        if (import.meta.env.MODE === 'development') {
            toast.promise(promise, {
                pending: 'Chargement du concours',
                success: 'Concours chargé',
                error: 'Erreur lors du chargement du concours',
            });
        }

        return () => setTimeout(() => controller.abort());
    }, []);

    return (
        <Loader active={isLoading}>
            <div className={style.organizationContainer}>
                <div className={style.organizationBanner}>
                    <Breadcrumb
                        items={[
                            { label: 'Accueil', link: '/' },
                            { label: 'Concours photo', link: location },
                            {
                                label: `${entity.organizerName}`,
                            },
                        ]}
                    />
                    <div className={style.filter}>
                        <div className={style.viewFilter}>
                            <div>
                                <h1>{entity.organizerName}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <Navlink
                    base={'/organization/' + organizationid}
                    list={organizationRouteList}
                />
                <Outlet context={{ organization: entity }} />
            </div>
        </Loader>
    );
}
