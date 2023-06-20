import { useOutletContext, useParams } from 'react-router-dom';
import Navlink from '@/components/molecules/Navlink';
import PicturesAside from '@/components/organisms/FO/PicturesAside';
import style from './style.module.scss';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Button from "@/components/atoms/Button/index.jsx";
import {useModal} from "@/contexts/ModalContext/index.jsx";
import CompetitionEndowmentsEdit from "@/components/organisms/Modals/competition/CompetitionEndowmentsEdit";

export default function () {
    const { competition: _competition } = useOutletContext();
    const asidePictures = _competition.aside;
    const asideLabel = _competition.asideLabel;
    const { showModal, setModalContent } = useModal();

    const [competition, setCompetition] = useState(_competition);

    const editorRef = useRef(null);

    const competitionRouteList = [
        { content: 'Le concours', to: '' },
        { content: 'Règlement', to: '/rules' },
        { content: 'Prix à gagner', to: '/endowments' },
        { content: 'Membres du Jury', to: '/jury' },
        { content: 'Les photos', to: '/pictures' },
        { content: 'Résultats', to: '/results' },
    ];
    function updateCompetition() {
        const res = apiFetch(`/competitions/${competition.id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                endowments: editorRef.current.getContent(),
            }),
            headers: {
                'Content-Type': 'application/merge-patch+json',
            },
        });
        toast.promise(res, {
            pending: 'Mise à jour en cours',
            success: 'Mise à jour effectuée',
            error: 'Erreur lors de la mise à jour',
        });
    }
    return (
        <div>
            <div className={style.endowmentsContainer}>
                <div>
                    <Navlink
                        base="/competition/:id"
                        list={competitionRouteList}
                    />
                    <div className={style.endowmentsEdit}>
                        <h2>Prix à gagner</h2>
                        {competition?.userCanEdit && (
                            <Button textColor={"#fff"} color={"#000"} borderRadius={"25px"} onClick={(e) => {
                                e.preventDefault();
                                setModalContent(<CompetitionEndowmentsEdit competition={competition} />);
                                showModal();
                            }}>
                                éditer
                            </Button>
                        )}
                    </div>
                    <div
                        className={style.description}
                        dangerouslySetInnerHTML={{
                            __html: competition.endowments,
                        }}
                    ></div>
                </div>
                <PicturesAside
                    pictures={asidePictures}
                    asideLabel={asideLabel}
                    idPage={competition.id}
                />
            </div>
        </div>
    );
}
