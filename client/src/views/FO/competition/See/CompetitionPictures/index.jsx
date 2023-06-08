import { useOutletContext } from 'react-router-dom';
import style from './style.module.scss';
import Chip from '@/components/atoms/Chip';
import Navlink from '@/components/molecules/Navlink';
import Pagination from '@/components/molecules/Pagination/index.jsx';
import { useEffect, useState } from 'react';
import useApiFetch, { queryListSymbol } from '@/hooks/useApiFetch.js';
import Loader from '@/components/atoms/Loader/index.jsx';
import useApiPath from '@/hooks/useApiPath.js';
import Picture from '@/components/atoms/Picture/index.jsx';

export default function () {
    const apiPath = useApiPath();
    const { competition } = useOutletContext();
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const apiFetch = useApiFetch();
    const [pictures, setPictures] = useState([]); // pictures = competition.pictures
    const [paginationOptions, setPaginationOptions] = useState({}); // paginationOptions = competition.paginationOptions
    const [totalItems, setTotalItems] = useState(0); // totalItems = competition.totalItems
    const [controller, setController] = useState(new AbortController());
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const getPictures = async (page, itemsPerPage) => {
        setIsPageLoading(true);
        return await apiFetch(`/pictures`, {
            query: {
                page: page,
                itemsPerPage: itemsPerPage,
                competition: `/competitions/${competition.id}`,
                groups: [
                    'user:read',
                    'picture:user:read',
                    'picture:file:read',
                    'file:read',
                ],
                properties: {
                    user: ['lastname', 'firstname'],
                    file: ['path', 'pictureName'],
                },
            },
            method: 'GET',
            params: {
                page,
                itemsPerPage,
            },
        })
            .then(r => r.json())
            .then(r => {
                setPictures(r['hydra:member']);
                setPaginationOptions({
                    maxPage: r['hydra:pagination']['Max-Page'],
                });
                setTotalItems(r['hydra:totalItems']);

                setIsPageLoading(false);
                setIsLoading(false);
            });
    };

    const competitionRouteList = [
        { content: 'Le concours', to: '' },
        { content: 'Règlement', to: '/rules' },
        { content: 'Prix à gagner', to: '/endowments' },
        { content: 'Membres du Jury', to: '/jury' },
        { content: 'Les photos', to: '/pictures' },
        { content: 'Résultats', to: '/results' },
    ];

    useEffect(() => {
        getPictures(page, itemsPerPage);
    }, [page, itemsPerPage]);

    return (
        <div className={style.pictures}>
            <Navlink base="/competition/:id" list={competitionRouteList} />
            <Loader
                active={isLoading}
                takeInnerContent={true}
                style={{
                    borderRadius: '10px',
                    minHeight: '600px',
                }}
            >
                <h2>
                    {competition.numberOfPictures} photos soumises par{' '}
                    {competition.numberOfParticipants} photographes
                </h2>
                <Pagination
                    items={pictures}
                    defaultCurrentPage={page}
                    defaultItemPerPage={itemsPerPage}
                    onChange={function () {
                        controller?.abort();
                        setController(new AbortController());
                    }}
                    totalPageCount={paginationOptions?.maxPage}
                    onItemsPerPageChange={setItemsPerPage}
                    onPageChange={setPage}
                >
                    {pictures => {
                        return (
                            <Loader
                                active={isPageLoading}
                                takeInnerContent={true}
                                style={{
                                    borderRadius: '10px',
                                    minHeight: '600px',
                                }}
                            >
                                {pictures && (
                                    <div className={style.picturesContainer}>
                                        {pictures.map(picture => (
                                            <div
                                                key={picture.id}
                                                className={
                                                    style.picturesContainerItems
                                                }
                                            >
                                                <div>
                                                    <Picture
                                                        src={apiPath(
                                                            picture.file.path
                                                        )}
                                                        alt={
                                                            picture.pictureName
                                                        }
                                                        photographer={picture.user}
                                                    />
                                                </div>
                                                <div
                                                    className={
                                                        style.picturesStats
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            style.picturesStatsTags
                                                        }
                                                    >
                                                        <Chip
                                                            backgroundColor={
                                                                '#F5F5F5'
                                                            }
                                                            icon={'user-plus'}
                                                        >
                                                            {
                                                                picture.user
                                                                    .firstname
                                                            }{' '}
                                                            {
                                                                picture.user
                                                                    .lastname
                                                            }
                                                        </Chip>
                                                    </div>
                                                    <div
                                                        className={
                                                            style.picturesActions
                                                        }
                                                    >
                                                        <Chip
                                                            backgroundColor={
                                                                '#F5F5F5'
                                                            }
                                                            icon={'shutter'}
                                                        >
                                                            {
                                                                competition.consultationCount
                                                            }
                                                        </Chip>
                                                        <Chip
                                                            iconColor={'white'}
                                                            color={'white'}
                                                            backgroundColor={
                                                                '#A8A8A8'
                                                            }
                                                            icon={'like'}
                                                        >
                                                            Voter
                                                        </Chip>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Loader>
                        );
                    }}
                </Pagination>
            </Loader>
        </div>
    );
}
