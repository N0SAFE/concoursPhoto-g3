import style from './style.module.scss';
import PicturesAside from '@/views/FO/competition/PicturesAside/index.jsx';
import Navlink from '@/components/molecules/Navlink/index.jsx';
import { useOutletContext } from 'react-router-dom';

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
        <div className={style.container}>
            <div className={style.juryContainer}>
                <Navlink base="/competition/:id" list={competitionRouteList} />
                {competition.memberOfTheJuries &&
                    competition.memberOfTheJuries.length > 0 && (
                        <div>
                            <h2>
                                {competition.memberOfTheJuries.length} membre(s)
                                du jury
                            </h2>
                            <ul>
                                {competition.memberOfTheJuries.map(jury => (
                                    <li key={jury.id}>
                                        {jury.user.firstname}{' '}
                                        {jury.user.lastname}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
            </div>
            <PicturesAside requestType={'last-pictures-posted'} />
        </div>
    );
}
