import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useApiFetch from '@/hooks/useApiFetch.js';
import Navlink from '@/components/molecules/Navlink';
import style from './style.module.scss';
import { useAuthContext } from '@/contexts/AuthContext.jsx';

const profileRouteList = [
    { content: 'Mon profil', to: '/me' },
    { content: 'Mes préférences', to: '/preference' },
    { content: 'Mes organisations', to: '/myorganization', type: 'startwith' },
    { content: 'Concours créés par mon organisation', to: '/me' },
    { content: 'Concours auxquels j’ai participé', to: '/participations' },
];

export default function ProfileLayout() {
    const apiFetch = useApiFetch();
    const { me } = useAuthContext();
    const [gendersPossibility, setGendersPossibility] = useState({
        list: [],
        isLoading: true,
    });
    const [notificationTypePossibility, setNotificationTypePossibility] =
        useState({
            map: new Map(),
            isLoading: true,
        });
    const [socialNetworksPossibility, setSocialNetworksPossibility] = useState({
        list: [],
        isLoading: true,
    });
    const meNotificationEnabled = new Map(
        me.notificationEnabled.map(item => [item.notificationCode, item['@id']])
    );

    const getGendersPossibility = controller => {
        return apiFetch('/genders', {
            query: {
                groups: ['gender:read'],
            },
            method: 'GET',
            signal: controller.signal,
        })
            .then(r => r.json())
            .then(data => {
                return data['hydra:member'].map(function (item) {
                    return { label: item.label, value: item['@id'] };
                });
            });
    };

    const getNotificationTypePossibility = controller => {
        return apiFetch('/notification_types', {
            method: 'GET',
            signal: controller.signal,
        })
            .then(r => r.json())
            .then(data => {
                return data['hydra:member'];
            });
    };

    const getSocialNetworks = () => {
        return apiFetch('/social_networks', {
            method: 'GET',
        })
            .then(r => r.json())
            .then(data => {
                console.debug(data);
                return data['hydra:member'];
            });
    };

    useEffect(() => {
        const controller = new AbortController();
        getGendersPossibility(controller).then(genders => {
            setGendersPossibility({ list: genders, isLoading: false });
        });
        getNotificationTypePossibility(controller).then(notificationTypes => {
            const _notificationTypes = new Map(
                notificationTypes.map(item => [
                    item.notificationCode,
                    item['@id'],
                ])
            );
            setNotificationTypePossibility({
                map: _notificationTypes,
                isLoading: false,
            });
        });
        getSocialNetworks().then(data => {
            setSocialNetworksPossibility({ list: data, isLoading: false });
        });

        return () => {
            setTimeout(() => controller.abort());
        };
    }, []);

    return (
        <div className={style.profilContainer}>
            <h1>Mon compte</h1>
            <Navlink base="/profile" list={profileRouteList} />
            <Outlet
                context={{
                    gendersPossibility,
                    notificationTypePossibility,
                    meNotificationEnabled,
                    socialNetworksPossibility,
                }}
            />
        </div>
    );
}
