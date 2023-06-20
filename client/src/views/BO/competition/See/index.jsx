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
import style from './style.module.scss';
import Chip from '@/components/atoms/Chip';

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
                    'organization:admins:read',
                    'user:read',
                    'sponsor:read',
                    'sponsor:logo:read',
                    'competition:photographer:read',
                    'competition:sponsors:read',
                    'organization:logo:read'
                ],
            },
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
                    Promise.all(data.cityCriteria.map(getCityByCode)),
                    Promise.all(
                        data.departmentCriteria.map(getDepartmentByCode)
                    ),
                    Promise.all(data.regionCriteria.map(getRegionByCode)),
                ]).then(([cities, departments, regions]) => {
                    const _competition = {
                        ...data,
                        cityCriteria: cities,
                        departmentCriteria: departments,
                        regionCriteria: regions,
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
            <Loader active={isLoading}>
                <div className={style.all}>
                    <BOSee
                        entity={entity}
                        properties={[
                            {
                                display: 'nom',
                                name: 'competitionName',
                            },
                            {
                                display: 'Description',
                                name: 'description',
                            },
                            {
                                display: 'Date de création',
                                name: 'creationDate',
                                type: 'date',
                            },
                            {
                                display: 'endowments',
                                name: 'endowments',
                            },
                            {
                                display: 'max age',
                                name: 'maxAgeCriteria',
                            },
                            {
                                display: 'min age',
                                name: 'minAgeCriteria',
                            },
                            {
                                display: 'nombre de vote max',
                                name: 'numberOfMaxVotes',
                            },
                            {
                                display: 'nombre de prix',
                                name: 'numberOfPrices',
                            },
                            {
                                display: 'organisation',
                                name: 'organization',
                                customData({ entity, property }) {
                                    return entity?.organization?.organizerName;
                                },
                            },
                            {
                                display: 'date de publication',
                                name: 'publicationDate',
                                type: 'date',
                            },
                            {
                                display: 'date début publication',
                                name: 'publicationStartDate',
                                type: 'date',
                            },
                            {
                                display: 'date début de soummision',
                                name: 'submissionStartDate',
                                type: 'date',
                            },
                            {
                                display: 'date de fin de soummision',
                                name: 'submissionEndDate',
                                type: 'date',
                            },
                            {
                                display: 'date de début de vote',
                                name: 'votingStartDate',
                                type: 'date',
                            },
                            {
                                display: 'date de fin de vote',
                                name: 'votingEndDate',
                                type: 'date',
                            },
                            {
                                display: 'date résultat',
                                name: 'resultsDate',
                                type: 'date',
                            },
                            {
                                display: 'pondération vote jury',
                                name: 'weightingOfJuryVotes',
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
                                name: 'competitionVisual',
                                type: 'img',
                                customData: ({ entity }) => {
                                    return entity?.competitionVisual?.path
                                        ? {
                                              to: toApiPath(
                                                  entity?.competitionVisual
                                                      ?.path
                                              ),
                                              name: entity?.competitionVisual
                                                  ?.defaultName,
                                          }
                                        : null;
                                },
                            },
                            {
                                display: 'Pays',
                                name: 'countryCriteria',
                            },
                            {
                                display: 'status',
                                name: 'state',
                            },
                            {
                                display: 'Ville',
                                name: 'cityCriteria',
                                customData({ entity, property }) {
                                    return entity?.cityCriteria
                                        ?.map(city => city.nom)
                                        .join(', ');
                                },
                            },
                            {
                                display: 'département',
                                name: 'departmentCriteria',
                                customData({ entity, property }) {
                                    return entity?.departmentCriteria
                                        ?.map(department => department.nom)
                                        .join(', ');
                                },
                            },
                            {
                                display: 'région',
                                name: 'regionCriteria',
                                customData({ entity, property }) {
                                    return entity?.regionCriteria
                                        ?.map(region => region.nom)
                                        .join(', ');
                                },
                            },
                            {
                                display: 'réglement',
                                name: 'rules',
                            },
                            {
                                display: 'photographes',
                                name: 'photographers',
                                customData({ entity, property }) {
                                    return entity?.photographers?.map(
                                        photographer => (
                                            <Chip
                                                backgroundColor={'#78a2ff'}
                                                color={'white'}
                                                onClick={() =>
                                                    navigate(
                                                        `/BO/user/${photographer.id}`
                                                    )
                                                }
                                            >
                                                {photographer.firstname +
                                                    ' ' +
                                                    photographer.lastname}
                                            </Chip>
                                        )
                                    );
                                },
                            },
                            {
                                display: 'administrateurs',
                                name: 'organization',
                                customData({ entity, property }) {
                                    return entity?.organization?.admins?.map(
                                        admin => (
                                            <Chip
                                                backgroundColor={'#78a2ff'}
                                                color={'white'}
                                                onClick={() =>
                                                    navigate(
                                                        `/BO/user/${admin.id}`
                                                    )
                                                }
                                            >
                                                {admin.firstname +
                                                    ' ' +
                                                    admin.lastname}
                                            </Chip>
                                        )
                                    );
                                },
                            },
                            {
                                display: 'sponsors',
                                name: 'sponsors',
                                customData({ entity, property }) {
                                    return entity?.sponsors?.map(sponsor => (
                                        <Chip>
                                            {sponsor?.organization?.logo?.path ? (
                                                <img
                                                    src={toApiPath(
                                                        sponsor.organization.logo.path
                                                    )}
                                                    alt={
                                                        sponsor.organization.logo.defaultName
                                                    }
                                                    style={{
                                                        minHeight: '50px',
                                                        maxHeight: '50px',
                                                    }}
                                                />
                                            ) : (
                                                sponsor.name
                                            )}
                                        </Chip>
                                    ));
                                },
                            },
                        ]}
                    />
                    <Button
                        style={{ marginTop: '3%' }}
                        onClick={() => navigate('/BO/competition')}
                    >
                        Retour
                    </Button>
                </div>
            </Loader>
        </>
    );
}
