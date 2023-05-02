import { useParams, useOutletContext } from 'react-router-dom';
import style from './style.module.scss';
import PicturesAside from '@/views/FO/competition/PicturesAside/index.jsx';
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
        <div className={style.viewContainer}>
            <div>
                <Navlink base="/competition/:id" list={competitionRouteList} />
                <p className={style.description}>{competition.description}</p>
            </div>
            <PicturesAside requestType={'last-pictures-posted'} />
        </div>
    );
}
