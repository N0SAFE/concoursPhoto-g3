import Button from '@/components/atoms/Button/index.jsx';
import Loader from '@/components/atoms/Loader/index.jsx';
import Pagination from '@/components/molecules/Pagination/index.jsx';
import Table from '@/components/molecules/Table/index.jsx';
import { useModal } from '@/contexts/ModalContext/index.jsx';
import useApiFetch from '@/hooks/useApiFetch.js';
import { useEffect, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';

export default function MyorganizationAdmin() {
    const apiFetch = useApiFetch()
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
    
    const getAdmin = async (page, itemsPerPage) => {
        setPageLoading(true);
        apiFetch('/users', {
            method: 'GET',
            query: {
                Manage: '/organizations/' + idOrganisation,
                page: page,
                itemsPerPage: itemsPerPage,
                groups: ['user:manage:read'],
            },
            signal: controller.signal,
        }).then(r => r.json())
            .then(r => {
                setData({
                    member: r['hydra:member'],
                    paginationOptions: {
                        maxPage: r['hydra:pagination']['Max-Page'],
                    },
                    totalItems: r['hydra:totalItems'],
                });
                setPageLoading(false);
                console.debug(r);
            });
    };
    
    useEffect(() => {
        getAdmin(page, itemsPerPage);
        return function () {
            setModalContent(null);
        };
    }, [page, itemsPerPage]);

    if (isNaN(idOrganisation)) {
        return <div>the idOrganisation is not a number</div>;
    }

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
                        <Loader active={pageLoading} takeInnerContent={true} style={{borderRadius: "10px"}}>
                            <Table
                                list={data}
                                fields={['Nom', 'Prenom', 'Fonction/poste']}
                                onLineClick={function (admin) {
                                    setSearchParams({
                                        ...searchParams,
                                        edit: true,
                                        id: admin.id,
                                    });
                                }}
                            >
                                {admin => {
                                    return [
                                        {
                                            content: admin.lastname,
                                        },
                                        {
                                            content: admin.firstname,
                                        },
                                        {
                                            content: admin.job,
                                        },
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
                    Ajouter un administrateur
                </Button>
            </div>
        </>
    );
}
