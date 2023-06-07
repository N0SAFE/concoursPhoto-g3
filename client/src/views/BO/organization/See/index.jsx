import React from 'react';
import BOSee from '@/components/organisms/BO/See';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useApiFetch from '@/hooks/useApiFetch';
import useLocation from '@/hooks/useLocation.js';
import { toast } from 'react-toastify';
import toApiPath from '@/hooks/useApiFetch';
import Loader from '@/components/atoms/Loader/index.jsx';
import style from './style.module.scss';

export default function () {
    const [isLoading, setIsLoading] = useState(true);
    const apiFetch = useApiFetch();
    const { getCityByCode } = useLocation();
    const [entity, setEntity] = useState({});
    const { id: organizationId } = useParams();

    const getOrganizations = controller => {
        return apiFetch('/organizations/' + organizationId, {
            query: {
                groups: [
                    'organization:organizationType:read',
                    'organizationType:read',
                    'organization:competitions:read',
                    'competition:read',
                    'organization:logo:read',
                    'file:read',
                ],
            },
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller.signal,
        })
            .then(res => res.json())
            .then(data => {
                console.debug(data);
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                return getCityByCode(data.citycode).then(city => {
                    return setEntity({ ...data, city: city.nom });
                });
            });
    };

    useEffect(() => {
        const controller = new AbortController();
        const promise = getOrganizations(controller);
        promise.then(function () {
            setIsLoading(false);
        });
        if (import.meta.env.MODE === 'development') {
            toast.promise(promise, {
                pending: "Chargement de l'oranisation",
                success: "l'Organization a bien chargé",
                error: "Erreur lors du chargement de l'organisation",
            });
        }
        return () => setTimeout(() => controller.abort());
    }, []);

    return (
        <Loader active={isLoading}>
            <div className={style.all}>
                <BOSee
                    entity={entity}
                    properties={[
                        {
                            display: 'Nom',
                            name: 'organizerName',
                        },
                        {
                            display: 'Ville',
                            name: 'city',
                        },
                        {
                            display: 'Adresse',
                            name: 'address',
                        },
                        {
                            display: 'Code postal',
                            name: 'postcode',
                        },
                        {
                            display: 'pays',
                            name: 'country',
                        },
                        {
                            display: 'Téléphone',
                            name: 'numberPhone',
                        },
                        {
                            display: 'Email',
                            name: 'email',
                        },
                        {
                            display: 'Numero de SIRET',
                            name: 'numberSiret',
                        },
                        {
                            display: 'Numéro de TVA',
                            name: 'intraCommunityVat',
                        },
                        {
                            display: 'Site web',
                            name: 'websiteUrl',
                        },
                        {
                            display: 'Description',
                            name: 'description',
                        },
                        {
                            display: 'Logo',
                            name: 'logo',
                            type: 'img',
                            customData: ({ entity }) => {
                                return entity?.logo?.path
                                    ? {
                                          to: toApiPath(entity?.logo?.path),
                                          name: entity?.logo?.defaultName,
                                      }
                                    : null;
                            },
                        },
                        {
                            display: "Type d'organisation",
                            name: 'organizationType',
                            customData: ({ entity }) => {
                                return entity?.organizationType?.label;
                            },
                        },
                        {
                            display: 'Competitions',
                            name: 'competitions',
                            customData: ({ entity }) => {
                                return entity?.competitions
                                    ?.map(
                                        competition =>
                                            competition.competitionName
                                    )
                                    .join(', ');
                            },
                        },
                    ]}
                />
            </div>
        </Loader>
    );
}
