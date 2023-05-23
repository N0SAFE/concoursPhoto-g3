import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useApiFetch from '@/hooks/useApiFetch';
import Button from '@/components/atoms/Button';
import { toast } from 'react-toastify';
import style from './style.module.scss';
import Loader from '@/components/atoms/Loader/index.jsx';
import Table from '@/components/molecules/Table';

export default function CompetitionsList() {
    const [isLoading, setIsLoading] = useState(true);
    const apiFetch = useApiFetch();
    const navigate = useNavigate();
    const [competitions, setCompetitions] = useState([]);

    function getCompetitions(controller) {
        return apiFetch('/competitions?groups[]=competition', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller?.signal,
        })
            .then(res => res.json())
            .then(async data => {
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                console.debug(data);
                setCompetitions(data['hydra:member']);
                return data['hydra:member'];
            });
    }

    useEffect(() => {
        const controller = new AbortController();
        const promise = getCompetitions(controller);
        promise.then(function () {
            setIsLoading(false);
        });
        if (import.meta.env.MODE === 'development') {
            toast.promise(promise, {
                pending: 'Chargement des concours',
                success: 'Concours chargés',
                error: 'Erreur lors du chargement des concours',
            });
        }
        return () => setTimeout(() => controller.abort());
    }, []);

    const handleDelete = id => {
        const promise = apiFetch('/competitions/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                getCompetitions();
            });

        toast.promise(promise, {
            pending: 'suppression du concour',
            success: 'le concour a bien été supprimé',
            error: 'une erreur est survenue lors de la suppression du concour',
        });
    };

    return (
        <Loader active={isLoading}>
                 <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                    }}
                >
                    <h1>Liste des concours</h1>
                    <Button
                        color="green"
                        textColor="white"
                        name="Créer un concours"
                        borderRadius={'30px'}
                        onClick={() => navigate('/BO/competition/create')}
                    ></Button>
                </div>
            <div className={style.containerList}>
           

                <Table
                    entityList={competitions}
                    fields={[
                        { property: 'id', display: 'ID' },
                        { property: 'state', display: 'Statut' },
                        { property: 'competition_name', display: 'Nom' },
                        { property: 'description', display: 'Description' },
                        { property: 'rules', display: 'Règlement' },
                        { property: 'endowments', display: 'Dotation' },
                        {
                            property: 'creation_date',
                            display: 'Date de création',
                        },
                        {
                            property: 'publication_date',
                            display: 'Date de publication',
                        },
                        {
                            property: 'submission_start_date',
                            display: 'Date de commencement',
                        },
                        {
                            property: 'voting_start_date',
                            display: 'Date de début de vote',
                        },
                    ]}
                    customAction={({ entity, property }) => {
                        if (property === 'creation_date') {
                            return new Date(
                                entity.creation_date
                            ).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            });
                        }
                        if (property === 'voting_start_date') {
                            return new Date(
                                entity.voting_start_date
                            ).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            });
                        }
                        if (property === 'publication_date') {
                            return new Date(
                                entity.publication_date
                            ).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            });
                        }
                        if (property === 'submission_start_date') {
                            return new Date(
                                entity.submission_start_date
                            ).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            });
                        }
                        if (property === 'state') {
                            return entity.state ? 'Validée' : 'En attente';
                        }
                        return entity[property];
                    }}
                    actions={[
                        {
                            label: 'Modifier',
                            color: 'blue',
                            textColor: 'white',
                            action: ({ entity }) => {
                                navigate('/BO/competition/edit/' + entity.id);
                            },
                        },
                        {
                            label: 'Supprimer',
                            color: 'red',
                            textColor: 'white',
                            action: ({ entity }) => {
                                if (
                                    confirm(
                                        'Êtes-vous sûr de vouloir supprimer ce concours ?'
                                    )
                                ) {
                                    return handleDelete(entity.id);
                                }
                            },
                        },
                        {
                            label: 'Voir',
                            action: ({ entity }) => {
                                navigate('/BO/competition/' + entity.id);
                            },
                        },
                    ]}
                />
            </div>
        </Loader>
    );
}
