import { useOutletContext, useParams } from 'react-router-dom';
import Navlink from '@/components/molecules/Navlink';
import PicturesAside from '@/components/organisms/FO/PicturesAside';
import style from './style.module.scss';

export default function () {
    const { competition, asidePictures, asideLabel  } = useOutletContext();

    const competitionRouteList = [
        { content: 'Le concours', to: '' },
        { content: 'Règlement', to: '/rules' },
        { content: 'Prix à gagner', to: '/endowments' },
        { content: 'Membres du Jury', to: '/jury' },
        { content: 'Les photos', to: '/pictures' },
        { content: 'Résultats', to: '/results' },
    ];

    return (
        <div>
            <div className={style.endowmentsContainer}>
                <div>
                    <Navlink
                        base="/competition/:id"
                        list={competitionRouteList}
                    />
                    <p className={style.description}>
                        {competition.endowments}
                    </p>
                </div>
                <PicturesAside pictures={asidePictures} asideLabel={asideLabel } />
            </div>
        </div>
    );
}
