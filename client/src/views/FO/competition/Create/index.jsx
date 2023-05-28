import Input from '@/components/atoms/Input/index.jsx';
import BOCreate from '@/components/organisms/BO/Form';
import useApiFetch from '@/hooks/useApiFetch.js';
import { useState, useEffect } from 'react';
import useLocation from '@/hooks/useLocation';
import { toast } from 'react-toastify';
import useFilesUpdater from '@/hooks/useFilesUploader.js';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader/index.jsx';
import style from './style.module.scss';
import { useAuthContext } from '@/contexts/AuthContext.jsx';

export default function CreateCompetitions() {
    const [isLoading, setIsLoading] = useState(true);
    const { uploadFile } = useFilesUpdater();
    const { me } = useAuthContext();
    const navigate = useNavigate();
    const apiFetch = useApiFetch();
    const { getCityByName, getDepartmentByName, getRegionByName } =
        useLocation();
    const [organisation, setOrganisation] = useState(
        me.Manage.length > 0
            ? {
                  ...me.Manage[0],
                  postcode: {
                      label: me.Manage[0].postcode,
                      value: me.Manage[0].postcode,
                  },
                  organizationType: {
                      label: me.Manage[0].organization_type.label,
                      value: me.Manage[0].organization_type['@id'],
                  },
              }
            : null
    );
    const [locationPossibility, setLocationPossibility] = useState({
        regions: { isLoading: true, data: [] },
        departments: { isLoading: true, data: [] },
        cities: { isLoading: true, data: [] },
    });

    const updateLocationPossibility = (key, { data, isLoading } = {}) => {
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
    });
    const [entity, setEntity] = useState({
        state: null,
        name: null,
        visual: null,
        description: null,
        rules: null,
        endowments: null,
        participantCategories: null,
        organizer: null,
        themes: null,
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
                    return { label: item.organizer_name, value: item['@id'] };
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
        ]).then(([participantCategories, organizers, themes]) => {
            setEntityPossibility({ participantCategories, organizers, themes });
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
            {me?.roles?.includes('ROLE_ORGANIZER') ? (
                <BOCreate
                    title="Création d'un concours"
                    handleSubmit={function () {
                        const promise = new Promise(async (resolve, reject) => {
                            try {
                                const visualId = await (async () => {
                                    if (entity.visual === null) {
                                        return null;
                                    } else {
                                        const visual = await uploadFile({
                                            file: entity.visual.file,
                                        });
                                        return visual['@id'];
                                    }
                                })();
                                const data = {
                                    state: entity.state,
                                    competitionName: entity.name,
                                    competitionVisual: visualId,
                                    participantCategory:
                                        entity.participantCategories.map(
                                            p => p.value
                                        ),
                                    organization: entity.organizer.value,
                                    theme: entity.themes.map(t => t.value),
                                    description: entity.description,
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
                                    numberOfPrices: parseInt(
                                        entity.numberOfPrices
                                    ),
                                    minAgeCriteria: parseInt(
                                        entity.minAgeCriteria
                                    ),
                                    maxAgeCriteria: parseInt(
                                        entity.maxAgeCriteria
                                    ),
                                    cityCriteria: [entity.cityCriteria.value],
                                    departmentCriteria: [
                                        entity.departmentCriteria.value,
                                    ],
                                    regionCriteria: [
                                        entity.regionCriteria.value,
                                    ],
                                    countryCriteria: ['FRANCE'],
                                    endowments: entity.endowments,
                                };
                                console.debug('data', data);
                                const res = await apiFetch('/competitions', {
                                    method: 'POST',
                                    body: JSON.stringify(data),
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                })
                                    .then(r => r.json())
                                    .then(data => {
                                        console.debug(data);
                                        if (data['@type'] === 'hydra:Error') {
                                            throw new Error(data.description);
                                        }
                                    });
                                resolve(res);
                            } catch (e) {
                                console.error(e);
                                reject(e);
                            }
                        });

                        promise.then(function () {
                            navigate('/BO/organization');
                        });
                        toast.promise(promise, {
                            pending: 'Création du concours',
                            success: 'Concours créé',
                            error: 'Erreur lors de la création du concours',
                        });
                    }}
                >
                    <div className={style.formContainer}>
                        <div className={style.formWrapper}>
                            <div className={style.formColumn}>
                                <Input
                                    type="checkbox"
                                    name="state"
                                    label="Actif"
                                    onChange={d =>
                                        updateEntityState('state', d)
                                    }
                                    defaultValue={entity.state}
                                />

                                <Input
                                    type="text"
                                    name="name"
                                    label="Intitulé du concours"
                                    onChange={d => updateEntityState('name', d)}
                                    defaultValue={entity.name}
                                />

                                <Input
                                    type="file"
                                    name="visual"
                                    label="Visuel"
                                    onChange={d =>
                                        updateEntityState('visual', d)
                                    }
                                    extra={{
                                        value: entity.visual,
                                        type: 'image',
                                    }}
                                />

                                <Input
                                    type="text"
                                    name="description"
                                    label="Description"
                                    onChange={d =>
                                        updateEntityState('description', d)
                                    }
                                    defaultValue={entity.description}
                                />

                                <Input
                                    type="text"
                                    name="rules"
                                    label="Règlement"
                                    onChange={d =>
                                        updateEntityState('rules', d)
                                    }
                                    defaultValue={entity.rules}
                                />

                                <Input
                                    type="text"
                                    name="endowments"
                                    label="Dotation"
                                    onChange={d =>
                                        updateEntityState('endowments', d)
                                    }
                                    defaultValue={entity.endowments}
                                />
                            </div>
                            <div className={style.formColumn}>
                                <Input
                                    type="date"
                                    name="creationDate"
                                    label="Date de création"
                                    onChange={d =>
                                        updateEntityState('creationDate', d)
                                    }
                                    defaultValue={entity.creationDate}
                                />
                                <div className={style.formRow}>
                                    <Input
                                        type="date"
                                        name="publicationDate"
                                        label="Date de publication"
                                        onChange={d =>
                                            updateEntityState(
                                                'publicationDate',
                                                d
                                            )
                                        }
                                        defaultValue={entity.publicationDate}
                                    />

                                    <Input
                                        type="date"
                                        name="submissionStartDate"
                                        label="Date de début de soumission"
                                        onChange={d =>
                                            updateEntityState(
                                                'submissionStartDate',
                                                d
                                            )
                                        }
                                        defaultValue={
                                            entity.submissionStartDate
                                        }
                                    />
                                </div>

                                <Input
                                    type="date"
                                    name="submissionEndDate"
                                    label="Date de fin de soumission"
                                    onChange={d =>
                                        updateEntityState(
                                            'submissionEndDate',
                                            d
                                        )
                                    }
                                    defaultValue={entity.submissionEndDate}
                                />

                                <Input
                                    type="date"
                                    name="votingStartDate"
                                    label="Date de début de vote"
                                    onChange={d =>
                                        updateEntityState('votingStartDate', d)
                                    }
                                    defaultValue={entity.votingStartDate}
                                />
                                <Input
                                    type="date"
                                    name="resultsDate"
                                    label="Date de fin de vote"
                                    onChange={d =>
                                        updateEntityState('resultsDate', d)
                                    }
                                    defaultValue={entity.resultsDate}
                                />
                                <div className={style.formRow}>
                                    <Input
                                        type="number"
                                        name="minAgeCriteria"
                                        label="Âge minimum"
                                        onChange={d =>
                                            updateEntityState(
                                                'minAgeCriteria',
                                                d
                                            )
                                        }
                                        defaultValue={entity.minAgeCriteria}
                                    />

                                    <Input
                                        type="number"
                                        name="maxAgeCriteria"
                                        label="Âge maximum"
                                        onChange={d =>
                                            updateEntityState(
                                                'maxAgeCriteria',
                                                d
                                            )
                                        }
                                        defaultValue={entity.maxAgeCriteria}
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            style={{ paddingTop: '2%' }}
                            className={style.formWrapper}
                        >
                            <div className={style.formRow}>
                                <Input
                                    type="number"
                                    extra={{ step: 0.01 }}
                                    name="weightingOfJuryVotes"
                                    label="Pondération des votes du jury"
                                    defaultValue={entity.weightingOfJuryVotes}
                                    onChange={d =>
                                        updateEntityState(
                                            'weightingOfJuryVotes',
                                            d
                                        )
                                    }
                                />
                                <Input
                                    type="number"
                                    name="numberOfMaxVotes"
                                    label="Nombre maximum de votes"
                                    onChange={d =>
                                        updateEntityState('numberOfMaxVotes', d)
                                    }
                                    defaultValue={entity.numberOfMaxVotes}
                                />
                                <Input
                                    type="number"
                                    name="numberOfPrices"
                                    label="Nombres de prix"
                                    onChange={d =>
                                        updateEntityState('numberOfPrices', d)
                                    }
                                    defaultValue={entity.numberOfPrices}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '30px' }}>
                            <Input
                                type="select"
                                name="region"
                                label="Région"
                                extra={{
                                    isLoading:
                                        locationPossibility.regions.loading,
                                    clearable: true,
                                    required: true,
                                    options: locationPossibility.regions.data,
                                    isMulti: true,
                                    closeMenuOnSelect: false,
                                    menuPlacement: 'top',
                                    onInputChange: (name, { action }) => {
                                        if (action === 'input-change') {
                                            getRegionByName(name).then(
                                                function (p) {
                                                    updateLocationPossibility(
                                                        'regions',
                                                        { data: p }
                                                    );
                                                }
                                            );
                                        }
                                        if (action === 'menu-close') {
                                            updateLocationPossibility(
                                                'regions',
                                                {
                                                    loading: true,
                                                }
                                            );
                                            getRegionByName().then(function (
                                                p
                                            ) {
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
                                    options:
                                        locationPossibility.departments.data,
                                    isMulti: true,
                                    closeMenuOnSelect: false,
                                    menuPlacement: 'top',
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
                                            getDepartmentByName().then(
                                                function (p) {
                                                    updateLocationPossibility(
                                                        'departments',
                                                        {
                                                            data: p,
                                                            loading: false,
                                                        }
                                                    );
                                                }
                                            );
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
                                    isLoading:
                                        locationPossibility.cities.loading,
                                    clearable: true,
                                    required: true,
                                    options: locationPossibility.cities.data,
                                    isMulti: true,
                                    closeMenuOnSelect: false,
                                    menuPlacement: 'top',
                                    onInputChange: (name, { action }) => {
                                        if (action === 'input-change') {
                                            getCityByName(name).then(function (
                                                p
                                            ) {
                                                updateLocationPossibility(
                                                    'cities',
                                                    { data: p }
                                                );
                                            });
                                        }
                                        if (action === 'menu-close') {
                                            updateLocationPossibility(
                                                'cities',
                                                {
                                                    loading: true,
                                                }
                                            );
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
                        <div
                            style={{
                                display: 'flex',
                                gap: '30px',
                                paddingBottom: '2%',
                            }}
                        >
                            <Input
                                type="select"
                                name="participantCategory"
                                label="Catégorie de participant"
                                defaultValue={entity.participantCategories}
                                extra={{
                                    isMulti: true,
                                    required: true,
                                    options:
                                        entityPossibility.participantCategories,
                                    closeMenuOnSelect: false,
                                    menuPlacement: 'top',
                                }}
                                onChange={d =>
                                    updateEntityState(
                                        'participantCategories',
                                        d
                                    )
                                }
                            />
                            <Input
                                type="select"
                                name="organisation"
                                label="selectionner une organisation"
                                extra={{
                                    options: me.Manage.map(function ({
                                        organizer_name,
                                        id,
                                    }) {
                                        return {
                                            value: id,
                                            label: organizer_name,
                                        };
                                    }),
                                    required: true,
                                    value: {
                                        label: organisation.organizer_name,
                                        value: organisation.id,
                                    },
                                }}
                                onChange={d =>
                                    updateEntityState('organizer', d)
                                }
                            />

                            <Input
                                type="select"
                                name="themes"
                                label="Thèmes"
                                defaultValue={entity.themes}
                                extra={{
                                    required: true,
                                    isMulti: true,
                                    options: entityPossibility.themes,
                                    closeMenuOnSelect: false,
                                    menuPlacement: 'top',
                                }}
                                onChange={d => updateEntityState('themes', d)}
                            />
                        </div>
                    </div>
                </BOCreate>
            ) : (
                <div>
                    Veuillez{' '}
                    <Link to="/createorganization">créer une organisation</Link>{' '}
                    avant de créer une compétition
                </div>
            )}
        </Loader>
    );
}
