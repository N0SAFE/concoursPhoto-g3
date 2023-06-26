import style from './style.module.scss';
import PortalList from '@/components/organisms/FO/FOPortalList';
import useApiFetch from '@/hooks/useApiFetch.js';
import useLocation from '@/hooks/useLocation.js';
import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import Breadcrumb from '@/components/atoms/Breadcrumb';
import Chip from '@/components/atoms/Chip/index.jsx';
import Icon from '@/components/atoms/Icon/index.jsx';
import {Outlet} from 'react-router-dom';
import Loader from '@/components/atoms/Loader/index.jsx';
import Button from '@/components/atoms/Button/index.jsx';
import CompetitionVisualEdit from "@/components/organisms/Modals/competition/CompetitionVisualEdit.jsx";
import SponsorsEdit from "@/components/organisms/Modals/competition/SponsorsEdit.jsx";

export default function CompetitionLayout() {
    const [isLoading, setIsLoading] = useState(true);
    const apiFetch = useApiFetch();
    const {
        getCityByCode,
        getDepartmentByCode,
        getRegionByCode,
    } = useLocation();
    const [entity, setEntity] = useState({});
    const updateEntityState = (key, value) => {
        setEntity({...entity, [key]: value});
    };
    const {id: competitionId} = useParams();
    const navigate = useNavigate();

    const [entityPossibility, setEntityPossibility] = useState({
        themes: [],
        participantCategories: [],
    });
    const [locationPossibility, setLocationPossibility] = useState({
        regions: {isLoading: true, data: []},
        departments: {isLoading: true, data: []},
        cities: {isLoading: true, data: []},
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

    const getCompetitions = controller => {
        return apiFetch('/competitions/view/' + competitionId, {
            query: {
                groups: [
                    'file:read',
                    'competition:competitionVisual:read',
                    'competitionVisual:read',
                    'competition:competitionPictures:read',
                    'competition:organization:read',
                    'organization:logo:read',
                    'organization:admins:read',
                    'user:read',
                    'picture:file:read',
                    'competition:memberOfTheJuries:read',
                    'memberOfTheJury:user:read',
                    'competition:theme:read',
                    'competition:participantCategory:read',
                    'participantCategory:read',
                    'theme:read',
                    'competition:sponsor:read',
                    'sponsor:read',
                    'sponsor:logo:read',
                    'picture:user:read',
                ],
            },
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller?.signal,
        })
            .then(res => res.json())
            .then(async data => {
                console.debug(data);
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                return await Promise.all([
                    Promise.all(data.cityCriteria.map(async function (c) {
                        const city = await getCityByCode(c)
                        return {...city, label: city.nom, value: city.code}
                    })),
                    Promise.all(
                        data.departmentCriteria.map(async function (d) {
                            const department = await getDepartmentByCode(d)
                            return {...department, label: department.nom, value: department.code}
                        })
                    ),
                    Promise.all(data.regionCriteria.map(async function (r) {
                        const region = await getRegionByCode(r)
                        return {...region, label: region.nom, value: region.code}
                    }))
                ]).then(([cities, departments, regions]) => {
                    const _competition = {
                        ...data,
                        theme: data.theme.map((theme) => ({
                            value: theme['@id'],
                            label: theme.label
                        })),
                        participantCategory: data.participantCategory.map((participantCategory) => ({
                            value: participantCategory['@id'],
                            label: participantCategory.label
                        })),
                        cityCriteria: cities,
                        departmentCriteria: departments,
                        regionCriteria: regions,
                    };
                    setEntity(_competition);
                    return _competition;
                });
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
                error: 'Erreur lors du chargement du concours',
            });
        }

        return () => setTimeout(() => controller.abort());
    }, []);

    return (
        <Loader active={isLoading}>
            <div className={style.competitionContainer}>
                <div className={style.competitionBanner}>
                    <Breadcrumb
                        items={[
                            {label: 'Accueil', link: '/'},
                            {label: 'Concours photo', link: location},
                            {
                                label: `Concours photo ${entity.competitionName}`,
                            },
                        ]}
                    />
                    <div className={style.filter}>
                        <div className={style.viewFilter}>
                            <div>
                                <h1>
                                    Concours photo "{entity.competitionName}"
                                </h1>
                            </div>
                            <div>
                                <Chip backgroundColor={'#F5F5F5'}>
                                    Pays : {entity.countryCriteria}
                                </Chip>
                                <Chip backgroundColor={'#F5F5F5'}>
                                    Département(s) :{' '}
                                    {entity.departmentCriteria?.map(
                                        department => ' ' + department.nom
                                    )}
                                </Chip>
                                <Chip backgroundColor={'#F5F5F5'}>
                                    Région(s) :{' '}
                                    {entity.regionCriteria?.map(
                                        region => ' ' + region.nom
                                    )}
                                </Chip>
                                <Chip backgroundColor={'#F5F5F5'}>
                                    Thème(s) :{' '}
                                    {entity.theme?.map(
                                        theme => ' ' + theme.label
                                    )}
                                </Chip>
                                <Chip backgroundColor={'#F5F5F5'}>
                                    Âge : de {entity.minAgeCriteria} à{' '}
                                    {entity.maxAgeCriteria} ans
                                </Chip>
                                <Chip backgroundColor={'#F5F5F5'}>
                                    <p dangerouslySetInnerHTML={{
                                        __html: 'Dotation : ' + entity.endowments,
                                    }}></p>
                                </Chip>
                            </div>
                        </div>
                        <div className={style.viewOrganizer}>
                            <div>
                                <div className={style.viewOrganizerOne}>
                                    <p className={style.titleOrganizer}>
                                        Organisateur :{' '}
                                        <span>
                                            {entity.organization?.admins
                                                .map(
                                                    user =>
                                                        user.firstname +
                                                        ' ' +
                                                        user.lastname
                                                )
                                                .join(', ')}
                                        </span>
                                    </p>
                                </div>
                                <div className={style.viewOrganizerTwo}>
                                    <div>
                                        <Chip
                                            backgroundColor={'#000'}
                                            color={'#fff'}
                                        >
                                            {entity.stateLabel}
                                        </Chip>
                                    </div>
                                    <div>
                                        <p>
                                            Fin le{' '}
                                            {new Date(
                                                entity.votingEndDate
                                            ).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                        <Icon icon="time" size="20"/>
                                    </div>
                                </div>
                            </div>
                            <div className={style.viewOrganizerStats}>
                                {entity.state >= 2 && (
                                    <>
                                        <Chip
                                            icon={'user-plus'}
                                            backgroundColor={'#F5F5F5'}
                                        >
                                            {entity.numberOfParticipants}
                                        </Chip>
                                        <Chip
                                            title={entity.numberOfPictures}
                                            icon={'camera'}
                                            backgroundColor={'#F5F5F5'}
                                        >
                                            {entity.numberOfPictures}
                                        </Chip>
                                    </>
                                )}
                                {entity.state >= 4 && (
                                    <Chip
                                        icon={'like'}
                                        backgroundColor={'#F5F5F5'}
                                    >
                                        {entity.numberOfVotes}
                                    </Chip>
                                )}
                                <Chip
                                    icon={'view-show'}
                                    backgroundColor={'#F5F5F5'}
                                >
                                    {entity.consultationCount}
                                </Chip>
                            </div>
                        </div>
                    </div>
                </div>
                <PortalList
                    boxSingle={{
                        type: 'picture',
                        path: entity.competitionVisual?.path,
                        alt: 'Photo du concours',
                    }}
                    boxUp={{
                        type: 'picture',
                        path: entity.organization?.logo.path,
                    }}
                    boxDown={{
                        type: 'slider',
                    }}
                    boxDownContents={entity.sponsors?.map(
                        sponsor => sponsor.organization?.logo.path
                    )}
                    entity={entity}
                    modalContentSingle={<CompetitionVisualEdit competition={entity}/>}
                    modalContentDown={<SponsorsEdit competition={entity} />}
                />
                <Outlet context={{competition: entity}}/>
                <Button
                    borderRadius={'30px'}
                    padding={'20px'}
                    icon={'arrow-thin-left'}
                    iconPosition={'left'}
                    onClick={() => navigate('/')}
                >
                    Retour
                </Button>
            </div>
        </Loader>
    );
}
