import { useOutletContext, useParams } from 'react-router-dom';
import Navlink from '@/components/molecules/Navlink';
import PicturesAside from '@/components/organisms/FO/PicturesAside';
import style from './style.module.scss';
import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'react-toastify';


export default function () {
    const { competition, asideLabel  } = useOutletContext();
    const asidePictures = competition.aside
    
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
        const res = apiFetch(
            `/competitions/${competition.id}`,
            {
                method: 'PATCH',
                body: JSON.stringify({ endowments:editorRef.current.getContent()}),
                headers: {
                    'Content-Type':
                        'application/merge-patch+json',
                },
            }
        )
        toast.promise(res, {
            pending: 'Mise à jour en cours',
            success: 'Mise à jour effectuée',
            error: 'Erreur lors de la mise à jour',
        })
    }
    return (
        <div>
            <div className={style.endowmentsContainer}>
                <div>
                    <Navlink
                        base="/competition/:id"
                        list={competitionRouteList}
                    />
                    <div className={style.description} dangerouslySetInnerHTML={{ __html : competition.endowments}}>
                        
                    </div>
                    <Editor
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={competition.endowments}
                        init={{
                        height: 500,
                        menubar: false,
                        plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'table', 'code', 'help', 'wordcount','emoticons','charmap', 'insertdatetime'
                            ],
                        toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help' + ' | emoticons' + ' insertdatetime | code | preview',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
                    />
                    <button style={{ borderRadius: "10%" }} onClick={updateCompetition}>Editer</button>
                </div>
                <PicturesAside pictures={asidePictures} asideLabel={asideLabel } />
            </div>
        </div>
    );
}