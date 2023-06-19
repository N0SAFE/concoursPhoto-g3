import style from './style.module.scss';
import FOCompetitionList from '@/components/organisms/FO/FOCompetitionList';
import FOStats from '@/components/organisms/FO/FOStats';
import FOPortalList from '@/components/organisms/FO/FOPortalList';
import Loader from '@/components/atoms/Loader/index.jsx';
import { useEffect, useState } from 'react';
import useApiFetch from '@/hooks/useApiFetch.js';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Pagination from '@/components/molecules/Pagination/index.jsx';
import Card from '@/components/molecules/Card/index.jsx';
import Input from '@/components/atoms/Input/index.jsx';
import Dropdown from '@/components/atoms/Dropdown';
import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';

const DEFAULT_PAGE = 1;
const DEFAULT_ITEMS_PER_PAGE = 9;

export default function ListCompetition() {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [isSubMenuActif, setIsSubMenuActif] = useState(false);
    const [stats, setStats] = useState({});
    const apiFetch = useApiFetch();
    const [competition, setCompetition] = useState([]);
    const [totalitems, setTotalItems] = useState(0);
    const [paginationOptions, setPaginationOptions] = useState({});
    const [searchParams, setSearchParams] = useSearchParams({});
    const [page, setPage] = useState(
        isNaN(parseInt(searchParams.get('page'))) ||
            searchParams.get('page') < 1
            ? DEFAULT_PAGE
            : parseInt(searchParams.get('page'))
    );
    const [itemsPerPage, setItemsPerPage] = useState(
        isNaN(parseInt(searchParams.get('itemsPerPage'))) ||
            searchParams.get('itemsPerPage') < 1
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

    const toggleSubMenu = () => {
        setIsSubMenuActif(!isSubMenuActif);
    };
    useEffect(() => {
        setSearchParams({
            page: page || DEFAULT_PAGE,
            itemsPerPage: itemsPerPage || DEFAULT_ITEMS_PER_PAGE,
        });
        setCardLoading(true);
        getListCompetition().then(() => {
            setCardLoading(false);
            setIsLoading(false);
        });
        return () => {
            setTimeout(() => controller?.abort());
        };
    }, [page, itemsPerPage]);

    function getListCompetition() {
        const now = new Date();
        const pageToLoad = page === null ? DEFAULT_PAGE : page;
        const itemsPerPageToLoad =
            itemsPerPage === null ? DEFAULT_ITEMS_PER_PAGE : itemsPerPage;
        controller?.abort();
        const _controller = new AbortController();
        setController(_controller);
        return apiFetch(`/competitions`, {
            query: {
                page: pageToLoad,
                itemsPerPage: itemsPerPageToLoad,
                properties: [
                    'competitionName',
                    'competitionVisual',
                    'consultationCount',
                    'numberOfVotes',
                    'numberOfParticipants',
                    'numberOfPictures',
                    'id',
                ],
                groups: [
                    'file:read',
                    'competition:read',
                    'competition:competitionVisual:read',
                ],
            },
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: _controller?.signal,
        })
            .then(res => res.json())
            .then(async data => {
                if (data.code === 401) {
                    throw new Error(data.message);
                }
                console.debug(data);
                setCompetition(data['hydra:member']);
                setPaginationOptions(data['hydra:pagination']);
                setTotalItems(data['hydra:totalItems']);
                return data['hydra:member'];
            })
            .catch(error => {
                console.error(error);
                throw error;
            });
    }

    return (
        <Loader active={isLoading}>
            <div className={style.homeContainer}>
                <div className={style.homeBanner}>
                    <div>
                        <h1>Rechercher un concours</h1>
                    </div>
                </div>
                <div style={{ display: 'Flex', flexDirection: 'row' }}>
                    <Icon size="6%" icon={'search'} />
                    <Input
                        type="text"
                        name="recherche"
                        placeholder="Rechercher"
                    />

                    <Button
                        style={{
                            borderRadius: '5px',
                            border: '1px solid #000000',
                            padding: '5px',
                        }}
                    >
                        Rechercher
                    </Button>
                    <Input type="select" name="" label="" />
                    <Input type="select" name="" label="" />
                    <button
                        onClick={toggleSubMenu}
                        style={{
                            borderRadius: '5px',
                            border: '1px solid #000000',
                            padding: '5px',
                        }}
                    >
                        critères
                        <Icon
                            size="20%"
                            icon={'arrow-thin-down'}
                            style={{
                                transform: isSubMenuActif
                                    ? 'rotate(-180deg)'
                                    : 'none',
                                transitionDuration: '0.5s',
                            }}
                        />
                    </button>
                </div>
                <div
                    style={{
                        display: isSubMenuActif ? 'block' : 'none',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            display: 'Flex',
                            flexDirection: 'row',
                            backgroundColor: '#cccccc',
                            padding: '1%',
                        }}
                    >
                        <Input type="select" name="" label="Pays" />
                        <Input type="select" name="" label="Région" />
                        <Input type="select" name="" label="Département" />
                        <Input type="select" name="" label="Catégorie" />
                        <Input type="select" name="" label="Age" />
                        <Input type="select" name="" label="Prix/Dotation" />
                    </div>
                </div>
                <Pagination
                    items={competition}
                    totalPageCount={paginationOptions['Max-Page']}
                    defaultCurrentPage={page}
                    defaultItemPerPage={itemsPerPage}
                    isLoading={cardLoading}
                    renderItem={function (competition) {
                        return (
                            <Card
                                idContent={competition.id}
                                onClick={() => {
                                    navigate(`/competition/${competition.id}`);
                                }}
                                title={competition.competitionName}
                                imagePath={competition.competitionVisual.path}
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
                                        <h2>{totalitems} résultats</h2>
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
