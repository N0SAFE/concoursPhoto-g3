import { useOutletContext } from 'react-router-dom';
import style from './style.module.scss';
import PicturesAside from '@/components/organisms/FO/PicturesAside';
import Navlink from '@/components/molecules/Navlink';

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
        <div className={style.results}>
            <div>
                <Navlink base="/competition/:id" list={competitionRouteList} />
                mettre l'entity result ici
            </div>
            <PicturesAside pictures={asidePictures} asideLabel={asideLabel} />
        </div>
    );
}
