import {useState, useEffect} from "react";
import {toast} from "react-toastify";
import style from './style.module.scss'
import Form from "@/components/organisms/BO/Form/index.jsx";
import Button from "@/components/atoms/Button/index.jsx";
import useApiFetch from "@/hooks/useApiFetch.js";
import Input from "@/components/atoms/Input/index.jsx";
import useApiPath from "@/hooks/useApiPath.js";
import useFilesUpdater from "@/hooks/useFilesUploader.js";

export default function CompetitionVisualEdit({competition: _competition}) {
    const apiFetch = useApiFetch()
    const [competition, setCompetition] = useState(_competition)
    const apiPathComplete = useApiPath();
    const [updatedFile, setUpdatedFile] = useState({
        competitionVisual: competition.competitionVisual
            ? {
                to: apiPathComplete(competition.competitionVisual.path),
                name: competition.competitionVisual.defaultName,
            }
            : null,
    });
    const { uploadFile, deleteFile } = useFilesUpdater();

    const updateFileState = (key, value) => {
        setUpdatedFile({ ...updatedFile, [key]: value });
    };

    useEffect(() => {
        const controller = new AbortController();
        const promise = Promise.all([

        ]);
        if (import.meta.env.MODE === 'development') {
            toast.promise(promise, {
                pending: 'Chargement du visuel',
                success: 'Visuel du concours chargé',
                error: 'Erreur lors du chargement du concours',
            });
        }

        return () => setTimeout(() => controller.abort());
    }, []);

    return (
        <div className={style.competitionModalContent}>
            <h2>Concours {">"} visuel principal : édition</h2>
            <div>
                <b>Visuel principal de présentation du concours</b>
                <p>Formats supportés : JPG, PNG, GIF | Taille : 420x250 pixels minimum | Poids : 1 Mo max</p>
            </div>
            <Form
                hasSubmit={true}
                handleSubmit={function () {
                    const promise = new Promise(async (resolve, reject) => {
                        try {
                            const newVisualId = await (async () => {
                                if (updatedFile.competitionVisual === null) {
                                    return null;
                                } else if (updatedFile.competitionVisual.file) {
                                    return await uploadFile({
                                        file: updatedFile.competitionVisual
                                            .file,
                                        path: '/files/competitions',
                                    }).then(r => r['@id']);
                                }
                            })().catch(e => {
                                reject(e);
                                throw e;
                            });
                            const data = {
                                competitionVisual: newVisualId || null,
                            };
                            const _updatedFile = {
                                visual: data.competitionVisual
                                    ? {
                                        to: apiPathComplete(
                                            data.competitionVisual.path
                                        ),
                                        name: data.competitionVisual.defaultName,
                                    }
                                    : null,
                            };
                            setUpdatedFile(_updatedFile);
                            const res = await apiFetch(
                                `/competitions/${competition.id}`,
                                {
                                    method: 'PATCH',
                                    body: JSON.stringify(data),
                                    headers: {
                                        'Content-Type':
                                            'application/merge-patch+json',
                                    },
                                }
                            )
                                .then(r => r.json())
                                .then(async data => {
                                    console.debug(data);
                                    if (data['@type'] === 'hydra:Error') {
                                        throw new Error(data.description);
                                    }
                                })
                                .catch(e => {
                                    reject(e);
                                    throw e;
                                });
                            resolve(res);
                        } catch (e) {
                            console.error(e);
                            reject(e);
                        }
                    });
                    toast.promise(promise, {
                        pending: 'Modification du visuel',
                        success: 'Visuel modifié',
                        error: 'Erreur lors de la modification du visuel',
                    });
                }}
            >
                <div>
                    <Input
                        type="competition_visual"
                        name="visual"
                        onChange={d => {
                            updateFileState('competitionVisual', d);
                        }}
                        extra={{
                            value: updatedFile.competitionVisual,
                            type: 'image',
                        }}
                    />
                </div>
                <div className={style.registerSubmit}>
                    <Button
                        type="submit"
                        color={'black'}
                        textColor={'white'}
                        padding={'14px 30px'}
                        border={false}
                        borderRadius={'44px'}
                        width={'245px'}
                    >
                        Sauvegarder
                    </Button>
                </div>
            </Form>
        </div>
    )
}