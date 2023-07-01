import React from 'react';
import BOSee from '@/components/organisms/BO/See';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useApiFetch from '@/hooks/useApiFetch';
import useLocation from '@/hooks/useLocation';
import { toast } from 'react-toastify';
import Loader from '@/components/atoms/Loader/index.jsx';
import style from './style.module.scss';
import useApiPath from '@/hooks/useApiPath';

export default function DetailsPhotographer() {
    const [isLoading, setIsLoading] = useState(true);
    const apiFetch = useApiFetch();
    const { getCityByCode } = useLocation();
    const [entity, setEntity] = useState({});
    const { id: userId } = useParams();
    const apipath = useApiPath();

    const getUser = controller => {
        return apiFetch('/users/' + userId, {
            query: {
                groups: [
                    'user:read',
                    'user:pictureProfil:read',
                    'file:read',
                    'user:photographerCategory:read',
                    'user:current:read',
                    'userLink:user:read',
                    'userLink:write',
                    'user:pictures:read',
                    'picture:read',
                    'picture:file:read',
                ],
            },
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
    console.log(entity);

    return (
        <Loader active={isLoading}>
            <div className={style.all}>
                <h1 style={{ textAlign: 'center', marginBottom: '3%' }}>
                    Fiche du photographe {entity?.firstname} {entity?.lastname}
                </h1>
                <BOSee
                    entity={entity}
                    properties={[
                        {
                            display: 'Photo de profil',
                            name: 'pictureProfil',
                            customData({ entity, property }) {
                                return (
                                    <img
                                        src={apipath(
                                            entity?.pictureProfil?.path
                                        )}
                                        alt="Photo de profil"
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                        }}
                                    />
                                );
                            },
                        },
                        {
                            display: 'Son adreese mail',
                            name: 'email',
                        },
                        {
                            display: ' Son numéro de téléphone',
                            name: 'phoneNumber',
                        },

                        {
                            display: 'Sa date de naissance',
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
                            display: 'Description du photographe',
                            name: 'photographerDescription',
                        },
                        {
                            display: 'Site web du photographe',
                            name: 'websiteUrl',
                            customData({ entity, property }) {
                                return (
                                    <a
                                        href={entity?.websiteUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {entity?.websiteUrl}
                                    </a>
                                );
                            },
                        },
                        {
                            display: 'Category du photographe',
                            name: 'photographerCategory',
                            customData({ entity, property }) {
                                return entity?.photographerCategory?.label;
                            },
                        },
                        {
                            display: 'Ses resesaux sociaux',
                            name: 'userLinks',
                            customData({ entity, property }) {
                                return (
                                    <ul>
                                        {entity?.userLinks?.map(link => (
                                            <li>
                                                <a
                                                    href={link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {link.socialNetworks.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                );
                            },
                        },

                        {
                            display: 'Pays',
                            name: 'country',
                        },
                        {
                            display: 'Ses photos',
                            name: 'pictures',
                            customData({ entity, property }) {
                                return entity?.pictures?.map(picture => (
                                    <img
                                        src={apipath(picture.file.path)}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                        }}
                                    />
                                ));
                            },
                        },
                    ]}
                />
            </div>
        </Loader>
    );
}
