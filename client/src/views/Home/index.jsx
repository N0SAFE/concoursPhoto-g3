import style from './style.module.scss';
import FOCompetitionList from '@/components/organisms/FO/FOCompetitionList';
import FOStats from '@/components/organisms/FO/FOStats';
import FOPortalList from '@/components/organisms/FO/FOPortalList';
import Loader from '@/components/atoms/Loader/index.jsx';
import { useEffect, useState } from 'react';
import useApiFetch from '@/hooks/useApiFetch.js';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import useApiPath from '@/hooks/useApiPath.js';
import Icon from '@/components/atoms/Icon/index.jsx';
import { useRef } from 'react';

export default function Home() {
    const apiPath = useApiPath();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({});
    const apiFetch = useApiFetch();
    const [competitions, setCompetitions] = useState([]);
    const [promotedCompetitions, setPromotedCompetitions] = useState([]);
    const listRef = useRef();
    const [shouldUseGridRef, setShouldUseGridRef] = useState(true);

    const getStats = controller => {
        return apiFetch('/stats', {
            method: 'GET',
            signal: controller?.signal,
        })
            .then(r => r.json())
            .then(data => {
                console.debug(data);
                setStats(data);
            });
    };

    function getPromotedCompetitions(controller) {
        const now = new Date();
        return apiFetch(
            '/competitions?is_promoted=1&groups[]=competition&groups[]=file&groups[]=competition_visual&results_date[after]=' +
                format(now, 'yyyy-MM-dd') +
                '&properties[]=competition_visual',
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
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                console.debug(data);
                setPromotedCompetitions(data['hydra:member']);
                return data['hydra:member'];
            });
    }

    function getListCompetitions(controller) {
        const now = new Date();
        return apiFetch(
            '/competitions?groups[]=competition&groups[]=file&groups[]=competition_visual&results_date[after]=' +
                format(now, 'yyyy-MM-dd') +
                '&properties[]=competition_visual&properties[]=competition_name&properties[]=state&properties[]=numberOfVotes&properties[]=numberOfParticipants&properties[]=numberOfPictures&properties[]=results_date&properties[organization][]=users&properties[]=theme&properties[]=id',
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
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                console.debug(data);
                const _competitions = data['hydra:member'];
                console.debug(_competitions);
                setCompetitions(data['hydra:member']);
                return data['hydra:member'];
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        const controller = new AbortController();
        const promise = Promise.all([
            getListCompetitions(controller),
            getStats(controller),
            getPromotedCompetitions(controller),
        ]).then(function () {
            setIsLoading(false);
        });

        if (import.meta.env.MODE === 'development') {
            toast.promise(promise, {
                pending: "Chargement de la page d'accueil",
                success: "Page d'accueil chargée",
                error: "Erreur lors du chargement de la page d'accueil",
            });
        }

        return () => setTimeout(() => controller.abort());
    }, []);

    const handleGrid = e => {
        e.preventDefault();
        const listElement = listRef.current;

        listElement.classList.remove(style.homeDispositionList);
        listElement.classList.add(style.homeDispositionGrid);
    };

    const handleList = e => {
        e.preventDefault();
        const listElement = listRef.current;

        listElement.classList.remove(style.homeDispositionGrid);
        listElement.classList.add(style.homeDispositionList);
    };

    return (
        <Loader active={isLoading}>
            <div className={style.homeContainer}>
                <div className={style.homeBanner}>
                    <div>
                        <h1>Le portail des concours photo</h1>
                    </div>
                    <FOStats stats={stats} />
                </div>
                <FOPortalList
                    boxSingle={{
                        type: 'slider',
                        path: '/fixtures-upload/952-2160-2160.jpg',
                        alt: "Photo de la page d'accueil",
                    }}
                    boxSingleContents={promotedCompetitions.map(competition => {
                        return competition.competition_visual.path;
                    })}
                    boxUp={{
                        type: 'picture',
                        path: '/fixtures-upload/952-2160-2160.jpg',
                        alt: "Photo de la page d'accueil",
                    }}
                    boxDown={{
                        type: 'picture',
                        path: '/fixtures-upload/952-2160-2160.jpg',
                        alt: "Photo de la page d'accueil",
                    }}
                />
                <div className={style.homeDisposition}>
                    <div>
                        <h2>Derniers concours photo publiés</h2>
                    </div>
                    <div>
                        <div>
                            <Icon
                                className={style.homeIcon}
                                icon="grid"
                                size={30}
                                onClick={e => handleGrid(e)}
                            />
                            <Icon
                                className={style.homeIcon}
                                icon="list"
                                size={30}
                                onClick={e => handleList(e)}
                            />
                            <Icon icon="map" size={30} />
                        </div>
                    </div>
                </div>
                <div ref={listRef}>
                    <FOCompetitionList cardContentList={competitions} />
                </div>
            </div>
        </Loader>
    );
}
