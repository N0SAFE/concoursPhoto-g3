import style from './style.module.scss';
import Card from '@/components/molecules/Card';

export default function FOCompetitionList({ cardContentList }) {
    return (
        <div className={style.lastCompetition}>
            <div>
                {cardContentList.map(competition => {
                    return (
                        <Card
                            idContent={competition.id}
                            title={competition.competition_name}
                            imagePath={competition.competition_visual.path}
                            filters={[
                                competition.organization?.users.map(
                                    user =>
                                        user.firstname + ' ' + user.lastname ||
                                        null
                                ),
                                competition?.theme.map(item => item.label),
                                competition.state ? 'En cours' : 'Terminé',
                            ].filter(i => i !== null)}
                            stats={[
                                {
                                    name: competition.numberOfParticipants,
                                    icon: 'user-plus',
                                },
                                {
                                    name: competition.numberOfPictures,
                                    icon: 'camera1',
                                },
                                {
                                    name: competition.numberOfVotes,
                                    icon: 'like',
                                },
                            ]}
                            finalDate={new Date(
                                competition.results_date
                            ).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        />
                    );
                })}
            </div>
        </div>
    );
}
