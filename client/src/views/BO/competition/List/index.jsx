import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useApiFetch from '@/hooks/useApiFetch';
import Button from '@/components/atoms/Button';
import { toast } from 'react-toastify';
import style from './style.module.scss';
import Loader from '@/components/atoms/Loader/index.jsx';
import Table from '@/components/molecules/Table';
import {CSVLink} from "react-csv";

export default function CompetitionsList() {
    const [isLoading, setIsLoading] = useState(true);
    const apiFetch = useApiFetch();
    const navigate = useNavigate();
    const [competitions, setCompetitions] = useState([]);

    function getCompetitions(controller) {
        return apiFetch('/competitions', {
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
            <div className={style.container}>
                <div>
                    <h1>Liste des concours</h1>
                    <Button
                        color="green"
                        textColor="white"
                        borderRadius={'30px'}
                        onClick={() => navigate('/BO/competition/create')}
                    >
                        Créer un concours
                    </Button>
                </div>
                <div>
                    <Button
                        borderRadius={'30px'}
                        padding={'20px'}
                        icon={'download'}
                    >
                        <CSVLink
                            filename={"competitions_exported.csv"}
                            data={competitions}>
                            Exporter les concours
                        </CSVLink>
                    </Button>
                </div>
            </div>
            <div className={style.containerList}>
                <Table
                    list={competitions}
                    fields={[
                        'ID',
                        'Statut',
                        'Nom',
                        'Description',
                        'Règlement',
                        'Dotation',
                        'Date de création',
                        'Date de publication',
                        'Date de commencement',
                        'Date de début de vote',
                        'Mise en avant',
                    ]}
                    actions={[
                        {
                            name: 'Modifier',
                            action: organization =>
                                navigate(
                                    '/BO/competition/edit/' + organization.id
                                ),
                            component: (organization, callback, index) => {
                                return (
                                    <Button
                                        color="blue"
                                        textColor="white"
                                        borderRadius={'30px'}
                                        onClick={() => callback(organization)}
                                    >
                                        Modifier
                                    </Button>
                                );
                            },
                        },
                        {
                            name: 'Supprimer',
                            action: organization => {
                                if (
                                    confirm(
                                        'Êtes-vous sûr de vouloir supprimer cet utilisateur ?'
                                    )
                                ) {
                                    return handleDelete(organization.id);
                                }
                            },
                            component: (organization, callback, index) => {
                                return (
                                    <Button
                                        color="red"
                                        textColor="white"
                                        borderRadius={'30px'}
                                        onClick={() => {
                                            callback(organization);
                                        }}
                                    >
                                        Supprimer
                                    </Button>
                                );
                            },
                        },
                        {
                            name: 'Voir',
                            action: organization =>
                                navigate('/BO/competition/' + organization.id),
                            component: (organization, callback, index) => (
                                <Button
                                    borderRadius={'30px'}
                                    onClick={() => callback(organization)}
                                >
                                    Voir
                                </Button>
                            ),
                        },
                    ]}
                >
                    {competition => [
                        { content: competition.id },
                        {
                            content: competition.stateLabel,
                        },
                        { content: competition.competitionName },
                        {
                            content: competition.description,
                        },
                        { content: competition.rules },
                        { content: competition.endowments },
                        {
                            content: new Date(
                                competition.creationDate
                            ).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                            }),
                        },
                        {
                            content: new Date(
                                competition.publicationDate
                            ).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                            }),
                        },
                        {
                            content: new Date(
                                competition.submissionStartDate
                            ).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                            }),
                        },
                        {
                            content: new Date(
                                competition.votingStartDate
                            ).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                            }),
                        },
                        { content: competition.isPromoted
                                ? 'Oui'
                                : 'Non', },
                    ]}
                </Table>
            </div>
        </Loader>
    );
}
