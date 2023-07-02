import { useOutletContext } from 'react-router-dom';
import style from './style.module.scss';
import PicturesAside from '@/components/organisms/FO/PicturesAside';
import Navlink from '@/components/molecules/Navlink';
import Button from "@/components/atoms/Button/index.jsx";
import CompetitionResultsEdit from "@/components/organisms/Modals/competition/CompetitionResultsEdit.jsx";
import {useModal} from "@/contexts/ModalContext/index.jsx";

export default function () {
    const { competition } = useOutletContext();
    const asidePictures = competition.aside;
    const asideLabel = competition.asideLabel;
    const { showModal, setModalContent } = useModal();

    const competitionRouteList = [
        { content: 'Le concours', to: '' },
        { content: 'Règlement', to: '/rules' },
        { content: 'Prix à gagner', to: '/endowments' },
        { content: 'Membres du Jury', to: '/jury' },
        { content: 'Les photos', to: '/pictures' },
        { content: 'Résultats', to: '/results' },
    ];

    return (
        <div className={style.resultsContainer}>
            <div>
                <Navlink base="/competition/:id" list={competitionRouteList} />
                <div className={style.resultsEdit}>
                    <h2>Résultats du concours photo</h2>
                    {competition?.userCanEdit && (
                        <Button textColor={"#fff"} color={"#000"} borderRadius={"25px"} onClick={(e) => {
                            e.preventDefault();
                            setModalContent(<CompetitionResultsEdit competition={competition} />);
                            showModal();
                        }}>
                            éditer
                        </Button>
                    )}
                </div>
                <div
                    className={style.description}
                    dangerouslySetInnerHTML={{ __html: competition.competitionResults }}
                ></div>
            </div>
            <PicturesAside
                pictures={asidePictures}
                asideLabel={asideLabel}
                idPage={competition.id}
            />
        </div>
    );
}
