import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useApiFetch from '@/hooks/useApiFetch.js';
import Button from '@/components/atoms/Button';
import { toast } from 'react-toastify';
import style from './style.module.scss';
import Loader from '@/components/atoms/Loader';
import Table from '@/components/molecules/Table';
import {CSVLink} from "react-csv";

export default function OrganizationList() {
    const [isLoading, setIsLoading] = useState(true);
    const [organizations, setOrganizations] = useState([]);
    const apiFetch = useApiFetch();
    const navigate = useNavigate();

    function getOrganizations(controller) {
        return apiFetch('/organizations', {
            query: {
                groups: [
                    'organization:organizationType:read',
                    'organizationType:read',
                    'organization:competitions:read',
                    'competition:read',
                ],
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
                setOrganizations(data['hydra:member']);
                return data['hydra:member'];
            });
    }

    useEffect(() => {
        const controller = new AbortController();
        const promise = getOrganizations(controller);
        promise.then(function () {
            setIsLoading(false);
        });
        if (import.meta.env.MODE === 'development') {
            toast.promise(promise, {
                pending: 'Chargement des organisations',
                success: 'Organisations chargées',
                error: 'Erreur lors du chargement des organisations',
            });
        }
        return () => setTimeout(() => controller.abort());
    }, []);

    const handleDelete = id => {
        const promise = apiFetch('/organizations/' + id, {
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
                getOrganizations();
            });

        toast.promise(promise, {
            pending: "suppression de l'organisation",
            success: "l'organisation a bien été supprimé",
            error: "une erreur est survenue lors de la suppression de l'organisation",
        });
    };

    return (
        <Loader active={isLoading}>
            <div className={style.container}>
                <div>
                    <h1>Liste des organisations</h1>
                    <Button
                        color="green"
                        textColor="white"
                        borderRadius={'30px'}
                        onClick={() => navigate('/BO/organization/create')}
                    >
                        Créer une organisation
                    </Button>
                </div>
                <div>
                    <Button
                        borderRadius={'30px'}
                        padding={'20px'}
                        icon={'download'}
                    >
                        <CSVLink
                            filename={"organizations_exported.csv"}
                            data={organizations}>
                            Exporter les organisations
                        </CSVLink>
                    </Button>
                </div>
            </div>
            <div className={style.containerList}>
                <Table
                    list={organizations}
                    fields={[
                        'ID',
                        'Statut',
                        'Nom',
                        'Description',
                        'Address',
                        'Code postal',
                        'Ville',
                        'Téléphone',
                        'Adresse mails',
                        'Site web',
                        "Type d'organisation",
                        'Pays',
                        'Nom des concours',
                    ]}
                    actions={[
                        {
                            name: 'Modifier',
                            action: organization =>
                                navigate(
                                    '/BO/organization/edit/' + organization.id
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
                                navigate('/BO/organization/' + organization.id),
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
                    {organization => [
                        { content: organization.id },
                        {
                            content:
                                organization.state === 'validated'
                                    ? 'Validée'
                                    : 'En attente',
                        },
                        { content: organization.organizerName },
                        {
                            content: organization.description,
                        },
                        { content: organization.address },
                        { content: organization.postcode },
                        {
                            content: organization.citycode,
                        },
                        {
                            content: organization.numberPhone,
                        },
                        { content: organization.email },
                        { content: organization.websiteUrl },
                        { content: organization.organizationType.label },
                        { content: organization.country },
                        {
                            content: organization.competitions
                                .map(competition => competition.competitionName)
                                .join(', '),
                        },
                    ]}
                </Table>
            </div>
        </Loader>
    );
}
