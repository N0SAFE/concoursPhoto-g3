import {useState, useEffect, useRef} from "react";
import {toast} from "react-toastify";
import style from './style.module.scss'
import Form from "@/components/organisms/BO/Form/index.jsx";
import Input from "@/components/atoms/Input/index.jsx";
import {Editor} from "@tinymce/tinymce-react";
import Button from "@/components/atoms/Button/index.jsx";
import useApiFetch from "@/hooks/useApiFetch.js";
import useLocation from "@/hooks/useLocation.js";

export default function CompetitionEdit({competition: _competition}) {
    const apiFetch = useApiFetch()
    const [competition, setCompetition] = useState(_competition)
    const [locationPossibility, setLocationPossibility] = useState({
        regions: {isLoading: true, data: []},
        departments: {isLoading: true, data: []},
        cities: {isLoading: true, data: []},
    });
    const [isLoading, setIsLoading] = useState(true);
    const editorRef = useRef(null);

    const {
        getDepartmentByName,
        getRegionByName,
    } = useLocation();

    const updateCompetition = (key, value) => {
        setCompetition({ ...competition, [key]: value });
    };

    const [possibilities, setPossibilities] = useState({
        theme: [],
        participantCategory: [],
    });

    const updateLocationPossibility = (key, {data, isLoading}) => {
        if (isLoading !== undefined) {
            locationPossibility[key].isLoading = isLoading;
        }
        if (data !== undefined) {
            locationPossibility[key].data = data.map(item => ({
                label: item.nom,
                value: item.code,
            }));
        }
        setLocationPossibility({...locationPossibility});
    };

    const getThemes = controller => {
        return apiFetch('/themes', {
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

    const getParticipantCategories = controller => {
        return apiFetch('/participant_categories', {
            method: 'GET',
            headers: {'Content-Type': 'multipart/form-data'},
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

    useEffect(() => {
        const controller = new AbortController();
        const promise = Promise.all([
            getThemes(controller),
            getParticipantCategories(controller)
        ]).then(([theme, participantCategory]) => {
            setPossibilities({participantCategory, theme});
        });
        promise.then(function () {
            setIsLoading(false);
        });
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
            <h2>Concours {">"} onglet “présentation” : édition</h2>
            <Form
                hasSubmit={true}
                handleSubmit={function () {
                    const promise = new Promise(async (resolve, reject) => {
                        try {
                            const data = {
                                competitionName: competition.competitionName,
                                participantCategory:
                                    competition.participantCategory.map(
                                        p => p.value
                                    ),
                                theme: competition.theme.map(t => t.value),
                                description: editorRef.current.getContent(),
                                activateDate: new Date(
                                    competition.activationDate
                                ).toISOString(),
                                publicationDate: new Date(
                                    competition.publicationDate
                                ).toISOString(),
                                submissionStartDate: new Date(
                                    competition.submissionStartDate
                                ).toISOString(),
                                submissionEndDate: new Date(
                                    competition.submissionEndDate
                                ).toISOString(),
                                votingStartDate: new Date(
                                    competition.votingStartDate
                                ).toISOString(),
                                votingEndDate: new Date(
                                    competition.votingEndDate
                                ).toISOString(),
                                resultsDate: new Date(
                                    competition.resultsDate
                                ).toISOString(),
                                numberOfPrices: parseInt(competition.numberOfPrices),
                                minAgeCriteria: parseInt(competition.minAgeCriteria),
                                maxAgeCriteria: parseInt(competition.maxAgeCriteria),
                                cityCriteria: competition.cityCriteria.map(
                                    c => c.value
                                ),
                                departmentCriteria:
                                    competition.departmentCriteria.map(d => d.value),
                                regionCriteria: competition.regionCriteria.map(
                                    r => r.value
                                ),
                                countryCriteria: ['FRANCE'],
                                endowments: competition.endowments,
                                isPublished: competition.isPublished,
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
                        pending: 'Modification du concours',
                        success: 'Concours modifié',
                        error: 'Erreur lors de la modification du concours',
                    });
                }}
            >
                <div className={style.competitionModalContentContainer}>
                    <div className={style.competitionModalContentColumn}>
                        <Input
                            type="text"
                            label={"Nom du concours*"}
                            defaultValue={competition.competitionName}
                            onChange={d => updateCompetition('competitionName', d)}
                        />
                        <div className={style.competitionModalContentWrapper}>
                            <Input type="select" label={"Thème du concours*"} extra={{
                                required: true,
                                isMulti: true,
                                options: possibilities.theme,
                                closeMenuOnSelect: false,
                                menuPlacement: 'top',
                                value: competition.theme,
                            }}
                                   onChange={d => updateCompetition('theme', d)}
                            />
                            <Input type="select" label={"Catégorie*"} extra={{
                                isMulti: true,
                                required: true,
                                options:
                                possibilities.participantCategory,
                                closeMenuOnSelect: false,
                                menuPlacement: 'top',
                                value: competition.participantCategory,
                            }}
                                   onChange={d => updateCompetition('participantCategory', d)}
                            />
                            <Input
                                type="text"
                                label={"Dotation*"}
                                defaultValue={competition.endowments}
                                onChange={d => updateCompetition('endowments', d)}
                            />
                        </div>
                        <div className={style.competitionModalContentWrapper}>
                            <Input type="number" label={"Âge minimum requis pour participer*"}
                                   defaultValue={competition.minAgeCriteria}/>
                            <Input
                                type="number"
                                label={"Âge maximum requis pour participer*"}
                                defaultValue={competition.maxAgeCriteria}
                                onChange={d => updateCompetition('maxAgeCriteria', d)}
                            />
                            <Input
                                type="text"
                                label={"Nombre de prix*"}
                                defaultValue={competition.numberOfPrices}
                                onChange={d => updateCompetition('numberOfPrices', d)}
                            />
                        </div>
                        <div className={style.competitionModalContentWrapper}>
                            <Input
                                type="text"
                                label={"Pays"}
                                defaultValue={competition.countryCriteria}
                                onChange={d => updateCompetition('countryCriteria', d)}
                            />
                            <Input
                                type="select"
                                label={"Région"}
                                extra={{
                                    isLoading: locationPossibility.regions.loading,
                                    clearable: true,
                                    required: true,
                                    options: locationPossibility.regions.data,
                                    isMulti: true,
                                    closeMenuOnSelect: false,
                                    menuPlacement: 'top',
                                    value: competition.regionCriteria,
                                    onInputChange: (name, {action}) => {
                                        if (action === 'input-change') {
                                            getRegionByName(name).then(function (
                                                p
                                            ) {
                                                updateLocationPossibility(
                                                    'regions',
                                                    {data: p}
                                                );
                                            });
                                        }
                                        if (action === 'menu-close') {
                                            updateLocationPossibility('regions', {
                                                loading: true,
                                            });
                                            getRegionByName().then(function (p) {
                                                updateLocationPossibility(
                                                    'regions',
                                                    {data: p, loading: false}
                                                );
                                            });
                                        }
                                    },
                                }}
                                onChange={d => {
                                    updateCompetition('regionCriteria', d);
                                }}
                            />
                            <Input type="select" label={"Départements"} extra={{
                                isLoading: locationPossibility.departments.loading,
                                clearable: true,
                                required: true,
                                options: locationPossibility.departments.data,
                                isMulti: true,
                                closeMenuOnSelect: false,
                                menuPlacement: 'top',
                                value: competition.departmentCriteria,
                                onInputChange: (name, {action}) => {
                                    if (action === 'input-change') {
                                        getDepartmentByName(name).then(
                                            function (p) {
                                                updateLocationPossibility(
                                                    'departments',
                                                    {data: p}
                                                );
                                            }
                                        );
                                    }
                                    if (action === 'menu-close') {
                                        updateLocationPossibility(
                                            'departments',
                                            {loading: true}
                                        );
                                        getDepartmentByName().then(function (
                                            p
                                        ) {
                                            updateLocationPossibility(
                                                'departments',
                                                {data: p, loading: false}
                                            );
                                        });
                                    }
                                },
                            }}
                                   onChange={d => {
                                       updateCompetition('departmentCriteria', d);
                                   }}/>
                        </div>
                        <div>
                            <label>Description</label>
                            <Editor
                                onInit={(evt, editor) => (editorRef.current = editor)}
                                initialValue={competition.description}
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
                    </div>
                    <div className={style.competitionModalContentColumn}>
                        <Input
                            type="radioList"
                            onChange={d => updateCompetition('isPublished', d.value)}
                            extra={{
                                value: competition.isPublished,
                                options: [{label: "Publié", value: true}, {label: "Caché", value: false}]
                            }}
                        />
                        <Input
                            type="date"
                            label={"Date d’activation"}
                            defaultValue={new Date(competition.activationDate)}
                            onChange={d => updateCompetition('activationDate', d)}
                        />
                        <Input
                            type="date"
                            label={"Date de publication"}
                            defaultValue={new Date(competition.publicationDate)}
                            onChange={d => updateCompetition('publicationDate', d)}
                        />
                        <Input
                            type="date"
                            label={"Date de début des soumissions"}
                            defaultValue={new Date(competition.submissionStartDate)}
                            onChange={d => updateCompetition('submissionStartDate', d)}
                        />
                        <Input
                            type="date"
                            label={"Date de fin des soumissions"}
                            defaultValue={new Date(competition.submissionEndDate)}
                            onChange={d => updateCompetition('submissionEndDate', d)}
                        />
                        <Input
                            type="date"
                            label={"Date de début des votes"}
                            defaultValue={new Date(competition.votingStartDate)}
                            onChange={d => updateCompetition('votingStartDate', d)}
                        />
                        <Input
                            type="date"
                            label={"Date de fin des votes"}
                            defaultValue={new Date(competition.votingEndDate)}
                            onChange={d => updateCompetition('votingEndDate', d)}
                        />
                        <Input
                            type="date"
                            label={"Date de publication des résultats"}
                            defaultValue={new Date(competition.resultsDate)}
                            onChange={d => updateCompetition('resultsDate', d)}
                        />
                    </div>
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