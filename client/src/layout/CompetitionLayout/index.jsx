import style from './style.module.scss';
import PortalList from '@/components/organisms/FO/FOPortalList';
import useApiFetch from '@/hooks/useApiFetch.js';
import useLocation from '@/hooks/useLocation.js';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Breadcrumb from '@/components/atoms/Breadcrumb';
import Chip from '@/components/atoms/Chip/index.jsx';
import Dropdown from '@/components/atoms/Dropdown/index.jsx';
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
        return apiFetch(
            '/competitions/' +
                competitionId +
                '?groups[]=competition&groups[]=file&groups[]=competition_visual&groups[]=competition_pictures&groups[]=competition_aside',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: controller?.signal,
            }
        )
            .then(res => res.json())
            .then(async data => {
                console.debug(data);
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                return await Promise.all([
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
                                label: `Concours photo ${entity.competition_name}`,
                            },
                        ]}
                    />
                    <div className={style.filter}>
                        <div className={style.viewFilter}>
                            <div>
                                <h1>
                                    Concours photo "{entity.competition_name}"
                                </h1>
                            </div>
                            <div>
                                <Chip
                                    backgroundColor={'#F5F5F5'}
                                    title={`Pays : ${entity.country_criteria}`}
                                />
                                <Chip
                                    backgroundColor={'#F5F5F5'}
                                    title={`Département(s) : ${entity.department_criteria?.map(
                                        department => (
                                            ' ' + department.nom
                                        )
                                    )}`}
                                />
                                <Chip
                                    backgroundColor={'#F5F5F5'}
                                    title={`Région(s) : ${entity.region_criteria?.map(
                                    region => (
                                        ' ' + region.nom
                                    )
    
                                    )}`} />
                                <Chip
                                    backgroundColor={'#F5F5F5'}
                                    title={`Thème(s) : ${entity.theme?.map(
                                        theme => (
                                            ' ' + theme.label
                                        )
                                    )}`}
                                />

                                <Chip
                                    backgroundColor={'#F5F5F5'}
                                    title={`Âge : de ${entity.min_age_criteria} à ${entity.max_age_criteria} ans`}
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
                                            {entity.organization?.users
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
                                            title={'Phase de vote'}
                                            backgroundColor={'#000'}
                                            color={'#fff'}
                                        />
                                    </div>
                                    <div>
                                        <p>
                                            Fin le{' '}
                                            {new Date(
                                                entity.voting_end_date
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
                                <Chip
                                    title={entity.numberOfParticipants}
                                    icon={'user-plus'}
                                    backgroundColor={'#F5F5F5'}
                                />
                                <Chip
                                    title={entity.numberOfPictures}
                                    icon={'camera'}
                                    backgroundColor={'#F5F5F5'}
                                />
                                <Chip
                                    title={entity.numberOfVotes}
                                    icon={'like'}
                                    backgroundColor={'#F5F5F5'}
                                />
                                <Chip />
                            </div>
                        </div>
                    </div>
                </div>
                <PortalList
                    boxSingle={{
                        type: 'picture',
                        path: entity.competition_visual?.path,
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
                    name={'Retour'}
                    borderRadius={'30px'}
                    padding={'20px'}
                    icon={'arrow-thin-left'}
                    iconPosition={'left'}
                    onClick={() => navigate('/')}
                />
            </div>
        </Loader>
    );
}
