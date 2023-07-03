import Button from '@/components/atoms/Button/index.jsx';
import Chip from '@/components/atoms/Chip/index.jsx';
import Loader from '@/components/atoms/Loader/index.jsx';
import Pagination from '@/components/molecules/Pagination/index.jsx';
import Table from '@/components/molecules/Table/index.jsx';
import { useModal } from '@/contexts/ModalContext/index.jsx';
import useApiFetch from '@/hooks/useApiFetch.js';
import { useEffect, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';

export default function MyorganizationAdvertising() {
    const apiFetch = useApiFetch();
    const [searchParams, setSearchParams] = useSearchParams({});
    const { showModal, setModalContent } = useModal();
    const { idOrganisation, selectedOrganisation } = useOutletContext();
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [data, setData] = useState({
        member: [],
        paginationOptions: {},
        totalItems: 0,
    });
    const [pageLoading, setPageLoading] = useState(true);
    const [controller, setController] = useState(new AbortController());

    const getAdvertising = async (page, itemsPerPage) => {
        setPageLoading(true);
        apiFetch('/rents', {
            method: 'GET',
            query: {
                page: page,
                itemsPerPage: itemsPerPage,
                'organization.rents': `/organizations/${idOrganisation}`,
                groups: [
                    'rent:organization:read',
                    'organization:read',
                    'rent:advertising:read',
                    'advertising:read',
                    'advertisingSpace:read',
                ],
            },
            signal: controller.signal,
        })
            .then(r => r.json())
            .then(r => {
                setData({
                    member: r['hydra:member'],
                    paginationOptions: {
                        maxPage: r['hydra:pagination']['Max-Page'],
                    },
                    totalItems: r['hydra:totalItems'],
                });
                setPageLoading(false);
                console.log(r);
            });
    };

    if (isNaN(idOrganisation)) {
        return <div>the idOrganisation is not a number</div>;
    }

    useEffect(() => {
        getAdvertising(page, itemsPerPage);
        return function () {
            setModalContent(null);
        };
    }, [page, itemsPerPage]);

    useEffect(() => {
        if (
            searchParams.get('edit') === 'true' &&
            !isNaN(parseInt(searchParams.get('id')))
        ) {
            setModalContent(<div>edit admin</div>);
            showModal(function () {
                delete searchParams.edit;
                delete searchParams.id;
                setSearchParams({ ...searchParams });
            });
        }
        if (searchParams.get('create') === 'true') {
            setModalContent(<div>add admin</div>);
            showModal(function () {
                delete searchParams.create;
                setSearchParams({ ...searchParams });
            });
        }
    }, [searchParams]);

    return (
        <>
            <Pagination
                defaultCurrentPage={page}
                defaultItemPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
                onPageChange={setPage}
                totalPageCount={data?.paginationOptions?.maxPage}
                items={data?.member}
                onChange={function () {
                    controller?.abort();
                    setController(new AbortController());
                }}
            >
                {data => {
                    return (
                        <Loader
                            active={pageLoading}
                            takeInnerContent={true}
                            style={{ borderRadius: '10px' }}
                        >
                            <Table
                                list={data}
                                fields={[
                                    'Nom de l’emplacement de la publicité',
                                    'Début',
                                    'Fin',
                                    'Statut',
                                    'Affichages',
                                    'Clics'
                                ]}
                                onLineClick={function (competition) {
                                    setSearchParams({
                                        ...searchParams,
                                        edit: true,
                                        id: competition.id,
                                    });
                                }}
                            >
                                {advertising => {
                                    const stateColor = (function () {
                                        switch (advertising.state) {
                                            case 1:
                                                return '#FFA800';
                                            case 2:
                                                return '#FF0000';
                                            case 3:
                                                return '#2FB6AE';
                                            case 4:
                                                return '#00A3FF';
                                            case 5:
                                                return '#00CE3A';
                                            case 6:
                                                return '#F1F1F1';
                                            case 7:
                                                return '#A8A8A8';
                                            default:
                                                return '#A8A8A8';
                                        }
                                    })();
                                    return [
                                        {
                                            content:
                                                advertising.altTag,
                                        },
                                        {
                                            content: new Date(
                                                advertising.startDate
                                            ).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'numeric',
                                                day: 'numeric',
                                            }),
                                        },
                                        {
                                            content: new Date(
                                                advertising.endDate
                                            ).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'numeric',
                                                day: 'numeric',
                                            }),
                                        },
                                        {
                                            content: (
                                                <Chip
                                                    backgroundColor={stateColor}
                                                >
                                                    {advertising.stateLabel}
                                                </Chip>
                                            ),
                                        },
                                        {
                                            content: advertising.views,
                                        },
                                        {
                                            content: advertising.numberOfClicks,
                                        }
                                    ];
                                }}
                            </Table>
                        </Loader>
                    );
                }}
            </Pagination>

            <div
                style={{ width: '100%', display: 'flex', flexDirection: 'row' }}
            >
                <Button
                    onClick={() => {
                        setSearchParams({
                            ...searchParams,
                            create: true,
                        });
                    }}
                    style={{
                        marginTop: '1rem',
                        padding: '1rem 1.5rem',
                        borderRadius: '2rem',
                    }}
                >
                    Ajouter une publicité
                </Button>
            </div>
        </>
    );
}
