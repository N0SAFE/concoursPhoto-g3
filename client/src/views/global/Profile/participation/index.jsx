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
                return data['hydra:member'];
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
            <p className={style.participationsCounter}>{userCompetitions.length} concours</p>
            <Table
                list={userCompetitions}
                fields={[
                    'Nom du concours', 'Date de début du concours', 'Date de fin du concours', 'Statut', 'Mes photos', 'Résultat',
                ]}
            >
                {function (competition) {
                    return [
                        {content: competition.competition_name},
                        {content: new Date(
                                competition.submission_start_date
                        ).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        }), },
                        {content: new Date(
                                competition.submission_end_date
                        ).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        }), },
                        {content: <Chip
                            backgroundColor={
                                competition.state === 1
                                    ? '#00A3FF'
                                    : competition.state >= 2 && competition.state <= 5
                                        ? '#00CE3A'
                                        : '#F1F1F1'
                            }
                            color={
                                competition.state >= 1 && competition.state <= 5
                                    ? '#fff'
                                    : '#000'
                            }
                            title={
                                competition.state === 1
                                    ? 'A venir'
                                    : competition.state >= 2 && competition.state <= 5
                                        ? 'En cours'
                                        : 'Terminé'
                            }
                        />, },
                        {content: competition.numberOfPictures,},
                        {content: new Date(competition.results_date).toLocaleDateString(
                            'fr-FR',
                            {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            }
                        ) }

                    ]
                }}
            </Table>
        </div>
    );
}
