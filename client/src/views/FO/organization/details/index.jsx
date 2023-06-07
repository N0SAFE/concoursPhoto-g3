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

export default function OrganisationLayout() {
    const [isLoading, setIsLoading] = useState(true);
    const apiFetch = useApiFetch();
    const [entity, setEntity] = useState({});
    const { id: organizationid } = useParams();
    const navigate = useNavigate();

    const getOrganization = controller => {
        return apiFetch(
            '/organizations/' +
            organizationid +
            '?groups[]=competition&groups[]=file&groups[]=organization',
            {
                query: {
                    groups: [
                        "organization:competition:read",
                        'competition:read',
                        "organization:organizationVisual:read",
                        "file:read"
                    ]
                },
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
                
                setEntity(data);
                
            });
    };
    
    useEffect(() => {
        const controller = new AbortController();
        const promise = getOrganization(controller);
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
                                label: `Concours photo ${entity.organizationName}`,
                            },
                        ]}
                    />
                    <div className={style.filter}>
                        <div className={style.viewFilter}>
                            <div>
                                <h1>
                                    Concours photo "{entity.organizationName}"
                                </h1>
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
                        </div>
                    </div>
                </div>
                <PortalList
                    boxSingle={{
                        type: 'picture',
                        path: entity.organizationVisual?.path,
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
                <Outlet context={{ organization: entity }} />
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
