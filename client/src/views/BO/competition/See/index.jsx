import React from 'react';
import BOSee from '@/components/organisms/BO/See';
import { useNavigate, useNavigation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useApiFetch from '@/hooks/useApiFetch';
import useLocation from '@/hooks/useLocation.js';
import { toast } from 'react-toastify';
import useApiPath from '@/hooks/useApiPath.js';
import Button from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader/index.jsx';

export default function () {
    const [isLoading, setIsLoading] = useState(true);
    const toApiPath = useApiPath();
    const apiFetch = useApiFetch();
    const navigate = useNavigate();
    const { getCityByCode, getDepartmentByCode, getRegionByCode } =
        useLocation();
    const [entity, setEntity] = useState({});
    const { id: competitionId } = useParams();

    const getCompetitions = controller => {
        return apiFetch('/competitions/' + competitionId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller?.signal,
        })
            .then(res => res.json())
            .then(data => {
                console.debug(data);
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                Promise.all([
                    Promise.all(data.city_criteria.map(getCityByCode)),
                    Promise.all(
                        data.department_criteria.map(getDepartmentByCode)
                    ),
                    Promise.all(data.region_criteria.map(getRegionByCode)),
                ]).then(([cities, departments, regions]) => {
                    const _competition = {
                        ...data,
                        city_criteria: cities,
                        department_criteria: departments,
                        region_criteria: regions,
                    };
                    setEntity(_competition);
                    return _competition;
                });
            })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        const controller = new AbortController();
        const promise = getCompetitions(controller);
        promise.then(function () {
            setIsLoading(false);
        });
        if (import.meta.env.MODE === 'development') {
            toast.promise(promise, {
                pending: 'Chargement du concours',
                success: 'Concours chargé',
                error: 'Erreur lors du chargement du consours',
            });
        }
        return () => setTimeout(() => controller.abort());
    }, []);

    return (
        <>
            <Button name="Retour" onClick={() => navigate('/BO/competition')} />
            <Loader active={isLoading}>
                <BOSee
                    entity={entity}
                    properties={[
                        {
                            display: 'nom',
                            name: 'competition_name',
                        },
                        {
                            display: 'Description',
                            name: 'description',
                        },
                        {
                            display: 'Date de création',
                            name: 'creation_date',
                            type: 'date',
                        },
                        {
                            display: 'endowments',
                            name: 'endowments',
                        },
                        {
                            display: 'max age',
                            name: 'max_age_criteria',
                        },
                        {
                            display: 'min age',
                            name: 'min_age_criteria',
                        },
                        {
                            display: 'nombre de vote max',
                            name: 'number_of_max_votes',
                        },
                        {
                            display: 'nombre de prix',
                            name: 'number_of_prices',
                        },
                        {
                            display: 'organisation',
                            name: 'organization',
                            customData({ entity, property }) {
                                return entity?.organization?.organizer_name;
                            },
                        },
                        {
                            display: 'date de publication',
                            name: 'publication_date',
                            type: 'date',
                        },
                        {
                            display: 'date début publication',
                            name: 'publication_start_date',
                            type: 'date',
                        },
                        {
                            display: 'date début de soummision',
                            name: 'submission_start_date',
                            type: 'date',
                        },
                        {
                            display: 'date de fin de soummision',
                            name: 'submission_end_date',
                            type: 'date',
                        },
                        {
                            display: 'date de début de vote',
                            name: 'voting_start_date',
                            type: 'date',
                        },
                        {
                            display: 'date de fin de vote',
                            name: 'voting_end_date',
                            type: 'date',
                        },
                        {
                            display: 'date résultat',
                            name: 'results_date',
                            type: 'date',
                        },
                        {
                            display: 'pondération vote jury',
                            name: 'weighting_of_jury_votes',
                        },
                        {
                            display: 'thème',
                            name: 'theme',
                            customData({ entity, property }) {
                                return entity?.theme
                                    ?.map(theme => theme.label)
                                    .join(', ');
                            },
                        },
                        {
                            display: 'Visuel',
                            name: 'competition_visual',
                            type: 'img',
                            customData: ({ entity }) => {
                                return entity?.competition_visual?.path
                                    ? {
                                          to: toApiPath(
                                              entity?.competition_visual?.path
                                          ),
                                          name: entity?.competition_visual
                                              ?.default_name,
                                      }
                                    : null;
                            },
                        },
                        {
                            display: 'Pays',
                            name: 'country_criteria',
                        },
                        {
                            display: 'status',
                            name: 'state',
                        },
                        {
                            display: 'Ville',
                            name: 'city_criteria',
                            customData({ entity, property }) {
                                return entity?.city_criteria
                                    ?.map(city => city.nom)
                                    .join(', ');
                            },
                        },
                        {
                            display: 'département',
                            name: 'department_criteria',
                            customData({ entity, property }) {
                                return entity?.department_criteria
                                    ?.map(department => department.nom)
                                    .join(', ');
                            },
                        },
                        {
                            display: 'région',
                            name: 'region_criteria',
                            customData({ entity, property }) {
                                return entity?.region_criteria
                                    ?.map(region => region.nom)
                                    .join(', ');
                            },
                        },
                        {
                            display: 'réglement',
                            name: 'rules',
                        },
                    ]}
                />
            </Loader>
        </>
    );
}
