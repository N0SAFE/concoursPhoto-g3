import { useOutletContext } from 'react-router-dom';
import style from './style.module.scss';
import Chip from '@/components/atoms/Chip/index.jsx';
import Navlink from '@/components/molecules/Navlink/index.jsx';

export default function () {
    const { competition } = useOutletContext();

    const competitionRouteList = [
        { content: 'Le concours', to: '' },
        { content: 'Règlement', to: '/rules' },
        { content: 'Prix à gagner', to: '/endowments' },
        { content: 'Membres du Jury', to: '/jury' },
        { content: 'Les photos', to: '/pictures' },
        { content: 'Résultats', to: '/results' },
    ];

    return (
        <div className={style.pictures}>
            <Navlink base="/competition/:id" list={competitionRouteList} />
            <h2>{competition.pictures.length} photos soumises par {competition.numberOfPhotograph} photographes</h2>
            <div className={style.picturesContainer}>
                {competition.pictures &&
                    competition.pictures.map(picture => (
                        <div key={picture.id}>
                            <div>
                                <img
                                    src={
                                        import.meta.env.VITE_API_URL +
                                        '/' +
                                        picture.file.path
                                    }
                                    alt={picture.picture_name}
                                />
                            </div>
                            <div className={style.picturesStats}>
                                <div>
                                    <Chip
                                        backgroundColor={'#F5F5F5'}
                                        title={`${picture.user.firstname} ${picture.user.lastname}`}
                                        icon={'user-plus'}
                                    />
                                </div>
                                <div>
                                    <Chip
                                        backgroundColor={'#F5F5F5'}
                                        icon={'user-plus'}
                                    />
                                    <Chip
                                        iconColor={'white'}
                                        color={'white'}
                                        backgroundColor={'#A8A8A8'}
                                        title={'Voter'}
                                        icon={'like'}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
