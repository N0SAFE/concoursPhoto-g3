import Chip from '@/components/atoms/Chip/index.jsx';
import Loader from '@/components/atoms/Loader/index.jsx';
import Pagination from '@/components/molecules/Pagination/index.jsx';
import Table from '@/components/molecules/Table/index.jsx';
import { useAuthContext } from '@/contexts/AuthContext.jsx';
import useApiFetch from '@/hooks/useApiFetch.js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function () {
    const navigate = useNavigate();
    const { me } = useAuthContext();
    const apiFetch = useApiFetch();

    const [data, setData] = useState({
        member: [],
        paginationOptions: {},
        totalItems: 0,
    });
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [controller, setController] = useState(new AbortController());

    const getOrganization = async (page, itemsPerPage) => {
        return await apiFetch(
            `/organizations/?page=${page}&itemsPerPage=${itemsPerPage}&users[]=${me['@id']}`,
            {
                method: 'GET',
                params: {
                    page,
                    itemsPerPage,
                },
                signal: controller.signal,
            }
        ).then(r => r.json());
    };

    useEffect(() => {
        setIsPageLoading(true);
        getOrganization(page, itemsPerPage).then(r => {
            setData({
                member: r['hydra:member'],
                paginationOptions: {
                    maxPage: r['hydra:pagination']['Max-Page'],
                },
                totalItems: r['hydra:totalItems'],
            });
            setIsPageLoading(false);
            setIsLoading(false);
        });
    }, [page, itemsPerPage]);

    return (
        <div>
            <Loader active={isLoading}>
                <p style={{fontWeight: 600}}>
                    Ce menu est destiné uniquement aux membres qui souhaitent
                    créer la fiche d’une ou plusieurs organisations qu’ils
                    représentent légalement pour publier un concours.
                </p>
                <p>
                    La création d’une fiche “organisation” est un préalable
                    indispensable pour créer ensuite un concours photo en son
                    nom.
                </p>
                <div style={{display: "flex", gap: "20px", flexDirection: "column", marginTop: "30px"}}>
                    <p style={{marginLeft: "10px"}}>
                        {data?.totalItems} organisations dont je suis l’un des
                        administrateurs
                    </p>
                    <Pagination
                        defaultCurrentPage={page}
                        defaultItemPerPage={itemsPerPage}
                        totalPageCount={data?.paginationOptions?.maxPage}
                        items={data?.member}
                        onItemsPerPageChange={setItemsPerPage}
                        onPageChange={setPage}
                        onChange={function () {
                            controller?.abort();
                            setController(new AbortController());
                        }}
                    >
                        {data => {
                            return (
                                <div>
                                    <Loader
                                        active={isPageLoading}
                                        takeInnerContent={true}
                                        style={{
                                            borderRadius: '1rem',
                                        }}
                                    >
                                        <Table
                                            list={data}
                                            fields={[
                                                'Nom',
                                                'Description',
                                                'Concours',
                                                'Administrateurs',
                                            ]}
                                            onLineClick={organization => {
                                                navigate(
                                                    '/profile/myorganization/' +
                                                        organization.id
                                                );
                                            }}
                                        >
                                            {organization => [
                                                {
                                                    content:
                                                        organization.organizer_name,
                                                    style: { flewGrow: 2 },
                                                },
                                                {
                                                    content:
                                                        organization.description,
                                                    style: { flewGrow: 1 },
                                                },
                                                {
                                                    content:
                                                        organization.competitionCount >
                                                        0 ? (
                                                            <Chip
                                                                title={
                                                                    organization.competitionCount
                                                                }
                                                                backgroundColor={
                                                                    '#00CE3A'
                                                                }
                                                                color={'white'}
                                                            />
                                                        ) : (
                                                            <Chip
                                                                title={0}
                                                                backgroundColor={
                                                                    'grey'
                                                                }
                                                            />
                                                        ),
                                                },
                                                {
                                                    content:
                                                        organization.userCount,
                                                },
                                            ]}
                                        </Table>
                                    </Loader>
                                </div>
                            );
                        }}
                    </Pagination>
                </div>
            </Loader>
        </div>
    );
}
