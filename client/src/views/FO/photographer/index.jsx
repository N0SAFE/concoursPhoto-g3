import { useAuthContext } from '@/contexts/AuthContext.jsx';
import Table from '@/components/molecules/Table';
import useApiFetch from '@/hooks/useApiFetch.js';
import { useEffect, useState } from 'react';
import style from './style.module.scss';
import Chip from '@/components/atoms/Chip/index.jsx';
import useApiPath from '@/hooks/useApiPath';

export default function PhotographerList() {
    const apipath = useApiPath();
    const apiFetch = useApiFetch();
    const [userPhotographer, setUserPhotogarpher] = useState([]);

    const getUserPhotographer = () => {
        return apiFetch(
            `/users?groups[]=user:read&roles=ROLE_PHOTOGRAPHER&properties[]=firstname&properties[]=lastname&properties[]=picture_profil&groups[]=file`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
            .then(res => res.json())
            .then(data => {
                console.debug(data);
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                setUserPhotogarpher(data['hydra:member']);
                return data;
            })
            .catch(error => {
                console.error(error);
            });
    };
    useEffect(() => {
        getUserPhotographer();
    }, []);
console.log(userPhotographer)
    return (
        <>
            <h1 style={{ textAlign: "center", marginBottom: "3%" }}>Liste des photographes</h1>
            <p style={{ fontWeight: "bold", marginBottom: "1%" }}>{userPhotographer.length} photographes</p>
        <Table 
            list={userPhotographer}
            fields={['Photo de profil','Nom', 'Prénom']}
        >
            {user => {
                    return [
                        {
                            content: <img src={apipath(user.picture_profil.path)} style={{ width: "100px", height: "100px", borderRadius: "50%" }} />,
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
            style={{ width: '100%', display: 'flex', flexDirection: 'row' }}
        >
        </div>
    </>
);
}
