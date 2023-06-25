import {useState, useEffect} from "react";
import {toast} from "react-toastify";
import style from './style.module.scss'
import Form from "@/components/organisms/BO/Form/index.jsx";
import Button from "@/components/atoms/Button/index.jsx";
import useApiFetch from "@/hooks/useApiFetch.js";
import Input from "@/components/atoms/Input/index.jsx";
import useApiPath from "@/hooks/useApiPath.js";
import useFilesUpdater from "@/hooks/useFilesUploader.js";

export default function SponsorsEdit({competition: _competition}) {
    const apiFetch = useApiFetch()
    const [competition, setCompetition] = useState(_competition)
    const apiPathComplete = useApiPath();

    const [possibilities, setPossibilities] = useState({
        sponsors: [],
    });

    const getSponsors = controller => {
        return apiFetch('/sponsors', {
            method: 'GET',
            signal: controller?.signal,
        })
            .then(r => r.json())
            .then(data => {
                console.debug(data);
                return data['hydra:member'].map(function (item) {
                    return {label: item.label, value: item['@id']};
                });
            });
    };

    console.log(new Map(
        competition.sponsors.map(l => {
            return [
                l?.logo?.['@id'],
                {
                    path: l.logo?.['path'],
                    defaultName: l.logo?.['defaultName'],
                },
            ];
        }
    )))

    const [updatedFile, setUpdatedFile] = useState({
        sponsors:
            competition.sponsors.map(l => {
                return [
                    l?.logo?.['@id'],
                    {
                        path: l.logo?.['path'],
                        defaultName: l.logo?.['defaultName'],
                    },
                ];
            })
    });
    const { uploadFile, deleteFile } = useFilesUpdater();

    const updateFileState = (key, value) => {
        setUpdatedFile({ ...updatedFile, [key]: value });
    };

    useEffect(() => {
        getSponsors().then(data => {
            setPossibilities({ sponsors: data });
        });
        const controller = new AbortController();
        const promise = Promise.all([])
        if (import.meta.env.MODE === 'development') {
            toast.promise(promise, {
                pending: 'Chargement du concours',
                success: 'Concours chargé',
                error: 'Erreur lors du chargement du concours',
            });
        }

        return () => setTimeout(() => controller.abort());
    }, []);

    const updateCompetition = (key, value) => {
        setCompetition({ ...competition, [key]: value });
    };

    console.log(competition.sponsors)

    return (
        <div className={style.competitionModalContent}>
            <h2>Concours {">"} sponsors : édition</h2>
            <div>
                <b>Vous pouvez télécharger plusieurs visuels de sponsors, voici les formats, poids et tailles à respecter :</b>
                <p>Formats supportés : JPG, PNG, GIF | Taille : 840x525 pixels minimum | Poids : 2 Mo max</p>
                <p>Pour modifier l’ordre d’affichage, utilisez les flèches ou le glisser-déposer :</p>
            </div>
            <Form
                hasSubmit={true}
                handleSubmit={function () {
                    const promise = new Promise(async (resolve, reject) => {
                        try {
                            const newVisualId = await (async () => {
                                Array.from(competition.sponsors).map(sponsor => {
                                    if (sponsor === null) {
                                        return null;
                                    } else if (sponsor.file) {
                                        return uploadFile({
                                            file: sponsor.file,
                                        }).then(r => r['@id']);
                                    }
                                    return sponsor['@id'];
                                });
                            })().catch(e => {
                                reject(e);
                                throw e;
                            });
                            const data = {
                                sponsors: newVisualId || null,
                            };
                            const _updatedFile = {
                                sponsors: competition.sponsors.map(([key, value]) => {
                                        return [
                                            key,
                                            {
                                                path: value.path,
                                                defaultName: value.defaultName,
                                            },
                                        ];
                                    })
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
                <div className={style.sponsorList}>
                    {competition.sponsors.map((sponsor, index) => {
                        console.log(sponsor.organization.logo.path);

                        console.log(updatedFile.sponsors)
                        return (
                            <div className={style.sponsorListItems} key={index}>
                                <Input
                                    type="imageContent"
                                    onChange={d => {
                                        const map = competition.sponsors;
                                        map.set(sponsor['@id'], {
                                            sponsors: sponsor['@id'],
                                            path: d.path,
                                            defaultName: d.defaultName,
                                        });
                                        updateFileState('sponsors', map);
                                    }}
                                    extra={{
                                        value: updatedFile.sponsors,
                                        type: 'image',
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
                <div style={{color: "red"}}><p>not implemented yet</p></div>

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