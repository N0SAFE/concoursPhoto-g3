import style from './style.module.scss';
import PortalList from '@/components/organisms/FO/FOPortalList';
import useApiFetch from '@/hooks/useApiFetch.js';
import useLocation from '@/hooks/useLocation.js';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Breadcrumb from '@/components/atoms/Breadcrumb';
import Chip from '@/components/atoms/Chip/index.jsx';
import Icon from '@/components/atoms/Icon/index.jsx';
import { Outlet } from 'react-router-dom';
import Loader from '@/components/atoms/Loader/index.jsx';
import Button from '@/components/atoms/Button/index.jsx';

export default function CompetitionLayout() {
    const [isLoading, setIsLoading] = useState(true);
    const apiFetch = useApiFetch();
    const { getCityByCode, getDepartmentByCode, getRegionByCode } =
        useLocation();
    const [entity, setEntity] = useState({});
    const { id: competitionId } = useParams();
    const navigate = useNavigate();

    const getCompetitions = controller => {
        return apiFetch('/competitions/view/' + competitionId, {
            query: {
                groups: [
                    'file:read',
                    'competition:competitionVisual:read',
                    'competition:competitionPictures:read',
                    'competition:organization:read',
                    'organization:logo:read',
                    'organization:admins:read',
                    'user:read',
                    'picture:file:read',
                    'competition:memberOfTheJuries:read',
                    'memberOfTheJury:user:read',
                    "competition:theme:read",
                    "theme:read",
                    "competition:sponsors:read",
                    "sponsor:read",
                    'sponsor:logo:read'
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
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                return await Promise.all([
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
                            { label: 'Accueil', link: '/' },
                            { label: 'Concours photo', link: location },
                            {
                                label: `Concours photo ${entity.competitionName}`
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
                                <Chip
                                    backgroundColor={'#F5F5F5'}
                                    title={`Pays : ${entity.countryCriteria}`}
                                />
                                <Chip
                                    backgroundColor={'#F5F5F5'}
                                    title={`Département(s) : ${entity.departmentCriteria?.map(
                                        department => ' ' + department.nom
                                    )}`}
                                />
                                <Chip
                                    backgroundColor={'#F5F5F5'}
                                    title={`Région(s) : ${entity.regionCriteria?.map(
                                        region => ' ' + region.nom
                                    )}`}
                                />
                                <Chip
                                    backgroundColor={'#F5F5F5'}
                                    title={`Thème(s) : ${entity.theme?.map(
                                        theme => ' ' + theme.label
                                    )}`}
                                />

                                <Chip
                                    backgroundColor={'#F5F5F5'}
                                    title={`Âge : de ${entity.minAgeCriteria} à ${entity.maxAgeCriteria} ans`}
                                />
                                <Chip
                                    backgroundColor={'#F5F5F5'}
                                    title={`Dotation : ${entity.endowments}`}
                                />
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
                                            title={entity.stateLabel}
                                            backgroundColor={'#000'}
                                            color={'#fff'}
                                        />
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
                                        <Icon icon="time" size="20" />
                                    </div>
                                </div>
                            </div>
                            <div className={style.viewOrganizerStats}>
                                {entity.state >= 2 && (
                                    <>
                                        <Chip
                                            title={entity.numberOfParticipants}
                                            icon={'user-plus'}
                                            backgroundColor={'#F5F5F5'}
                                        />
                                        <Chip
                                            title={entity.numberOfPictures}
                                            icon={'camera1'}
                                            backgroundColor={'#F5F5F5'}
                                        />
                                    </>
                                )}
                                {entity.state >= 4 && (
                                    <Chip
                                        title={entity.numberOfVotes}
                                        icon={'like'}
                                        backgroundColor={'#F5F5F5'}
                                    />
                                )}
                                <Chip
                                    title={entity.consultationCount}
                                    icon={'view-show'}
                                    backgroundColor={'#F5F5F5'}
                                />
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
                        image => image.logo.path
                    )}
                />
                <Outlet context={{ competition: entity }} />
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
