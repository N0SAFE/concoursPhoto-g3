import style from './style.module.scss';
import PicturesAside from '@/components/organisms/FO/PicturesAside';
import Navlink from '@/components/molecules/Navlink';
import { useOutletContext } from 'react-router-dom';

export default function () {
    const { competition } = useOutletContext();
    const asidePictures = competition.aside;
    const asideLabel = competition.asideLabel;

    const competitionRouteList = [
        { content: 'Le concours', to: '' },
        { content: 'Règlement', to: '/rules' },
        { content: 'Prix à gagner', to: '/endowments' },
        { content: 'Membres du Jury', to: '/jury' },
        { content: 'Les photos', to: '/pictures' },
        { content: 'Résultats', to: '/results' },
    ];

    return (
        <div className={style.jury}>
            <div className={style.juryContainer}>
                <Navlink base="/competition/:id" list={competitionRouteList} />
                {competition.memberOfTheJuries &&
                competition.memberOfTheJuries.length > 0 ? (
                    <div>
                        <h2>
                            {competition.memberOfTheJuries.length} membre(s) du
                            jury
                        </h2>
                        <ul>
                            {competition.memberOfTheJuries.map(jury => (
                                <li key={jury.id}>
                                    {jury.user.firstname} {jury.user.lastname}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div>
                        <h2>Pas de membre du jury</h2>
                    </div>
                )}
            </div>
            <PicturesAside pictures={asidePictures} asideLabel={asideLabel} />
        </div>
    );
}
