import { useAuthContext } from '@/contexts/AuthContext.jsx';
import Table from '@/components/molecules/Table';
import useApiFetch from '@/hooks/useApiFetch.js';
import { useEffect, useState } from 'react';
import style from './style.module.scss';
import Chip from '@/components/atoms/Chip/index.jsx';

export default function CompetitionParticipation() {
    const { me } = useAuthContext();
    const apiFetch = useApiFetch();
    const [userCompetitions, setUserCompetitions] = useState([]);

    const getUserCompetitions = () => {
        return apiFetch(
            `/competitions?pictures.user=/users/${me.id}&properties[]=competition_name&properties[]=submission_start_date&properties[]=submission_end_date&properties[]=state&properties[]=numberOfPictures&properties[]=results_date`,
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
                setUserCompetitions(data['hydra:member']);
                return data;
            })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        const controller = new AbortController();

        // get last pictures posted in this competition
        getUserCompetitions();

        return () => setTimeout(() => controller.abort());
    }, []);

    return (
        <div className={style.participationsContainer}>
            <Table
                entityList={userCompetitions}
                fields={[
                    {
                        property: 'competition_name',
                        display: 'Nom du concours',
                    },
                    {
                        property: 'submission_start_date',
                        display: 'Date de début du concours',
                    },
                    {
                        property: 'submission_end_date',
                        display: 'Date de fin du concours',
                    },
                    { property: 'state', display: 'Statut' },
                    { property: 'numberOfPictures', display: 'Mes photos' },
                    { property: 'results_date', display: 'Résultat' },
                ]}
                customAction={({ entity, property }) => {
                    if (property === 'state') {
                        return (
                            <Chip
                                backgroundColor={
                                    entity.state === 1
                                        ? '#00A3FF'
                                        : entity.state >= 2 && entity.state <= 5
                                        ? '#00CE3A'
                                        : '#F1F1F1'
                                }
                                color={
                                    entity.state >= 1 && entity.state <= 5
                                        ? '#fff'
                                        : '#000'
                                }
                                title={
                                    entity.state === 1
                                        ? 'A venir'
                                        : entity.state >= 2 && entity.state <= 5
                                        ? 'En cours'
                                        : 'Terminé'
                                }
                            />
                        );
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
                    if (property === 'submission_end_date') {
                        return new Date(
                            entity.submission_end_date
                        ).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        });
                    }
                    if (property === 'results_date') {
                        return new Date(entity.results_date).toLocaleDateString(
                            'fr-FR',
                            {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            }
                        );
                    }
                }}
            />
        </div>
    );
}
