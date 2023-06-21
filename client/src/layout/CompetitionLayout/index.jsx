import style from './style.module.scss';
import PortalList from '@/components/organisms/FO/FOPortalList';
import useApiFetch from '@/hooks/useApiFetch.js';
import useLocation from '@/hooks/useLocation.js';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Breadcrumb from '@/components/atoms/Breadcrumb';
import Chip from '@/components/atoms/Chip/index.jsx';
import Icon from '@/components/atoms/Icon/index.jsx';
import { Outlet } from 'react-router-dom';
import Loader from '@/components/atoms/Loader/index.jsx';
import Button from '@/components/atoms/Button/index.jsx';

export default function CompetitionLayout() {
    const {isLoading, competition} = useOutletContext();
    
    return (
        <Loader active={isLoading}>
            <div className={style.competitionContainer}>
                <div className={style.competitionBanner}>
                    <Breadcrumb
                        items={[
                            { label: 'Accueil', link: '/' },
                            { label: 'Concours photo', link: location },
                            {
                                label: `Concours photo ${competition.competitionName}`,
                            },
                        ]}
                    />
                    <div className={style.filter}>
                        <div className={style.viewFilter}>
                            <div>
                                <h1>
                                    Concours photo "{competition.competitionName}"
                                </h1>
                            </div>
                            <div>
                                <Chip backgroundColor={'#F5F5F5'}>
                                    Pays : {competition.countryCriteria}
                                </Chip>
                                <Chip backgroundColor={'#F5F5F5'}>
                                    Département(s) :{' '}
                                    {competition.departmentCriteria?.map(
                                        department => ' ' + department.nom
                                    )}
                                </Chip>
                                <Chip backgroundColor={'#F5F5F5'}>
                                    Région(s) :{' '}
                                    {competition.regionCriteria?.map(
                                        region => ' ' + region.nom
                                    )}
                                </Chip>
                                <Chip backgroundColor={'#F5F5F5'}>
                                    Thème(s) :{' '}
                                    {competition.theme?.map(
                                        theme => ' ' + theme.label
                                    )}
                                </Chip>
                                <Chip backgroundColor={'#F5F5F5'}>
                                    Âge : de {competition.minAgeCriteria} à{' '}
                                    {competition.maxAgeCriteria} ans
                                </Chip>
                                <Chip backgroundColor={'#F5F5F5'}>
                                    Dotation : {competition.endowments}
                                </Chip>
                            </div>
                        </div>
                        <div className={style.viewOrganizer}>
                            <div>
                                <div className={style.viewOrganizerOne}>
                                    <p className={style.titleOrganizer}>
                                        Organisateur :{' '}
                                        <span>
                                            {competition.organization?.admins
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
                                            {competition.stateLabel}
                                        </Chip>
                                    </div>
                                    <div>
                                        <p>
                                            Fin le{' '}
                                            {new Date(
                                                competition.votingEndDate
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
                                {competition.state >= 2 && (
                                    <>
                                        <Chip
                                            icon={'user-plus'}
                                            backgroundColor={'#F5F5F5'}
                                        >
                                            {competition.numberOfParticipants}
                                        </Chip>
                                        <Chip
                                            title={competition.numberOfPictures}
                                            icon={'camera1'}
                                            backgroundColor={'#F5F5F5'}
                                        >
                                            {competition.numberOfPictures}
                                        </Chip>
                                    </>
                                )}
                                {competition.state >= 4 && (
                                    <Chip
                                        icon={'like'}
                                        backgroundColor={'#F5F5F5'}
                                    >
                                        {competition.numberOfVotes}
                                    </Chip>
                                )}
                                <Chip
                                    icon={'view-show'}
                                    backgroundColor={'#F5F5F5'}
                                >
                                    {competition.consultationCount}
                                </Chip>
                            </div>
                        </div>
                    </div>
                </div>
                <PortalList
                    boxSingle={{
                        type: 'picture',
                        path: competition.competitionVisual?.path,
                        alt: 'Photo du concours',
                    }}
                    boxUp={{
                        type: 'picture',
                        path: competition.organization?.logo.path,
                    }}
                    boxDown={{
                        type: 'slider',
                    }}
                    boxDownContents={competition.sponsors?.map(
                        image => image.logo.path
                    )}
                />
                <Outlet context={{ competition }} />
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
