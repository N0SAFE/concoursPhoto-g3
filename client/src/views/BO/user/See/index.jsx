import React from 'react';
import BOSee from '@/components/organisms/BO/See';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useApiFetch from '@/hooks/useApiFetch';
import useLocation from '@/hooks/useLocation';
import { toast } from 'react-toastify';
import Loader from '@/components/atoms/Loader/index.jsx';
import style from './style.module.scss';

export default function () {
    const [isLoading, setIsLoading] = useState(true);
    const apiFetch = useApiFetch();
    const { getCityByCode } = useLocation();
    const [entity, setEntity] = useState({});
    const { id: userId } = useParams();

    const getUser = controller => {
        return apiFetch('/users/' + userId + "?groups[]=user:personalStatut:read&groups[]=personalStatut:read&groups[]=user:gender:read&groups[]=gender:read", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller?.signal,
        })
            .then(res => res.json())
            .then(data => {
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                return getCityByCode(data.citycode).then(city => {
                    return setEntity({ ...data, city: city.nom });
                });
            })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        const controller = new AbortController();
        const promise = getUser(controller);
        promise.then(function () {
            setIsLoading(false);
        });
        if (import.meta.env.MODE === 'development') {
            toast.promise(promise, {
                pending: "Chargement de l'utilisateur",
                success: 'Utilisateur chargé',
                error: "Erreur lors du chargement de l'utilisateur",
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
                            name: 'lastname',
                        },
                        {
                            display: 'Prénom',
                            name: 'firstname',
                        },
                        {
                            display: 'Email',
                            name: 'email',
                        },
                        {
                            display: 'Téléphone',
                            name: 'phoneNumber',
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
                            display: 'Statut',
                            name: 'personalStatut',
                            customData({ entity, property }) {
                                return entity?.personalStatut?.label;
                            },
                        },
                        {
                            display: 'Ville',
                            name: 'city',
                        },
                        {
                            display: 'Pays',
                            name: 'country',
                        },
                        {
                            display: 'Date de naissance',
                            name: 'dateOfBirth',
                            customData({ entity, property }) {
                                return new Date(
                                    entity?.dateOfBirth
                                ).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                });
                            },
                        },
                        {
                            display: 'Genre',
                            name: 'gender',
                            customData({ entity, property }) {
                                return entity?.gender?.label;
                            },
                        },
                        {
                            display: 'Roles',
                            name: 'roles',
                            customData({ entity, property }) {
                                return (
                                    '[' +
                                    (entity?.roles?.join(', ') || '') +
                                    ']'
                                );
                            },
                        },
                    ]}
                />
            </div>
        </Loader>
    );
}
