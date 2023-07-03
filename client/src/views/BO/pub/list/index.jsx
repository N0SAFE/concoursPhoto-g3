import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useApiFetch from '@/hooks/useApiFetch';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import style from './style.module.scss';
import Loader from '@/components/atoms/Loader';
import Table from '@/components/molecules/Table';
import { CSVLink } from 'react-csv';

export default function PubList() {
    const apiFetch = useApiFetch();
    const [pubs, setPubs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    function getPubs(controller) {
        const params = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        return apiFetch('/advertising_spaces', {
            query: {
                groups: ['advertisingSpace:read'],
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
                setPubs(data['hydra:member']);
                return data['hydra:member'];
            });
    }

    return (
        <Loader active={isLoading}>
            <div className={style.container}>
                <h1>Liste des pubs</h1>
                <Button
                    color="green"
                    textColor="white"
                    borderRadius={'30px'}
                    onClick={() => navigate('/BO/pub/create')}
                >
                    Créer une pub
                </Button>
            </div>
            <div className={style.containerList}>
                <Table
                    data={pubs}
                    fields={[
                        'ID',
                        'locationName',
                        'heightPx',
                        'widthPx',
                        'referencePrice',
                    ]}
                    actions={[
                        {
                            name: 'Modifier',
                            action: pubs =>
                                navigate('/BO/user/edit/' + user.id),
                            component: (user, callback, index) => {
                                return (
                                    <Button
                                        color="blue"
                                        textColor="white"
                                        borderRadius={'30px'}
                                        onClick={() => callback(pubs)}
                                    >
                                        Modifier
                                    </Button>
                                );
                            },
                        },
                        {
                            name: 'Supprimer',
                            action: pubs => {
                                if (
                                    confirm(
                                        'Êtes-vous sûr de vouloir supprimer cet pub ?'
                                    )
                                ) {
                                    return handleDelete(user.id);
                                }
                            },
                            component: (user, callback, index) => {
                                return (
                                    <Button
                                        color="red"
                                        textColor="white"
                                        borderRadius={'30px'}
                                        onClick={() => {
                                            callback(user);
                                        }}
                                    >
                                        Supprimer
                                    </Button>
                                );
                            },
                        },
                        {
                            name: 'Voir',
                            action: user => navigate('/BO/user/' + user.id),
                            component: (user, callback, index) => (
                                <Button
                                    borderRadius={'30px'}
                                    onClick={() => callback(user)}
                                >
                                    Voir
                                </Button>
                            ),
                        },
                    ]}
                >
                    {pubs => [
                        { content: pubs.id },
                        { content: pubs.locationName },
                        { content: pubs.heightPx },
                        { content: pubs.widthPx },
                        { content: pubs.referencePrice },
                    ]}
                </Table>
            </div>
        </Loader>
    );
}
