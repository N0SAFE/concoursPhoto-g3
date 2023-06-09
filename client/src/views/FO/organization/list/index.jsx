import style  from './style.module.scss';
import Loader from '@/components/atoms/Loader/index.jsx';
import { useEffect, useState } from 'react';
import useApiFetch from '@/hooks/useApiFetch.js';
import Icon from '@/components/atoms/Icon/index.jsx';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Pagination from '@/components/molecules/Pagination/index.jsx';
import Card from '@/components/molecules/Card/index.jsx';
import Button from '@/components/atoms/Button/index.jsx';
import Input from '@/components/atoms/Input/index.jsx';
import useLocation from '@/hooks/useLocation';

const DEFAULT_PAGE = 1;
const DEFAULT_ITEMS_PER_PAGE = 9;

export default function ListOrganization() {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [stats, setStats] = useState({});
    const apiFetch = useApiFetch();
    const [organization, setOrganization] = useState([]);
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
    const [elasticSearch, setElasticSearch] = useState('');
    const [filter, setFilter] = useState({
        elasticSearch: '',
        regions: [],
        departments: [],
        state: null,
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

    useEffect(() => {
        setSearchParams({
            page: page || DEFAULT_PAGE,
            itemsPerPage: itemsPerPage || DEFAULT_ITEMS_PER_PAGE,
        });
        setCardLoading(true);
        getListOraganization().then(() => {
            setCardLoading(false);
            setIsLoading(false);
        });
        return () => {
            setTimeout(() => controller?.abort());
        };
    }, [page, itemsPerPage, filter]);

    async function getListOraganization() {
        const cities = await getCityByName(elasticSearch, { limit: 60 });
        console.debug(cities);
        const now = new Date();
        const pageToLoad = page === null ? DEFAULT_PAGE : page;
        const itemsPerPageToLoad =
            itemsPerPage === null ? DEFAULT_ITEMS_PER_PAGE : itemsPerPage;
        controller?.abort();
        const _controller = new AbortController();
        setController(_controller);
        return apiFetch(`/organizations`, {
            query: {
                page: pageToLoad,
                itemsPerPage: itemsPerPageToLoad,
                properties: [
                    'organizerName',
                    'organizationVisual',
                    'activeCompetitionCount',
                    'id',
                ],
                groups: ['file:read', 'organization:organizationVisual:read'],
                and: {
                    organizerName: elasticSearch,
                    and: {
                        or: [
                            {
                                regionCriteria: filter.regions.map(
                                    r => r.value
                                ),
                            },
                            {
                                departmentCriteria: filter.departments.map(
                                    d => d.value
                                ),
                            },
                        ],
                        ...(filter.state !== null && { state: filter.state }),
                    },
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
                setOrganization(data['hydra:member']);
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
            <div className={style.searchContainer}>
                <div className={style.searchBanner}>
                    <div>
                        <h1>Rechercher un organisateur de concours</h1>
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
                            placeholder="Nom de l'organisation, ville..."
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
                        placeholder="Région"
                        extra={{
                            isLoading: locationPossibility.regions.loading,
                            clearable: true,
                            options: locationPossibility.regions.data,
                            isMulti: true,
                            closeMenuOnSelect: false,
                            onInputChange: (name, { action }) => {
                                if (action === 'input-change') {
                                    getRegionByName(name).then(function (p) {
                                        updateLocationPossibility('regions', {
                                            data: p,
                                        });
                                    });
                                }
                                if (action === 'menu-close') {
                                    updateLocationPossibility('regions', {
                                        loading: true,
                                    });
                                    getRegionByName().then(function (p) {
                                        updateLocationPossibility('regions', {
                                            data: p,
                                            loading: false,
                                        });
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
                        name="department"
                        placeholder="Département"
                        extra={{
                            isLoading: locationPossibility.departments.loading,
                            clearable: true,
                            options: locationPossibility.departments.data,
                            isMulti: true,
                            closeMenuOnSelect: false,
                            onInputChange: (name, { action }) => {
                                if (action === 'input-change') {
                                    getDepartmentByName(name).then(function (
                                        p
                                    ) {
                                        updateLocationPossibility(
                                            'departments',
                                            { data: p }
                                        );
                                    });
                                }
                                if (action === 'menu-close') {
                                    updateLocationPossibility('departments', {
                                        loading: true,
                                    });
                                    getDepartmentByName().then(function (p) {
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
                        defaultValue={{ value: null, label: 'Tous' }}
                        extra={{
                            options: [
                                { value: null, label: 'Tous' },
                                { value: 1, label: 'Actif' },
                                { value: 0, label: 'Inactif' },
                            ],
                        }}
                        onChange={t => {
                            console.log(t);
                            setFilter({
                                ...filter,
                                state: t.value,
                            });
                        }}
                    />
                </div>
                <Pagination
                    items={organization}
                    totalPageCount={paginationOptions['Max-Page']}
                    defaultCurrentPage={page}
                    defaultItemPerPage={itemsPerPage}
                    isLoading={cardLoading}
                    renderItem={function (organization) {
                        return (
                            <Card
                                idContent={organization.id}
                                onClick={() => {
                                    navigate(
                                        `/organization/${organization.id}`
                                    );
                                }}
                                title={organization.organizerName}
                                imagePath={organization.organizationVisual.path}
                                stats={[
                                    {
                                        name:
                                            organization.activeCompetitionCount +
                                            ' concours actifs',
                                        icon: 'shutter',
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
                                <div className={style.searchDisposition}>
                                    <div>
                                        <h2>{totalitems} résultats</h2>
                                    </div>
                                    <div>
                                        <div>
                                            <Icon
                                                className={style.searchIcon}
                                                icon="grid"
                                                size={30}
                                                onClick={e =>
                                                    setCardDisposition('grid')
                                                }
                                            />
                                            <Icon
                                                className={style.searchIcon}
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
                                                    style.searchLastOrganization
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
