import {useNavigate, useOutletContext, useSearchParams} from "react-router-dom";
import Card from "@/components/molecules/Card/index.jsx";
import style from "@/views/FO/organization/list/style.module.scss";
import Icon from "@/components/atoms/Icon/index.jsx";
import Pagination from "@/components/molecules/Pagination/index.jsx";
import {useState, useEffect} from "react";
import { format } from 'date-fns';

export default function CompetitionEnded() {
    const DEFAULT_PAGE = 1;
    const DEFAULT_ITEMS_PER_PAGE = 9;

    const { organization } = useOutletContext();
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
    const [controller, setController] = useState();
    const [cardDisposition, setCardDisposition] = useState('grid');
    const navigate = useNavigate();
    const now = new Date();
    const [totalitems, setTotalItems] = useState(0);

    useEffect(() => {
        const total = organization.competitions.reduce((count, competition) => {
            if (format(new Date(competition.resultsDate), 'yyyy-MM-dd') <= format(now, 'yyyy-MM-dd')) {
                count++;
            }
            return count;
        }, 0);

        setTotalItems(total);
    }, [organization.competitions, now]);

    useEffect(() => {
        setSearchParams({
            page: page || DEFAULT_PAGE,
            itemsPerPage: itemsPerPage || DEFAULT_ITEMS_PER_PAGE,
        });
        return () => {
            setTimeout(() => controller?.abort());
        };
    }, [page, itemsPerPage]);

    return (
        <div>
            <Pagination
                items={organization.competitions}
                totalPageCount={paginationOptions['Max-Page']}
                defaultCurrentPage={page}
                defaultItemPerPage={itemsPerPage}
                renderItem={function (competition) {
                    const organizer = competition.organizers.map(
                        user => user.firstname + ' ' + user.lastname || null
                    );
                    const themes = competition?.theme.map(
                        item => item.label
                    );
                    if (format(new Date(competition.resultsDate), 'yyyy-MM-dd') <= format(now, 'yyyy-MM-dd')) {
                        return (
                            <Card
                                idContent={competition.id}
                                onClick={() => {
                                    navigate(
                                        `/competition/${competition.id}`
                                    );
                                }}
                                title={competition.competitionName}
                                imagePath={competition.competitionVisual?.path}
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
                    }
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
                                <div>
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
                                </div>
                            </div>
                        </div>
                    );
                }}
            </Pagination>
        </div>
    )
}