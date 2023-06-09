import { useAuthContext } from '@/contexts/AuthContext.jsx';
import Table from '@/components/molecules/Table';
import useApiFetch from '@/hooks/useApiFetch.js';
import { useEffect, useState } from 'react';
import style from './style.module.scss';
import Chip from '@/components/atoms/Chip/index.jsx';
import Loader from '@/components/atoms/Loader/index.jsx';
import { useNavigate } from 'react-router-dom';

export default function CompetitionAdministration() {
    const navigate = useNavigate();
    const { me } = useAuthContext();
    const apiFetch = useApiFetch();
    const [userCompetitions, setUserCompetitions] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // isLoading = competition.isLoading

    const getUserCompetitions = () => {
        setIsLoading(true);
        return apiFetch(`/competitions`, {
            query: {
                'organization.admins': `/users/${me.id}`,
                properties: [
                    'id',
                    'competitionName',
                    'submissionStartDate',
                    'submissionEndDate',
                    'state',
                    'numberOfParticipants',
                    'numberOfPictures',
                ],
            },
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                setUserCompetitions(data['hydra:member']);
                setIsLoading(false);
                return data['hydra:member'];
            })
            .catch(error => {
                console.error(error);
            });
    };

    console.log(userCompetitions)

    useEffect(() => {
        const controller = new AbortController();

        // get last pictures posted in this competition
        getUserCompetitions();

        return () => setTimeout(() => controller.abort());
    }, []);

    return (
        <div>
            <p className={style.administrationsCounter}>
                {userCompetitions.length} concours
            </p>
            <Loader
                active={isLoading}
                takeInnerContent={true}
                style={{ borderRadius: '10px' }}
            >
                <Table
                    onLineClick={function (competition) {
                        navigate(`/competition/${competition.id}`);
                    }}
                    list={userCompetitions}
                    fields={[
                        'Nom du concours',
                        'Début du concours',
                        'Fin du concours',
                        'Statut',
                        'Participants',
                        'Photos',
                    ]}
                >
                    {function (competition) {
                        return [
                            { content: competition.competitionName },
                            {
                                content: new Date(
                                    competition.submissionStartDate
                                ).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }),
                            },
                            {
                                content: new Date(
                                    competition.submissionEndDate
                                ).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }),
                            },
                            {
                                content: (
                                    <Chip
                                        backgroundColor={
                                            competition.state === 1
                                                ? '#00A3FF'
                                                : competition.state >= 2 &&
                                                  competition.state <= 5
                                                ? '#00CE3A'
                                                : '#F1F1F1'
                                        }
                                        color={
                                            competition.state >= 1 &&
                                            competition.state <= 5
                                                ? '#fff'
                                                : '#000'
                                        }
                                    >
                                        {competition.state === 1
                                            ? 'A venir'
                                            : competition.state >= 2 &&
                                              competition.state <= 5
                                            ? 'En cours'
                                            : 'Terminé'}
                                    </Chip>
                                ),
                            },
                            { content: competition.numberOfParticipants },
                            { content: competition.numberOfPictures },
                        ];
                    }}
                </Table>
            </Loader>
        </div>
    );
}
