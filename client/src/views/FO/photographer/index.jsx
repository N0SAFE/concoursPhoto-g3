import Table from '@/components/molecules/Table';
import useApiFetch from '@/hooks/useApiFetch.js';
import { useEffect, useState } from 'react';
import useApiPath from '@/hooks/useApiPath';
import Loader from '@/components/atoms/Loader/index.jsx';
import style from './style.module.scss';

export default function PhotographerList() {
    const apipath = useApiPath();
    const [isLoading, setIsLoading] = useState(true);
    const apiFetch = useApiFetch();
    const [userPhotographer, setUserPhotogarpher] = useState([]);

    const getUserPhotographer = () => {
        return apiFetch('/users', {
            query: {
                roles: 'ROLE_PHOTOGRAPHER',
                groups: ['user:read', 'user:pictureProfil:read', 'file:read'],
                properties: ['firstname', 'lastname', 'pictureProfil', 'id'],
            },
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(data => {
                console.debug(data);
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                setUserPhotogarpher(data['hydra:member']);
                setIsLoading(false);
                return data;
            })
            .catch(error => {
                console.error(error);
            });
    };
    useEffect(() => {
        getUserPhotographer();
    }, []);

    return (
        <Loader active={isLoading}>
            <div className={style.photographerContainer}>
                <h1>
                    Liste des photographes
                </h1>
                <p className={style.photographerCount}>
                    {userPhotographer.length} photographes
                </p>
                <Table
                    list={userPhotographer}
                    fields={['Photo de profil', 'Nom', 'Prénom']}
                >
                    {user => {
                        return [
                            {
                                content: (
                                    <img
                                        src={apipath(user.pictureProfil.path)}
                                        className={style.photographerPicture}
                                        alt="Photo de profil"
                                        onClick={() => {
                                            window.location.href =
                                                '/photographer/' + user.id;
                                        }}
                                    />
                                ),
                            },
                            {
                                content: user.lastname,
                            },
                            {
                                content: user.firstname,
                            },
                        ];
                    }}
                </Table>
            </div>
        </Loader>
    );
}
