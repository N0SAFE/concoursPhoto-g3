import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useApiFetch from '@/hooks/useApiFetch';
import style from './style.module.scss';
import { useAuthContext } from '@/contexts/AuthContext.jsx';

export default function UserList() {
    const apiFetch = useApiFetch();
    const { me } = useAuthContext();
    const [users, setUsers] = useState(me.Manage);
    const [filterState, setFilterState] = useState('all');
    const [filterVerified, setFilterVerified] = useState('all');

    const navigate = useNavigate();

    const handleDelete = id => {
        apiFetch('/users/' + me + id, {
            method: 'DELETE',
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
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                getUsers();
            });
    };

    const handleFilterChange = e => {
        if (e.target.id === 'state-filter') {
            setFilterState(e.target.value);
        }
        if (e.target.id === 'state-verifiedFilter') {
            setFilterVerified(e.target.value);
        }
    };

    const userFiltering = () => {
        let filteredUsers = users.filter(user => {
            if (filterState !== 'all') {
                if (filterVerified && user.state !== (filterState === 'true')) {
                    return false;
                }
            }
            if (filterVerified !== 'all') {
                if (
                    filterState &&
                    user.is_verified !== (filterVerified === 'true')
                ) {
                    return false;
                }
            }
            return true;
        });
        return filteredUsers;
    };

    return (
        <div className={style.containerList}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <h1>Liste des concours</h1>
            </div>
            <div>
                <label htmlFor="state-filter">Filtrer par état :</label>
                <select
                    id="state-filter"
                    value={filterState}
                    onChange={handleFilterChange}
                >
                    <option value="all">Tous</option>
                    <option value="true">Actif</option>
                    <option value="false">Inactif</option>
                </select>
                <label htmlFor="state-verifiedFilter">
                    Filtrer par vérification :
                </label>
                <select
                    id="state-verifiedFilter"
                    value={filterVerified}
                    onChange={handleFilterChange}
                >
                    <option value="all">Tous</option>
                    <option value="true">Vérifié</option>
                    <option value="false">Non vérifié</option>
                </select>
            </div>
            <Table
                entityList={userFiltering()}
                fields={[{ property: 'pictures.id', display: 'ID' }]}
                actions={[
                    {
                        label: 'Modifier',
                        color: 'blue',
                        textColor: 'white',
                        action: ({ entity }) => {
                            navigate('/BO/user/edit/' + entity.id);
                        },
                    },
                    {
                        label: 'Supprimer',
                        color: 'red',
                        textColor: 'white',
                        action: ({ entity }) => {
                            if (
                                confirm(
                                    'Êtes-vous sûr de vouloir supprimer cet utilisateur ?'
                                )
                            ) {
                                return handleDelete(entity.id);
                            }
                        },
                    },
                    {
                        label: 'Voir',
                        action: ({ entity }) => {
                            navigate('/BO/user/' + entity.id);
                        },
                    },
                ]}
            />
        </div>
    );
}
