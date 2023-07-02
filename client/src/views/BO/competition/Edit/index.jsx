import Input from '@/components/atoms/Input/index.jsx';
import Form from '@/components/organisms/BO/Form';
import useApiFetch from '@/hooks/useApiFetch.js';
import { useState, useEffect } from 'react';
import useLocation from '@/hooks/useLocation';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useFilesUpdater from '@/hooks/useFilesUploader.js';
import useApiPath from '@/hooks/useApiPath.js';
import Loader from '@/components/atoms/Loader/index.jsx';
import Button from '@/components/atoms/Button';
import style from './style.module.scss';
import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function CompetitionEdit() {
    const [isLoading, setIsLoading] = useState(true);
    const apiPathComplete = useApiPath();
    const { uploadFile, deleteFile } = useFilesUpdater();
    const navigate = useNavigate();
    const { id: competitionId } = useParams();
    const apiFetch = useApiFetch();
    const {
        getCityByName,
        getCityByCode,
        getDepartmentByName,
        getDepartmentByCode,
        getRegionByName,
        getRegionByCode,
    } = useLocation();
    const editorRef = useRef(null);
    const [locationPossibility, setLocationPossibility] = useState({
        regions: { isLoading: true, data: [] },
        departments: { isLoading: true, data: [] },
        cities: { isLoading: true, data: [] },
    });

    const updateLocationPossibility = (key, { data, isLoading }) => {
        if (isLoading !== undefined) {
            locationPossibility[key].isLoading = isLoading;
        }
        if (data !== undefined) {
            locationPossibility[key].data = data.map(item => ({
                label: item.nom,
                value: item.code,
            }));
        }
        setLocationPossibility({ ...locationPossibility });
    };

    const [entityPossibility, setEntityPossibility] = useState({
        participantCategories: [],
        organizers: [],
        themes: [],
        sponsors: [],
    });
    const [updatedFile, setUpdatedFile] = useState({
        competitionVisual: null,
    });
    const [entity, setEntity] = useState({
        state: false,
        name: null,
        competitionVisual: null,
        description: null,
        rules: null,
        endowments: null,
        participantCategories: [],
        organizer: null,
        themes: [],
        sponsors: [],
        creationDate: null,
        publicationDate: null,
        submissionStartDate: null,
        submissionEndDate: null,
        votingStartDate: null,
        votingEndDate: null,
        resultsDate: null,
        weightingOfJuryVotes: null,
        numberOfMaxVotes: null,
        numberOfPrices: null,
        minAgeCriteria: null,
        maxAgeCriteria: null,
        cityCriteria: [],
        departmentCriteria: [],
        regionCriteria: [],
    });

    const updateEntityState = (key, value) => {
        setEntity({ ...entity, [key]: value });
    };
    const updateFileState = (key, value) => {
        setUpdatedFile({ ...updatedFile, [key]: value });
    };

    const [errors, setErrors] = useState({});

    const getParticipantCategories = controller => {
        return apiFetch('/participant_categories', {
            method: 'GET',
            headers: { 'Content-Type': 'multipart/form-data' },
            signal: controller?.signal,
        })
            .then(r => r.json())
            .then(data => {
                console.debug(data);
                return data['hydra:member'].map(function (item) {
                    return { label: item.label, value: item['@id'] };
                });
            });
    };

    const getOrganizationsName = controller => {
        return apiFetch('/organizations', {
            method: 'GET',
            signal: controller?.signal,
        })
            .then(r => r.json())
            .then(data => {
                console.debug(data);
                return data['hydra:member'].map(function (item) {
                    return { label: item.organizerName, value: item['@id'] };
                });
            });
    };
    const getSponsor = controller => {
        return apiFetch('/sponsors', {
            method: 'GET',
            signal: controller?.signal,
        })
            .then(r => r.json())
            .then(data => {
                console.debug(data);
                return data['hydra:member'].map(function (item) {
                    console.debug(item);
                    return { label: item.sponsorName, value: item['@id'] };
                });
            });
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
                    return { label: item.label, value: item['@id'] };
                });
            });
    };

    const getCompetitions = controller => {
        return apiFetch(`/competitions/${competitionId}`, {
            query: {
                groups: [
                    'competition:participantCategory:read',
                    'participantCategory:read',
                    'competition:organization:read',
                    'organization:read',
                    'competition:theme:read',
                    'theme:read',
                    'competition:competitionVisual:read',
                    'file:read',
                    'competition:sponsor:read',
                    'sponsor:read',
                ],
            },
            method: 'GET',
            signal: controller?.signal,
        })
            .then(r => r.json())
            .then(async data => {
                return await Promise.all([
                    Promise.all(
                        data.cityCriteria.map(c => c && getCityByCode(c))
                    ),
                    Promise.all(
                        data.departmentCriteria.map(
                            d => d && getDepartmentByCode(d)
                        )
                    ),
                    Promise.all(
                        data.regionCriteria.map(r => r && getRegionByCode(r))
                    ),
                ]).then(([cities, departments, regions]) => {
                    const _competition = {
                        state: data.state,
                        name: data.competitionName,
                        competitionVisual: data.competitionVisual || null,
                        description: data.description,
                        rules: data.rules,
                        endowments: data.endowments ? data.endowments : null,
                        participantCategories: data.participantCategory.map(
                            pc => ({ label: pc.label, value: pc['@id'] })
                        ),
                        organizer: {
                            label: data.organization.organizerName,
                            value: data.organization['@id'],
                        },
                        themes: data.theme.map(t => ({
                            label: t.label,
                            value: t['@id'],
                        })),
                        sponsors: data.sponsors.map(s => ({
                            label: s.sponsorName,
                            value: s['@id'],
                        })),
                        creationDate: new Date(data.creationDate),
                        publicationDate: new Date(data.publicationDate),
                        submissionStartDate: new Date(data.submissionStartDate),
                        submissionEndDate: new Date(data.submissionEndDate),
                        votingStartDate: new Date(data.votingStartDate),
                        votingEndDate: new Date(data.votingEndDate),
                        resultsDate: new Date(data.resultsDate),
                        weightingOfJuryVotes: data.weightingOfJuryVotes,
                        numberOfMaxVotes: data.numberOfMaxVotes,
                        numberOfPrices: data.numberOfPrices,
                        minAgeCriteria: data.minAgeCriteria,
                        maxAgeCriteria: data.maxAgeCriteria,
                        cityCriteria: cities
                            .map(c => c && { label: c.nom, value: c.code })
                            .filter(c => c),
                        departmentCriteria: departments
                            .map(d => d && { label: d.nom, value: d.code })
                            .filter(d => d),
                        regionCriteria: regions
                            .map(r => r && { label: r.nom, value: r.code })
                            .filter(r => r),
                    };
                    const _updatedFile = {
                        competitionVisual: data.competitionVisual
                            ? {
                                  to: apiPathComplete(
                                      data.competitionVisual.path
                                  ),
                                  name: data.competitionVisual.defaultName,
                              }
                            : null,
                    };
                    console.debug(_competition);
                    setUpdatedFile(_updatedFile);
                    setEntity(_competition);
                });
            });
    };

    useEffect(() => {
        const controller = new AbortController();
        Promise.all([
            getRegionByName(null, { controller }),
            getDepartmentByName(null, { controller }),
            getCityByName(null, { controller }),
        ]).then(([regions, departments, cities]) => {
            return setLocationPossibility({
                regions: {
                    isLoading: false,
                    data: regions.map(d => ({ label: d.nom, value: d.code })),
                },
                departments: {
                    isLoading: false,
                    data: departments.map(d => ({
                        label: d.nom,
                        value: d.code,
                    })),
                },
                cities: {
                    isLoading: false,
                    data: cities.map(d => ({ label: d.nom, value: d.code })),
                },
            });
        });
        const promise = Promise.all([
            getParticipantCategories(controller),
            getOrganizationsName(controller),
            getThemes(controller),
            getSponsor(controller),
            getCompetitions(controller),
        ]).then(([participantCategories, organizers, themes, sponsors]) => {
            setEntityPossibility({
                participantCategories,
                organizers,
                themes,
                sponsors,
            });
        });
        promise.then(function () {
            setIsLoading(false);
        });
        if (import.meta.env.MODE === 'development') {
            toast.promise(promise, {
                pending: 'Chargement des données',
                success: 'Données chargées',
                error: 'Erreur lors du chargement des données',
            });
        }
        return () => setTimeout(() => controller.abort());
    }, []);

    return (
        <Loader active={isLoading}>
            <Form
                title="Création d'un concours"
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
                                    }).then(r => r['@id']);
                                }
                            })().catch(e => {
                                reject(e);
                                throw e;
                            });
                            const data = {
                                state: entity.state,
                                competitionName: entity.name,
                                competitionVisual: newVisualId,
                                participantCategory:
                                    entity.participantCategories.map(
                                        p => p.value
                                    ),
                                organization: entity.organizer.value,
                                theme: entity.themes.map(t => t.value),
                                sponsors: entity.sponsors.map(s => s.value),
                                description: editorRef.current.getContent(),
                                rules: entity.rules,
                                creationDate: new Date(
                                    entity.creationDate
                                ).toISOString(),
                                publicationDate: new Date(
                                    entity.publicationDate
                                ).toISOString(),
                                submissionStartDate: new Date(
                                    entity.submissionStartDate
                                ).toISOString(),
                                submissionEndDate: new Date(
                                    entity.submissionEndDate
                                ).toISOString(),
                                votingStartDate: new Date(
                                    entity.votingStartDate
                                ).toISOString(),
                                votingEndDate: new Date(
                                    entity.votingEndDate
                                ).toISOString(),
                                resultsDate: new Date(
                                    entity.resultsDate
                                ).toISOString(),
                                weightingOfJuryVotes: parseFloat(
                                    entity.weightingOfJuryVotes
                                ),
                                numberOfMaxVotes: parseInt(
                                    entity.numberOfMaxVotes
                                ),
                                numberOfPrices: parseInt(entity.numberOfPrices),
                                minAgeCriteria: parseInt(entity.minAgeCriteria),
                                maxAgeCriteria: parseInt(entity.maxAgeCriteria),
                                cityCriteria: entity.cityCriteria.map(
                                    c => c.value
                                ),
                                departmentCriteria:
                                    entity.departmentCriteria.map(d => d.value),
                                regionCriteria: entity.regionCriteria.map(
                                    r => r.value
                                ),
                                countryCriteria: ['FRANCE'],
                                endowments: entity.endowments,
                            };
                            const res = await apiFetch(
                                `/competitions/${competitionId}`,
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
                                    if (
                                        updatedFile.competitionVisual ===
                                            null &&
                                        entity.competitionVisual
                                    ) {
                                        await deleteFile({
                                            path: entity.competitionVisual[
                                                '@id'
                                            ],
                                        });
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
                    promise.then(() => {
                        navigate('/BO/competition');
                    });
                    toast.promise(promise, {
                        pending: 'Modification du concours',
                        success: 'Concours modifié',
                        error: 'Erreur lors de la modification du concours',
                    });
                }}
            >
                <div className={style.all}>
                    <Input
                        type="checkbox"
                        name="state"
                        label="Actif"
                        onChange={d => updateEntityState('state', d)}
                        defaultValue={entity.state}
                        extra={{ require: true }}
                    />

                    <Input
                        type="text"
                        name="name"
                        label="Intitulé du concours"
                        onChange={d => updateEntityState('name', d)}
                        defaultValue={entity.name}
                        extra={{ require: true }}
                    />

                    <Input
                        type="file"
                        name="visual"
                        label="Visuel"
                        onChange={d => {
                            updateFileState('competitionVisual', d);
                        }}
                        extra={{
                            value: updatedFile.competitionVisual,
                            type: 'image',
                        }}
                    />
                    <label>Description</label>
                    <Editor
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        initialValue={entity.description}
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
                    <Input
                        type="text"
                        name="rules"
                        label="Règlement"
                        onChange={d => updateEntityState('rules', d)}
                        defaultValue={entity.rules}
                        extra={{ require: true }}
                    />
                    <Input
                        type="text"
                        name="endowments"
                        label="Dotation"
                        onChange={d => updateEntityState('endowments', d)}
                        defaultValue={entity.endowments}
                        extra={{ require: true }}
                    />

                    <Input
                        type="date"
                        name="creationDate"
                        label="Date de création"
                        onChange={d => updateEntityState('creationDate', d)}
                        defaultValue={entity.creationDate}
                    />

                    <Input
                        type="date"
                        name="publicationDate"
                        label="Date de publication"
                        onChange={d => updateEntityState('publicationDate', d)}
                        defaultValue={entity.publicationDate}
                    />

                    <Input
                        type="date"
                        name="submissionStartDate"
                        label="Date de début de soumission"
                        onChange={d =>
                            updateEntityState('submissionStartDate', d)
                        }
                        defaultValue={entity.submissionStartDate}
                    />

                    <Input
                        type="date"
                        name="submissionEndDate"
                        label="Date de fin de soumission"
                        onChange={d =>
                            updateEntityState('submissionEndDate', d)
                        }
                        defaultValue={entity.submissionEndDate}
                    />

                    <Input
                        type="date"
                        name="votingStartDate"
                        label="Date de début de vote"
                        onChange={d => updateEntityState('votingStartDate', d)}
                        defaultValue={entity.votingStartDate}
                    />

                    <Input
                        type="date"
                        name="resultsDate"
                        label="Date de fin de vote"
                        onChange={d => updateEntityState('resultsDate', d)}
                        defaultValue={entity.resultsDate}
                    />

                    <Input
                        type="number"
                        extra={{ step: 0.01 }}
                        name="weightingOfJuryVotes"
                        label="Pondération des votes du jury"
                        defaultValue={entity.weightingOfJuryVotes}
                        onChange={d =>
                            updateEntityState('weightingOfJuryVotes', d)
                        }
                    />

                    <Input
                        type="number"
                        name="numberOfMaxVotes"
                        label="Nombre maximum de votes"
                        onChange={d => updateEntityState('numberOfMaxVotes', d)}
                        defaultValue={entity.numberOfMaxVotes}
                    />

                    <Input
                        type="number"
                        name="numberOfPrices"
                        label="Nombres de prix"
                        onChange={d => updateEntityState('numberOfPrices', d)}
                        defaultValue={entity.numberOfPrices}
                    />

                    <Input
                        type="number"
                        name="minAgeCriteria"
                        label="Âge minimum"
                        onChange={d => updateEntityState('minAgeCriteria', d)}
                        defaultValue={entity.minAgeCriteria}
                    />

                    <Input
                        type="number"
                        name="maxAgeCriteria"
                        label="Âge maximum"
                        onChange={d => updateEntityState('maxAgeCriteria', d)}
                        defaultValue={entity.maxAgeCriteria}
                    />

                    <div style={{ display: 'flex', gap: '30px' }}>
                        <Input
                            type="select"
                            name="region"
                            label="Région"
                            extra={{
                                isLoading: locationPossibility.regions.loading,
                                clearable: true,
                                required: true,
                                options: locationPossibility.regions.data,
                                isMulti: true,
                                closeMenuOnSelect: false,
                                menuPlacement: 'top',
                                value: entity.regionCriteria,
                                onInputChange: (name, { action }) => {
                                    if (action === 'input-change') {
                                        getRegionByName(name).then(function (
                                            p
                                        ) {
                                            updateLocationPossibility(
                                                'regions',
                                                { data: p }
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
                                                { data: p, loading: false }
                                            );
                                        });
                                    }
                                },
                            }}
                            onChange={d => {
                                updateEntityState('regionCriteria', d);
                            }}
                        />

                        <Input
                            type="select"
                            name="department"
                            label="Département"
                            extra={{
                                isLoading:
                                    locationPossibility.departments.loading,
                                clearable: true,
                                required: true,
                                options: locationPossibility.departments.data,
                                isMulti: true,
                                closeMenuOnSelect: false,
                                menuPlacement: 'top',
                                value: entity.departmentCriteria,
                                onInputChange: (name, { action }) => {
                                    if (action === 'input-change') {
                                        getDepartmentByName(name).then(
                                            function (p) {
                                                updateLocationPossibility(
                                                    'departments',
                                                    { data: p }
                                                );
                                            }
                                        );
                                    }
                                    if (action === 'menu-close') {
                                        updateLocationPossibility(
                                            'departments',
                                            { loading: true }
                                        );
                                        getDepartmentByName().then(function (
                                            p
                                        ) {
                                            updateLocationPossibility(
                                                'departments',
                                                { data: p, loading: false }
                                            );
                                        });
                                    }
                                },
                            }}
                            onChange={d => {
                                updateEntityState('departmentCriteria', d);
                            }}
                        />

                        <Input
                            type="select"
                            name="city"
                            label="Ville"
                            extra={{
                                isLoading: locationPossibility.cities.loading,
                                clearable: true,
                                required: true,
                                options: locationPossibility.cities.data,
                                isMulti: true,
                                closeMenuOnSelect: false,
                                menuPlacement: 'top',
                                value: entity.cityCriteria,
                                onInputChange: (name, { action }) => {
                                    if (action === 'input-change') {
                                        getCityByName(name).then(function (p) {
                                            updateLocationPossibility(
                                                'cities',
                                                { data: p }
                                            );
                                        });
                                    }
                                    if (action === 'menu-close') {
                                        updateLocationPossibility('cities', {
                                            loading: true,
                                        });
                                        getCityByName().then(function (p) {
                                            updateLocationPossibility(
                                                'cities',
                                                { data: p, loading: false }
                                            );
                                        });
                                    }
                                },
                            }}
                            onChange={d => {
                                updateEntityState('cityCriteria', d);
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '30px' }}>
                        <Input
                            type="select"
                            name="participantCategory"
                            label="Catégorie de participant"
                            extra={{
                                isMulti: true,
                                required: true,
                                options:
                                    entityPossibility.participantCategories,
                                closeMenuOnSelect: false,
                                menuPlacement: 'top',
                                value: entity.participantCategories,
                            }}
                            onChange={d =>
                                updateEntityState('participantCategories', d)
                            }
                        />

                        <Input
                            type="select"
                            name="organizer"
                            label="Nom de l'organisation"
                            extra={{
                                required: true,
                                options: entityPossibility.organizers,
                                menuPlacement: 'top',
                                value: entity.organizer,
                            }}
                            onChange={d => updateEntityState('organizer', d)}
                        />

                        <Input
                            type="select"
                            name="themes"
                            label="Thèmes"
                            extra={{
                                required: true,
                                isMulti: true,
                                options: entityPossibility.themes,
                                closeMenuOnSelect: false,
                                menuPlacement: 'top',
                                value: entity.themes,
                            }}
                            onChange={d => updateEntityState('themes', d)}
                        />
                    </div>
                    <Input
                        type="select"
                        name="sponsors"
                        label="Sponsors"
                        extra={{
                            isMulti: true,
                            options: entityPossibility.sponsors,
                            closeMenuOnSelect: false,
                            menuPlacement: 'top',
                            value: entity.sponsors,
                        }}
                        onChange={d => updateEntityState('sponsors', d)}
                    />
                </div>
            </Form>
            <Button onClick={() => navigate('/BO/competition')}>Retour</Button>
        </Loader>
    );
}
