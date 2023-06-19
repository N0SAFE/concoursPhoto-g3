import style from './style.module.scss';
import PortalList from '@/components/organisms/FO/FOPortalList';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button/index.jsx';
import { useOutletContext } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import useApiFetch from '@/hooks/useApiFetch';
import Card from '@/components/molecules/Card/index.jsx';
import Icon from '@/components/atoms/Icon';

export default function OrganisationDetails() {
    const { organization: _organization } = useOutletContext();
    const navigate = useNavigate();
    const [cardLoading, setCardLoading] = useState(false);
    const [cardDisposition, setCardDisposition] = useState('grid');
    const apiFetch = useApiFetch();
    const [organization, setOrganization] = useState(_organization);
    const editorRef = useRef(null);

    function updateOrganization() {
        const res = apiFetch(`/organizations/${organization.id}`, {
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

    console.log(organization);

    return (
        <div className={style.wrapper}>
            <PortalList
                boxSingle={{
                    type: 'picture',
                    path: organization.organizationVisual?.path,
                    alt: 'Photo du concours',
                }}
                boxUp={{
                    type: 'picture',
                    path: organization.logo?.path,
                    alt: 'Logo du concours',
                }}
                boxDown={{
                    type: 'picture',
                }}
                // boxDownContents={

                // )}
            />

            <div className={style.formWrapper}>
                <div style={{ flex: '66%' }} className={style.formColumn}>
                    <h2>Qui sommes-nous ?</h2>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: organization.description,
                        }}
                    ></div>
                    <Editor
                        onEditorChange={s => {
                            setOrganization({
                                ...organization,
                                description: s,
                            });
                        }}
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        initialValue={organization.description}
                        init={{
                            height: 500,
                            menubar: false,
                            plugins: [
                                'advlist',
                                'autolink',
                                'lists',
                                'link',
                                'image',
                                'charmap',
                                'preview',
                                'anchor',
                                'searchreplace',
                                'visualblocks',
                                'code',
                                'fullscreen',
                                'insertdatetime',
                                'table',
                                'code',
                                'help',
                                'wordcount',
                                'emoticons',
                                'charmap',
                                'insertdatetime',
                            ],
                            toolbar:
                                'undo redo | blocks | ' +
                                'bold italic forecolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help' +
                                ' | emoticons' +
                                ' insertdatetime | code | preview',
                            content_style:
                                'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                        }}
                    />
                    <button
                        style={{ borderRadius: '10%' }}
                        onClick={updateOrganization}
                    >
                        Editer
                    </button>
                    <Button
                        borderRadius={'30px'}
                        padding={'20px'}
                        icon={'arrow-thin-left'}
                        iconPosition={'left'}
                        onClick={() => navigate('/organization')}
                    >
                        Retour
                    </Button>
                </div>
                <div style={{ flex: '33%' }} className={style.formColumn}>
                    <Card
                        style={{ width: '100%' }}
                        onClick={() => {
                            navigate(
                                `/competition/${organization.lastCompetition.id}`
                            );
                        }}
                        idContent={organization.lastCompetition.id}
                        title={organization.lastCompetition.competitionName}
                        imagePath={
                            organization.lastCompetition.competitionVisual.path
                        }
                        stats={[
                            {
                                name: organization.lastCompetition
                                    .numberOfParticipants,
                                icon: 'user-plus',
                            },
                            {
                                name: organization.lastCompetition
                                    .numberOfPictures,
                                icon: 'camera1',
                            },
                            {
                                name: organization.lastCompetition
                                    .numberOfVotes,
                                icon: 'like',
                            },
                        ]}
                        finalDate={new Date(
                            organization.lastCompetition.resultsDate
                        ).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                        orientation={
                            cardDisposition === 'grid'
                                ? 'vertical'
                                : 'horizontal'
                        }
                    />
                    <h2>Nous contacter</h2>
                    <p style={{ fontWeight: 'bold' }}>Adresse</p>
                    <p> {organization.address}</p>
                    <p>
                        {organization.postcode} {organization.city.nom}
                    </p>
                    <p>Tél : {organization.numberPhone}</p>
                    <p>Email : {organization.email}</p>
                    <div style={{ width: '60%' }} className={style.formRow}>
                        <Icon icon={'linkedin'} />
                        <Icon icon={'facebook'} />
                        <Icon icon={'instagram'} />
                        <Icon icon={'youtube'} />
                        <Icon icon={'twitter'} />
                        <Icon icon={'tiktok'} />
                    </div>
                    <Button
                        type={'button'}
                        borderRadius={'30px'}
                        padding={'15px'}
                        onClick={() => {
                            window.open(organization.websiteUrl, '_blank');
                        }}
                    >
                        Site web
                    </Button>
                </div>
            </div>
        </div>
    );
}
