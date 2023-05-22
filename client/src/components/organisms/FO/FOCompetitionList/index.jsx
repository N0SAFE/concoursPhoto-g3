import style from './style.module.scss';
import Card from '@/components/molecules/Card';

export default function FOCompetitionList({cardContentList}) {
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
                                    user => user.firstname + ' ' + user.lastname
                                ),
                                competition?.theme.map(item => item.label),
                                competition.state ? 'En cours' : 'Terminé',
                            ]}
                            stats={[
                                {
                                    name: competition.numberOfUser,
                                    icon: 'user-plus',
                                },
                                {
                                    name: competition.pictures.length,
                                    icon: 'camera',
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
