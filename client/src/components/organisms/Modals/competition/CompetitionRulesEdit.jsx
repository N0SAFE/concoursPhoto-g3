import {useState, useEffect, useRef} from "react";
import {toast} from "react-toastify";
import style from './style.module.scss'
import Form from "@/components/organisms/BO/Form/index.jsx";
import {Editor} from "@tinymce/tinymce-react";
import Button from "@/components/atoms/Button/index.jsx";
import useApiFetch from "@/hooks/useApiFetch.js";

export default function CompetitionRulesEdit({competition: _competition}) {
    const apiFetch = useApiFetch()
    const [competition, setCompetition] = useState(_competition)
    const editorRef = useRef(null);

    useEffect(() => {
        const controller = new AbortController();
        const promise = Promise.all([]);
        if (import.meta.env.MODE === 'development') {
            toast.promise(promise, {
                pending: 'Chargement du concours',
                success: 'Concours chargé',
                error: 'Erreur lors du chargement du concours',
            });
        }

        return () => setTimeout(() => controller.abort());
    }, []);

    return (
        <div className={style.competitionModalContent}>
            <h2>Concours {">"} onglet “Règlement” : édition</h2>
            <Form
                hasSubmit={true}
                handleSubmit={function () {
                    const promise = new Promise(async (resolve, reject) => {
                        try {
                            const data = {
                                rules: editorRef.current.getContent(),
                            };
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
                        pending: 'Modification du règlement',
                        success: 'Règlement du concours modifié',
                        error: 'Erreur lors de la modification du règlement',
                    });
                }}
            >
                <div>
                    <label>Règlement du concours*</label>
                    <Editor
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        initialValue={competition.rules}
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
                                'media',
                                'table',
                                'code',
                                'help',
                                'wordcount',
                            ],
                            toolbar:
                                'undo redo | blocks | ' +
                                'bold italic forecolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                            content_style:
                                'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
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