import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useApiFetch from '@/hooks/useApiFetch';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import style from './style.module.scss';
import Loader from '@/components/atoms/Loader';
import Table from '@/components/molecules/Table';

export default function PhotographerBOList() {
    const apiFetch = useApiFetch();
    const [users, setUsers] = useState([]);
    const [filterState, setFilterState] = useState('all');
    const [filterVerified, setFilterVerified] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    function getUsers(controller) {
        const params = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        if (filterState) {
            params.params = {
                state: filterState,
            };
        }
        if (filterVerified) {
            params.params = {
                isVerified: filterVerified,
            };
        }

        return apiFetch('/users', {
            query: {
                roles: 'ROLE_PHOTOGRAPHER',
                groups: ['user:gender:read', 'gender:read'],
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
                setUsers(data['hydra:member']);
                return data['hydra:member'];
            });
    }

    useEffect(() => {
        const controller = new AbortController();
        const promise = getUsers(controller);
        promise.then(function () {
            setIsLoading(false);
        });
        if (import.meta.env.MODE === 'development') {
            toast.promise(promise, {
                pending: 'Chargement des utilisateurs',
                success: 'Utilisateurs chargés',
                error: 'Erreur lors du chargement des utilisateurs',
            });
        }
        return () => setTimeout(() => controller.abort());
    }, [filterState, filterVerified]);

    const handleDelete = id => {
        const promise = apiFetch('/users/' + id, {
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
                getUsers();
            });
        toast.promise(promise, {
            pending: "suppression de l'utilisateur",
            success: "l'utitilisateur a bien été supprimé",
            error: "une erreur est survenue lors de la suppression de l'utilisateur",
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
                if (filterVerified && user.active !== (filterState === 'true')) {
                    return false;
                }
            }
            if (filterVerified !== 'all') {
                if (
                    filterState &&
                    user.isVerified !== (filterVerified === 'true')
                ) {
                    return false;
                }
            }
            return true;
        });
        return filteredUsers;
    };

    return (
        <Loader active={isLoading}>
            <div className={style.container}>
                <h1>Liste des photographes</h1>
                <Button
                    color="green"
                    textColor="white"
                    borderRadius={'30px'}
                    onClick={() => navigate('/BO/user/create')}
                >
                    Créer un utilisateur
                </Button>
            </div>
            <div className={style.containerState}>
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
                </div>
                <div>
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
            </div>
            <div className={style.containerList}>
                <Table
                    list={userFiltering()}
                    fields={[
                        'ID',
                        'Etat',
                        'Email',
                        'Roles',
                        'Prénom',
                        'Nom',
                        'Date de naissance',
                        'Date de création',
                        'Genre',
                        'Adresse',
                        'Code postal',
                        'Ville',
                        'Pays',
                        'Numéro de téléphone',
                        'Vérification',
                    ]}
                    actions={[
                        {
                            name: 'Modifier',
                            action: user =>
                                navigate('/BO/user/edit/' + user.id),
                            component: (user, callback, index) => {
                                return (
                                    <Button
                                        color="blue"
                                        textColor="white"
                                        borderRadius={'30px'}
                                        onClick={() => callback(user)}
                                    >
                                        Modifier
                                    </Button>
                                );
                            },
                        },
                        {
                            name: 'Supprimer',
                            action: user => {
                                if (
                                    confirm(
                                        'Êtes-vous sûr de vouloir supprimer cet utilisateur ?'
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
                    {user => [
                        { content: user.id },
                        { content: user.active ? 'Actif' : 'Inactif' },
                        { content: user.email },
                        {
                            content: user.roles.map((role, index) => (
                                <span key={index}>{role}</span>
                            )),
                        },
                        { content: user.firstname },
                        { content: user.lastname },
                        {
                            content: new Date(
                                user.dateOfBirth
                            ).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                            }),
                        },
                        {
                            content: new Date(
                                user.creationDate
                            ).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                            }),
                        },
                        { content: user.gender.label },
                        { content: user.address },
                        { content: user.postcode },
                        { content: user.citycode },
                        { content: user.country },
                        { content: user.phoneNumber },
                        {
                            content: user.isVerified
                                ? 'Vérifié'
                                : 'Non vérifié',
                        },
                    ]}
                </Table>
            </div>
        </Loader>
    );
}
