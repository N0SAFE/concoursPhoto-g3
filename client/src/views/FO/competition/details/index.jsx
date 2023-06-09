import style from './style.module.scss';
import Loader from '@/components/atoms/Loader/index.jsx';
import { useEffect, useState } from 'react';
import useApiFetch from '@/hooks/useApiFetch.js';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Pagination from '@/components/molecules/Pagination/index.jsx';
import Card from '@/components/molecules/Card/index.jsx';
import Input from '@/components/atoms/Input/index.jsx';
import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';
import { toast } from 'react-toastify';
import Slider from 'react-slider';
import { format, set } from 'date-fns';
import useLocation from '@/hooks/useLocation';

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
    const { getCityByName, getDepartmentByName, getRegionByName } =
        useLocation();
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
    const [filter, setFilter] = useState({
        themes: [],
        participants: [],
        selectedAge: [0, 100],
        elasticSearch: '',
        isActive: null,
        regions: [],
        departments: [],
    });
    const [elasticSearch, setElasticSearch] = useState('');
    const [filterPossibilities, setFilterPossibilities] = useState({
        themes: [],
        participants: [],
    });

    const [locationPossibility, setLocationPossibility] = useState({
        regions: { isLoading: true, data: [] },
        departments: { isLoading: true, data: [] },
    });
    const updateLocationPossibility = (key, { data, isLoading } = {}) => {
        if (isLoading !== undefined) {
            locationPossibility[key].isLoading = isLoading;
        }
        if (data !== undefined) {
            locationPossibility[key].data = data.map(item => ({
                label: item.nom,
                value: item.code,
            }));
        }
        setLocationPossibility({ ...locationPossibility });
    };

    const toggleSubMenu = () => {
        setIsSubMenuActif(!isSubMenuActif);
    };
    useEffect(() => {
        console.debug('useEffect');
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
    }, [page, itemsPerPage, filter]);

    useEffect(() => {
        const controller = new AbortController();
        Promise.all([
            getRegionByName(null, { controller }),
            getDepartmentByName(null, { controller }),
        ]).then(([regions, departments]) => {
            console.debug({ regions, departments });
            return setLocationPossibility({
                regions: {
                    isLoading: false,
                    data: regions.map(d => ({ label: d.nom, value: d.code })),
                },
                departments: {
                    isLoading: false,
                    data: departments.map(d => ({
                        label: d.nom,
                        value: d.code,
                    })),
                },
            });
        });
        return () => {
            setTimeout(() => controller?.abort());
        };
    }, []);

    function getThemesPossiblities(controller) {
        return apiFetch(`/themes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller?.signal,
        })
            .then(res => res.json())
            .then(data => {
                console.debug(data);
                return data['hydra:member'].map(theme => {
                    return {
                        value: theme['@id'],
                        label: theme.label,
                    };
                });
            });
    }
    function getParticipantsPossiblities(controller) {
        return apiFetch(`/participant_categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller?.signal,
        })
            .then(res => res.json())
            .then(data => {
                console.debug(data);
                return data['hydra:member'].map(participant => {
                    return {
                        value: participant['@id'],
                        label: participant.label,
                    };
                });
            });
    }

    function getListCompetition() {
        const pageToLoad = page === null ? DEFAULT_PAGE : page;
        const itemsPerPageToLoad =
            itemsPerPage === null ? DEFAULT_ITEMS_PER_PAGE : itemsPerPage;
        controller?.abort();
        const _controller = new AbortController();
        setController(_controller);
        const isActive = filter.isActive;
        const currentDate = format(new Date(), 'yyyy-MM-dd');
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
                    'theme',
                    'organizers',
                    'resultsDate'
                ],
                groups: [
                    'file:read',
                    'competition:read',
                    'competition:competitionVisual:read',
                    'competition:theme:read',
                    'theme:read',
                    'user:read',
                ],
                and: {
                    and: [
                        {
                            or: {
                                regionCriteria: filter.regions.map(
                                    r => r.value
                                ),
                                departmentCriteria: filter.departments.map(
                                    d => d.value
                                ),
                            },
                        },
                        {
                            or: {
                                competitionName: filter.elasticSearch,
                                'theme.label': filter.elasticSearch,
                                'participantCategory.label':
                                    filter.elasticSearch,
                            },
                        },
                    ],
                    theme: filter.themes.map(t => t.value),
                    participantCategory: filter.participants.map(p => p.value),
                    minAgeCriteria: {
                        gte: filter.selectedAge[0],
                    },
                    maxAgeCriteria: {
                        lte: filter.selectedAge[1],
                    },

                    ...(isActive === null
                        ? {}
                        : isActive === true
                        ? {
                              resultsDate: { after: currentDate },
                              creationDate: { before: currentDate },
                          }
                        : {
                              or: {
                                  resultsDate: { before: currentDate },
                                  creationDate: { after: currentDate },
                              },
                          }),
                },
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
    useEffect(() => {
        const controller = new AbortController();
        const promise = Promise.all([
            getThemesPossiblities(controller),
            getParticipantsPossiblities(controller),
        ]).then(([themes, participants]) => {
            setFilterPossibilities({
                themes,
                participants,
            });
        });

        toast.promise(promise, {
            pending: 'Chargement des filtres...',
            success: 'Filtres chargés !',
            error: 'Impossible de charger les filtres',
        });

        return () => {
            setTimeout(() => controller?.abort());
        };
    }, []);

    return (
        <Loader active={isLoading}>
            <div className={style.searchContainer}>
                <div className={style.searchBanner}>
                    <div>
                        <h1>Rechercher un concours</h1>
                    </div>
                </div>
                <div className={style.searchBar}>
                    <div className={style.searcher}>
                        <div className={style.searcherIcon}>
                            <Icon icon={'search'} />
                        </div>
                        <Input
                            type="text"
                            name="recherche"
                            placeholder="Nom du concours, thème, catégorie..."
                            onChange={v => {
                                setElasticSearch(v);
                            }}
                        />
                        <Button
                            onClick={() => {
                                setFilter({
                                    ...filter,
                                    elasticSearch: elasticSearch,
                                });
                            }}
                        >
                            Rechercher
                        </Button>
                    </div>
                    <Input
                        className={style.searchBarSelect}
                        type="select"
                        placeholder="Themes : "
                        defaultValue={[]}
                        extra={{
                            options: filterPossibilities.themes,
                            isMulti: true,
                            closeMenuOnSelect: false,
                        }}
                        onChange={t => {
                            console.log(t);
                            setFilter({
                                ...filter,
                                themes: t,
                            });
                        }}
                    />
                    <Input
                        className={style.searchBarSelect}
                        type="select"
                        defaultValue={{ value: null, label: 'Tous' }}
                        extra={{
                            options: [
                                { value: null, label: 'Tous' },
                                { value: true, label: 'actif' },
                                { value: false, label: 'inactif' },
                            ],
                        }}
                        onChange={t => {
                            console.log(t);
                            setFilter({
                                ...filter,
                                isActive: t.value,
                            });
                        }}
                    />
                    <div className={style.searchBarButton}>
                        <Button
                            onClick={toggleSubMenu}
                        >
                            Critères
                            <div className={style.searchBarIconCriteria}>
                                <Icon
                                    icon={'arrow-thin-down'}
                                    style={{
                                        transform: isSubMenuActif
                                            ? 'rotate(-180deg)'
                                            : 'none',
                                        transitionDuration: '0.5s',
                                    }}
                                />
                            </div>
                        </Button>
                    </div>
                </div>
                <div className={style.searchSubMenu}
                    style={{
                        display: isSubMenuActif ? 'flex' : 'none',
                    }}
                >
                    <div className={style.searchRow}>
                        <Input
                            className={style.searchBarSelect}
                            type="select"
                            label="Pays"
                            extra={{
                                options: [{ value: 'France', label: 'France' }],
                            }}
                            defaultValue={{ value: 'France', label: 'France' }}
                        />
                        <Input
                            className={style.searchBarSelect}
                            type="select"
                            label="Région"
                            extra={{
                                isLoading: locationPossibility.regions.loading,
                                clearable: true,
                                options: locationPossibility.regions.data,
                                isMulti: true,
                                closeMenuOnSelect: false,
                                onInputChange: (name, { action }) => {
                                    if (action === 'input-change') {
                                        getRegionByName(name).then(function (
                                            p
                                        ) {
                                            updateLocationPossibility(
                                                'regions',
                                                { data: p }
                                            );
                                        });
                                    }
                                    if (action === 'menu-close') {
                                        updateLocationPossibility('regions', {
                                            loading: true,
                                        });
                                        getRegionByName().then(function (p) {
                                            updateLocationPossibility(
                                                'regions',
                                                { data: p, loading: false }
                                            );
                                        });
                                    }
                                },
                            }}
                            onChange={t => {
                                setFilter({
                                    ...filter,
                                    regions: t,
                                });
                            }}
                        />
                        <Input
                            className={style.searchBarSelect}
                            type="select"
                            label="Département"
                            extra={{
                                isLoading:
                                    locationPossibility.departments.loading,
                                clearable: true,
                                options: locationPossibility.departments.data,
                                isMulti: true,
                                closeMenuOnSelect: false,
                                onInputChange: (name, { action }) => {
                                    if (action === 'input-change') {
                                        getDepartmentByName(name).then(
                                            function (p) {
                                                updateLocationPossibility(
                                                    'departments',
                                                    { data: p }
                                                );
                                            }
                                        );
                                    }
                                    if (action === 'menu-close') {
                                        updateLocationPossibility(
                                            'departments',
                                            { loading: true }
                                        );
                                        getDepartmentByName().then(function (
                                            p
                                        ) {
                                            updateLocationPossibility(
                                                'departments',
                                                { data: p, loading: false }
                                            );
                                        });
                                    }
                                },
                            }}
                            onChange={d => {
                                setFilter({
                                    ...filter,
                                    departments: d,
                                });
                            }}
                        />
                        <Input
                            className={style.searchBarSelect}
                            type="select"
                            label="Catégorie"
                            extra={{
                                options: filterPossibilities.participants,
                                isMulti: true,
                                closeMenuOnSelect: false,
                            }}
                            onChange={t => {
                                console.log(t);
                                setFilter({
                                    ...filter,
                                    participants: t,
                                });
                            }}
                        />
                        <div className={style.searchBarSlider}>
                            <label>Âge</label>
                            <Slider
                                value={filter.selectedAge}
                                className={style.slider}
                                renderThumb={(props, state) => (
                                    <div
                                        {...props}
                                        style={{
                                            ...props.style,
                                            transform:
                                                state.index === 1
                                                    ? 'translateX(-10px)'
                                                    : '',
                                        }}
                                    >
                                        {state.valueNow}
                                    </div>
                                )}
                                pearling
                                min={0}
                                max={100}
                                ariaValuetext={state =>
                                    `Thumb value ${state.valueNow}`
                                }
                                renderTrack={props => (
                                    <div {...props} className={style.sliderTrack} />
                                )}
                                minDistance={1}
                                withTracks
                                onAfterChange={value => {
                                    setFilter({
                                        ...filter,
                                        selectedAge: value,
                                    });
                                }}
                            />
                        </div>
                        <Input className={style.searchBarSelect} type="select" name="" label="Prix/Dotation" />
                    </div>
                </div>
                <Pagination
                    items={competition}
                    totalPageCount={paginationOptions['Max-Page']}
                    defaultCurrentPage={page}
                    defaultItemPerPage={itemsPerPage}
                    isLoading={cardLoading}
                    renderItem={function (competition) {
                        const organizer = competition.organizers.map(
                            user => user.firstname + ' ' + user.lastname || null
                        );
                        const themes = competition?.theme.map(
                            item => item.label
                        );
                        return (
                            <Card
                                idContent={competition.id}
                                onClick={() => {
                                    navigate(`/competition/${competition.id}`);
                                }}
                                title={competition.competitionName}
                                imagePath={competition.competitionVisual.path}
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
                                    competition.resultsDate
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
                                <div className={style.searchDisposition}>
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
                                <div className={style.searchList}>
                                    <Loader
                                        active={cardLoading}
                                        takeInnerContent={true}
                                        style={{ borderRadius: '10px' }}
                                    >
                                        {page.length === 0 ? (
                                            pageCurrent === 1 ? (
                                                <div className={style.searchListNotFound}>
                                                    <h3>not found</h3>
                                                </div>
                                            ) : (
                                                <div className={style.searchListPageNotFound}>
                                                    <h3>
                                                        page {pageCurrent} not
                                                        found
                                                    </h3>
                                                </div>
                                            )
                                        ) : (
                                            <div
                                                className={
                                                    style.searchLastCompetition
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
