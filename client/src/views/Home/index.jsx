import style from './style.module.scss';
import FOStats from '@/components/organisms/FO/FOStats';
import FOPortalList from '@/components/organisms/FO/FOPortalList';
import Loader from '@/components/atoms/Loader/index.jsx';
import { useEffect, useState } from 'react';
import useApiFetch from '@/hooks/useApiFetch.js';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Icon from '@/components/atoms/Icon/index.jsx';
import {useNavigate, useSearchParams} from 'react-router-dom';
import Pagination from '@/components/molecules/Pagination/index.jsx';
import Card from '@/components/molecules/Card/index.jsx';

const DEFAULT_PAGE = 1;
const DEFAULT_ITEMS_PER_PAGE = 9;

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [stats, setStats] = useState({});
    const apiFetch = useApiFetch();
    const [competitions, setCompetitions] = useState([]);
    const [paginationOptions, setPaginationOptions] = useState({});
    const [promotedCompetitions, setPromotedCompetitions] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams({});
    const [page, setPage] = useState(
        isNaN(parseInt(searchParams.get('page'))) || searchParams.get('page') < 1
            ? DEFAULT_PAGE
            : parseInt(searchParams.get('page'))
    );
    const [itemsPerPage, setItemsPerPage] = useState(
        isNaN(parseInt(searchParams.get('itemsPerPage'))) || searchParams.get('itemsPerPage') < 1
            ? DEFAULT_ITEMS_PER_PAGE
            : parseInt(searchParams.get('itemsPerPage'))
    );
    const [cardLoading, setCardLoading] = useState(false);
    const [cardDisposition, setCardDisposition] = useState('grid');
    const [controller, setController] = useState();

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

    useEffect(() => {
        setSearchParams({
            page: page || DEFAULT_PAGE,
            itemsPerPage: itemsPerPage || DEFAULT_ITEMS_PER_PAGE,
        });
        setCardLoading(true);
        getListCompetitions().then(() => setCardLoading(false));
        return () => {
            setTimeout(() => controller?.abort());
        };
    }, [page, itemsPerPage]);

    function getListCompetitions() {
        const now = new Date();
        const pageToLoad = page === null ? DEFAULT_PAGE : page;
        const itemsPerPageToLoad =
            itemsPerPage === null ? DEFAULT_ITEMS_PER_PAGE : itemsPerPage;
        const actualDate = format(now, 'yyyy-MM-dd');
        controller?.abort();
        const _controller = new AbortController();
        setController(_controller);
        return apiFetch(
            `/competitions?page=${pageToLoad}&itemsPerPage=${itemsPerPageToLoad}&groups[]=competition&groups[]=file&groups[]=competition_visual&results_date[after]=${actualDate}&properties[]=competition_visual&properties[]=competition_name&properties[]=state&properties[]=numberOfVotes&properties[]=numberOfParticipants&properties[]=numberOfPictures&properties[]=results_date&properties[organization][]=users&properties[]=theme&properties[]=id&properties[]=consultation_count`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: _controller?.signal,
            }
        )
            .then(res => res.json())
            .then(async data => {
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                console.debug(data);
                setCompetitions(data['hydra:member']);
                setPaginationOptions(data['hydra:pagination']);
                return data['hydra:member'];
            })
            .catch(error => {
                console.error(error);
                throw error;
            });
    }

    useEffect(() => {
        const controller = new AbortController();
        const promise = Promise.all([
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
                <Pagination
                    items={competitions}
                    totalPageCount={paginationOptions['Max-Page']}
                    defaultCurrentPage={page}
                    defaultItemPerPage={itemsPerPage}
                    renderItem={function (competition) {
                        const organizer = competition.organization?.users.map(
                            user => user.firstname + ' ' + user.lastname || null
                        );
                        const themes = competition?.theme.map(
                            item => item.label
                        );
                        const state = competition.state
                            ? 'En cours'
                            : 'Terminé';
                        return (
                            <Card
                                onClick={() => { navigate(`/competition/${competition.id}`) }
                                }
                                idContent={competition.id}
                                title={competition.competition_name}
                                imagePath={competition.competition_visual.path}
                                filters={[
                                    ...organizer,
                                    ...themes,
                                    competition.state ? 'En cours' : 'Terminé',
                                ].filter(i => i !== null)}
                                stats={[
                                    {
                                        name: competition.numberOfParticipants,
                                        icon: 'user-plus',
                                    },
                                    {
                                        name: competition.numberOfPictures,
                                        icon: 'camera',
                                    },
                                    {
                                        name: competition.numberOfVotes,
                                        icon: 'like',
                                    },
                                ]}
                                finalDate={new Date(
                                    competition.results_date
                                ).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                                orientation={
                                    cardDisposition === 'grid'
                                        ? 'vertical'
                                        : 'horizontal'
                                }
                            />
                        );
                    }}
                    onPageChange={function (changedPage) {
                        setPage(changedPage);
                    }}
                    onItemsPerPageChange={function (changedItemsPerPage) {
                        setItemsPerPage(changedItemsPerPage);
                    }}
                >
                    {(page, { pageCurrent }) => {
                        return (
                            <div>
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
                                                onClick={e =>
                                                    setCardDisposition('grid')
                                                }
                                            />
                                            <Icon
                                                className={style.homeIcon}
                                                icon="list"
                                                size={30}
                                                onClick={e =>
                                                    setCardDisposition('list')
                                                }
                                            />
                                            <Icon icon="map" size={30} />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <Loader
                                        active={cardLoading}
                                        takeInnerContent={true}
                                        style={{ borderRadius: '10px' }}
                                    >
                                        {page.length === 0 ? (
                                            pageCurrent === 1 ? (
                                                <div
                                                    style={{
                                                        height: '250px',
                                                        display: 'flex',
                                                        justifyContent:
                                                            'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <h3>not found</h3>
                                                </div>
                                            ) : (
                                                <div
                                                    style={{
                                                        height: '250px',
                                                        display: 'flex',
                                                        justifyContent:
                                                            'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <h3>
                                                        page {pageCurrent} not
                                                        found
                                                    </h3>
                                                </div>
                                            )
                                        ) : (
                                            <div
                                                className={
                                                    style.homeLastCompetition
                                                }
                                            >
                                                <div>
                                                    {page.length !== 0 ? (
                                                        page
                                                    ) : (
                                                        <h1>not found</h1>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </Loader>
                                </div>
                            </div>
                        );
                    }}
                </Pagination>
            </div>
        </Loader>
    );
}
