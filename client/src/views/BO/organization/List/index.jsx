import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useApiFetch from '@/hooks/useApiFetch.js';
import Button from '@/components/atoms/Button';
import { toast } from 'react-toastify';
import style from './style.module.scss';
import Loader from '@/components/atoms/Loader';
import Table from '@/components/molecules/Table';

export default function OrganizationList() {
    const [isLoading, setIsLoading] = useState(true);
    const [Organizations, setOrganizations] = useState([]);
    const apiFetch = useApiFetch();
    const navigate = useNavigate();

    function getOrganizations(controller) {
        return apiFetch('/organizations', {
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
            <div className={style.containerList}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                    }}
                >
                    <h1>Liste des organisations</h1>
                    <Button
                        color="green"
                        textColor="white"
                        name="Créer une organisation"
                        borderRadius={'30px'}
                        onClick={() => navigate('/BO/organization/create')}
                    ></Button>
                </div>
                <Table
                    entityList={Organizations}
                    fields={[
                        { property: 'id', display: 'ID' },
                        { property: 'state', display: 'Statut' },
                        {
                            property: 'organizer_name',
                            display: "Nom de l'organisation",
                        },
                        { property: 'description', display: 'Description' },
                        { property: 'address', display: 'Addresse' },
                        { property: 'postcode', display: 'Code postal' },
                        { property: 'citycode', display: 'Ville' },
                        { property: 'number_phone', display: 'Téléphone' },
                        { property: 'email', display: 'Adresse mail' },
                        { property: 'website_url', display: 'Site web' },
                        {
                            property: 'organization_type',
                            display: "Type d'organisation",
                        },
                        { property: 'country', display: 'Pays' },
                        {
                            property: 'competitions',
                            display: 'Nom du concours',
                        },
                    ]}
                    customAction={({ entity, property }) => {
                        if (property === 'organization_type') {
                            return entity.organization_type.label;
                        }
                        if (property === 'competitions') {
                            return entity.competitions
                                .map(
                                    competition => competition.competition_name
                                )
                                .join(', ');
                        }
                        if (property === 'state') {
                            return entity.state === 'validated'
                                ? 'Validée'
                                : 'En attente';
                        }
                        return entity[property];
                    }}
                    actions={[
                        {
                            label: 'Modifier',
                            color: 'blue',
                            textColor: 'white',
                            action: ({ entity }) => {
                                navigate('/BO/organization/edit/' + entity.id);
                            },
                        },
                        {
                            label: 'Supprimer',
                            color: 'red',
                            textColor: 'white',
                            action: ({ entity }) => {
                                if (
                                    confirm(
                                        'Êtes-vous sûr de vouloir supprimer cette organisation ?'
                                    )
                                ) {
                                    return handleDelete(entity.id);
                                }
                            },
                        },
                        {
                            label: 'Voir',
                            action: ({ entity }) => {
                                navigate('/BO/organization/' + entity.id);
                            },
                        },
                    ]}
                />
            </div>
        </Loader>
    );
}
