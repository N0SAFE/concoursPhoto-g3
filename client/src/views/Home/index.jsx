import style from './style.module.scss';
import FOCompetitionList from '@/components/organisms/FO/FOCompetitionList';
import FOStats from '@/components/organisms/FO/FOStats';
import FOPortalList from '@/components/organisms/FO/FOPortalList';
import Loader from '@/components/atoms/Loader/index.jsx';
import { useEffect, useState } from 'react';
import useApiFetch from '@/hooks/useApiFetch.js';
import { toast } from 'react-toastify';
import {format} from "date-fns"
import useApiPath from '@/hooks/useApiPath.js';

export default function Home() {
    const apiPath = useApiPath();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({});
    const apiFetch = useApiFetch();
    const [competitions, setCompetitions] = useState([]);
    const [promotedCompetitions, setPromotedCompetitions] = useState([]);

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
        return apiFetch('/competitions?is_promoted=1&results_date[after]=' +  format(now, "yyyy-MM-dd") + '&properties[]=competition_visual', {
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
                console.debug(data);
                setPromotedCompetitions(data['hydra:member']);
                return data['hydra:member'];
        })
    }

    console.log(promotedCompetitions.competition_visual);

    function getListCompetitions(controller) {
        const now = new Date();
        return apiFetch('/competitions?results_date[after]=' + format(now, "yyyy-MM-dd"), {
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
                console.debug(data);
                const _competitions = data['hydra:member'].map(function (c) {
                    const { numOfPictures, numOfVotes } = c.pictures.reduce(
                        ({ numOfPictures, set, numOfVotes }, p) => {
                            if (!set.has(p.user.id)) {
                                set.add(p.user.id);
                                return {
                                    numOfPictures: numOfPictures + 1,
                                    set,
                                    numOfVotes: numOfVotes + p.votes.length,
                                };
                            }
                            return {
                                numOfPictures,
                                set,
                                numOfVotes: numOfVotes + p.votes.length,
                            };
                        },
                        { numOfPictures: 0, set: new Set(), numOfVotes: 0 }
                    );
                    c.numberOfUser = numOfPictures;
                    c.numberOfVotes = numOfVotes;
                    return c;
                });
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
            getPromotedCompetitions(controller)
        ]).then(function () {
            setIsLoading(false);
        });
        
        if (import.meta.env.MODE === 'development') {
            toast.promise(promise, {
                pending: 'Chargement de la page d\'accueil',
                success: 'Page d\'accueil chargée',
                error: 'Erreur lors du chargement de la page d\'accueil',
            });
        }

        return () => setTimeout(() => controller.abort());
    }, []);

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
                    boxSingleContents={promotedCompetitions.map((competition) => {
                        return competition.competition_visual.path
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

                <h2>Derniers concours photo publiés</h2>
                <FOCompetitionList cardContentList={competitions} />
            </div>
        </Loader>
    );
}
