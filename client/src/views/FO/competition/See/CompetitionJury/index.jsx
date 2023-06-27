import style from './style.module.scss';
import PicturesAside from '@/components/organisms/FO/PicturesAside';
import Navlink from '@/components/molecules/Navlink';
import { useOutletContext } from 'react-router-dom';
import Button from "@/components/atoms/Button/index.jsx";
import {useModal} from "@/contexts/ModalContext/index.jsx";
import CompetitionJuryEdit from "@/components/organisms/Modals/competition/CompetitionJuryEdit";

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
        <div className={style.jury}>
            <div className={style.juryContainer}>
                <Navlink base="/competition/:id" list={competitionRouteList} />
                <div className={style.juryEdit}>
                    <h2>Membres du jury</h2>
                    {competition?.userCanEdit && (
                        <Button textColor={"#fff"} color={"#000"} borderRadius={"25px"} onClick={(e) => {
                            e.preventDefault();
                            setModalContent(<CompetitionJuryEdit competition={competition} />);
                            showModal();
                        }}>
                            éditer
                        </Button>
                    )}
                </div>
                {competition.memberOfTheJuries && competition.memberOfTheJuries.length > 0 ? (
                    <div className={style.memberList}>
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
            <PicturesAside
                pictures={asidePictures}
                asideLabel={asideLabel}
                idPage={competition.id}
            />
        </div>
    );
}
