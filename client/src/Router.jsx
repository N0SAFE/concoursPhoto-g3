import { Route, Routes, redirect, useParams } from 'react-router-dom';
import Login from '@/components/organisms/auth/Login';
import UserList from '@/views/BO/user/List';
import UserEdit from '@/views/BO/user/Edit';
import UserCreate from '@/views/BO/user/Create';
import UserSee from '@/views/BO/user/See';
import BO from '@/views/BO';
import Home from '@/views/Home';
import NotFound from '@/views/error/NotFound';
import OrganizationList from '@/views/BO/organization/List';
import CompetitionList from '@/views/BO/competition/List';
import OrganizationCreate from '@/views/BO/organization/Create';
import CompetitionCreate from '@/views/BO/competition/Create';
import GuardedRoute from '@/layout/GuardedRoute.jsx';
import { Navigate } from 'react-router-dom';
import Profile from '@/views/global/Profile';
import OrganizationEdit from '@/views/BO/organization/Edit';
import CompetitionSee from '@/views/BO/competition/See';
import OrganizationSee from '@/views/BO/organization/See';
import CompetitionEdit from '@/views/BO/competition/Edit';
import { useModal } from '@/contexts/ModalContext/index.jsx';
import { toast } from 'react-toastify';
import MyorganizationInfoSee from '@/views/global/Profile/myorganization/info/see/index.jsx';
import IndexNotif from '@/views/global/Profile/notif';
import CompetitionView from '@/views/FO/competition/See/CompetitionView/index.jsx';
import CompetitionLayout from '@/layout/CompetitionLayout';
import CompetitionRules from '@/views/FO/competition/See/CompetitionRules/index.jsx';
import CompetitionEndowments from '@/views/FO/competition/See/CompetitionEndowments';
import CompetitionJury from '@/views/FO/competition/See/CompetitionJury';
import CompetitionPictures from '@/views/FO/competition/See/CompetitionPictures';
import CompetitionResults from '@/views/FO/competition/See/CompetitionResults/index.jsx';
import PageLayout from '@/layout/PageLayout';
import ProfileLayout from '@/layout/ProfileLayout';
import CompetitionParticipation from '@/views/global/Profile/participation';
import CreateCompetitions from '@/views/FO/competition/Create/index.jsx';
import CreateOrganization from '@/views/FO/organization/index.jsx';
import MyorganizationLayout from '@/layout/ProfileLayout/MyorganizationLayout';

function Router() {
    const { setModalContent, showModal } = useModal();
    return (
        <Routes>
            <Route
                path="/BO"
                element={
                    <GuardedRoute
                        verify={({ isLogged, me }) =>
                            isLogged && me.roles.includes('ROLE_ADMIN')
                        }
                        fallback={() => {
                            toast.info('Veuillez vous connecter');
                            setModalContent(<Login />);
                            showModal();
                            return <Navigate to="/" replace={true} />;
                        }}
                    />
                }
            >
                <Route
                    path=""
                    element={<PageLayout environment={'backoffice'} />}
                >
                    <Route element={<BO />} />
                    <Route path="user">
                        <Route path="" element={<UserList />} />
                        <Route path=":id" element={<UserSee />} />
                        <Route path="edit/:id" element={<UserEdit />} />
                        <Route path="create" element={<UserCreate />} />
                    </Route>
                    <Route path="organization">
                        <Route path="" element={<OrganizationList />} />
                        <Route path=":id" element={<OrganizationSee />} />
                        <Route path="create" element={<OrganizationCreate />} />
                        <Route path="edit/:id" element={<OrganizationEdit />} />
                    </Route>
                    <Route path="competition">
                        <Route path="" element={<CompetitionList />} />
                        <Route path=":id" element={<CompetitionSee />} />
                        <Route path="create" element={<CompetitionCreate />} />
                        <Route path="edit/:id" element={<CompetitionEdit />} />
                    </Route>
                </Route>
            </Route>
            <Route path="/" element={<PageLayout />}>
                <Route
                    path="profile"
                    element={
                        <GuardedRoute
                            verify={({ isLogged }) => isLogged}
                            fallback={() => {
                                toast.info('Veuillez vous connecter');
                                setModalContent(
                                    <Login forceRedirect="/profile" />
                                );
                                showModal();
                            }}
                        />
                    }
                >
                    <Route path="" element={<ProfileLayout />}>
                        <Route path="" element={<Navigate to="me" />} />
                        <Route path="me" element={<Profile />} />
                        <Route path="preference" element={<IndexNotif />} />
                        <Route
                            path="myorganization"
                            element={<MyorganizationLayout />}
                        >
                            <Route path="info">
                                <Route
                                    path=":id"
                                    element={
                                        <GuardedRoute
                                            verify={({ me }) => {
                                                const { id: _idOrganisation } =
                                                    useParams();
                                                const idOrganisation =
                                                    parseInt(_idOrganisation);
                                                if (isNaN(idOrganisation)) {
                                                    return false;
                                                }
                                                const _selectedOrganisation =
                                                    me.Manage.find(org => {
                                                        return (
                                                            org.id ===
                                                            idOrganisation
                                                        );
                                                    });
                                                if (_selectedOrganisation) {
                                                    const selectedOrganisation =
                                                        {
                                                            ..._selectedOrganisation,
                                                            postcode: {
                                                                label: _selectedOrganisation.postcode,
                                                                value: _selectedOrganisation.postcode,
                                                            },
                                                            organizationType: {
                                                                label: _selectedOrganisation
                                                                    .organization_type
                                                                    .label,
                                                                value: _selectedOrganisation
                                                                    .organization_type[
                                                                    '@id'
                                                                ],
                                                            },
                                                        };
                                                    return {
                                                        state: !!selectedOrganisation,
                                                        context: {
                                                            idOrganisation,
                                                            selectedOrganisation,
                                                        },
                                                    };
                                                }
                                                return {
                                                    state: false,
                                                    context: {
                                                        idOrganisation,
                                                    },
                                                };
                                            }}
                                            fallback={({ me }) => {
                                                if (me.Manage.length > 0) {
                                                    return (
                                                        <Navigate
                                                            to={
                                                                '/profile/myorganization/info/' +
                                                                me.Manage[0].id
                                                            }
                                                        />
                                                    );
                                                } else {
                                                    return;
                                                }
                                            }}
                                        />
                                    }
                                >
                                    <Route
                                        path=""
                                        element={<MyorganizationInfoSee />}
                                    />
                                </Route>
                            </Route>
                        </Route>
                        <Route
                            path="participations"
                            element={<CompetitionParticipation />}
                        />
                    </Route>
                </Route>
                <Route
                    path="/createcompetition"
                    element={<CreateCompetitions />}
                />
                <Route
                    path="/createorganization"
                    element={<CreateOrganization />}
                />
                <Route path="/competition/:id" element={<CompetitionLayout />}>
                    <Route path="" element={<CompetitionView />} />
                    <Route path="rules" element={<CompetitionRules />} />
                    <Route
                        path="endowments"
                        element={<CompetitionEndowments />}
                    />
                    <Route path="jury" element={<CompetitionJury />} />
                    <Route path="pictures" element={<CompetitionPictures />} />
                    <Route path="results" element={<CompetitionResults />} />
                </Route>
                <Route path="" element={<Home />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default Router;
