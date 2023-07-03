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
import Button from '@/components/atoms/Button/index.jsx';
import { useModal } from '@/contexts/ModalContext/index.jsx';
import CompetitionPicturesAdd from '@/components/organisms/Modals/competition/CompetitionPicturesAdd.jsx';
import { useAuthContext } from '@/contexts/AuthContext.jsx';
import { toast } from 'react-toastify';
import Login from '@/components/organisms/auth/Login';

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
    const { showModal, setModalContent } = useModal();
    const { me } = useAuthContext();

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
                    'picture:userVote:read',
                    'vote:read',
                ],
                properties: {
                    user: ['lastname', 'firstname'],
                    file: ['path', 'pictureName'],
                    [queryListSymbol]: ['hasBeenVoted', 'userVote'],
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

    const handleVote = async (
        pictureId,
        { hasBeenVoted, voteInstance } = {}
    ) => {
        if (!me) {
            toast.error('Vous devez être connecté pour voter');
            setModalContent(<Login forceRedirect={false} />);
            showModal();
            return;
        }
        if (hasBeenVoted) {
            console.log(voteInstance);
            const promise = apiFetch(`/votes/${voteInstance.id}`, {
                headers: {
                    'Content-Type': 'application/ld+json',
                },
                method: 'DELETE',
            });

            toast.promise(promise, {
                pending: 'Suppression du vote...',
                success: 'Vote supprimé !',
                error: 'Erreur lors de la suppression du vote',
            });

            promise.then(() => {
                getPictures(page, itemsPerPage);
            });

            return await promise;
        } else {
            const promise = apiFetch(`/votes`, {
                headers: {
                    'Content-Type': 'application/ld+json',
                },
                method: 'POST',
                body: JSON.stringify({
                    picture: pictureId,
                    user: me['@id'],
                }),
            });

            toast.promise(promise, {
                pending: 'Envoi du vote...',
                success: 'Vote enregistré !',
                error: "Erreur lors de l'envoi du vote",
            });

            promise.then(() => {
                getPictures(page, itemsPerPage);
            });

            return await promise;
        }
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
                                                        photographer={
                                                            picture.user
                                                        }
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
                                                            iconColor={
                                                                picture.hasBeenVoted
                                                                    ? 'blue'
                                                                    : 'white'
                                                            }
                                                            color={'white'}
                                                            backgroundColor={
                                                                '#A8A8A8'
                                                            }
                                                            icon={'like'}
                                                            onClick={() => {
                                                                console.log(
                                                                    picture
                                                                );
                                                                handleVote(
                                                                    picture[
                                                                        '@id'
                                                                    ],
                                                                    {
                                                                        hasBeenVoted:
                                                                            picture.hasBeenVoted,
                                                                        voteInstance:
                                                                            picture.userVote,
                                                                    }
                                                                );
                                                            }}
                                                        >
                                                            Voter
                                                        </Chip>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {me && (
                                            <div
                                                className={
                                                    style.picturesSubmission
                                                }
                                            >
                                                <Button
                                                    textColor={'white'}
                                                    color={'black'}
                                                    borderRadius={'30px'}
                                                    padding={'20px'}
                                                    iconPosition={'left'}
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        setModalContent(
                                                            <CompetitionPicturesAdd
                                                                competition={
                                                                    competition
                                                                }
                                                            />
                                                        );
                                                        showModal();
                                                    }}
                                                >
                                                    Soumettre une photo
                                                </Button>
                                            </div>
                                        )}
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
