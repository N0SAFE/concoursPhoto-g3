import { useOutletContext } from 'react-router-dom';
import style from './style.module.scss';
import PicturesAside from '@/components/organisms/FO/PicturesAside';
import Navlink from '@/components/molecules/Navlink';
import React, { useRef, useState } from 'react';
import useApiFetch from '@/hooks/useApiFetch.js';
import { toast } from 'react-toastify';
import Button from "@/components/atoms/Button/index.jsx";
import {useModal} from "@/contexts/ModalContext/index.jsx";
import CompetitionEdit from "@/components/organisms/Modals/competition/CompetitionEdit.jsx";

export default function () {
    const { competition: _competition } = useOutletContext();
    const asidePictures = _competition.aside;
    const asideLabel = _competition.asideLabel;
    const { showModal, setModalContent } = useModal();

    const [competition, setCompetition] = useState(_competition);

    const apiFetch = useApiFetch();
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
                description: editorRef.current.getContent(),
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
        <div className={style.viewContainer}>
            <div>
                <Navlink base="/competition/:id" list={competitionRouteList} />
                <div className={style.viewEdit}>
                    <h2>Le concours</h2>
                    {competition?.userCanEdit && (
                        <Button textColor={"#fff"} color={"#000"} borderRadius={"25px"} onClick={(e) => {
                            e.preventDefault();
                            setModalContent(<CompetitionEdit competition={competition} />);
                            showModal();
                        }}>
                            éditer
                        </Button>
                    )}
                </div>
                <div
                    className={style.description}
                    dangerouslySetInnerHTML={{
                        __html: competition.description,
                    }}
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
