import { useAuthContext } from '@/contexts/AuthContext.jsx';
import Table from '@/components/molecules/Table';
import useApiFetch from '@/hooks/useApiFetch.js';
import { useEffect, useState } from 'react';
import style from './style.module.scss';
import Chip from '@/components/atoms/Chip/index.jsx';
import useApiPath from '@/hooks/useApiPath';
import Loader from '@/components/atoms/Loader/index.jsx';

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
            <>
                <h1 style={{ textAlign: 'center', marginBottom: '3%' }}>
                    Liste des photographes
                </h1>
                <p style={{ fontWeight: 'bold', marginBottom: '1%' }}>
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
                                        onClick={() => {
                                            window.location.href =
                                                '/photographer/' + user.id;
                                        }}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            borderRadius: '50%',
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
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                ></div>
            </>
        </Loader>
    );
}
