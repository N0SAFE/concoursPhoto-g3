import { Route, Routes } from 'react-router-dom';
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
import Profile from '@/views/global/Profile';
import OrganizationEdit from '@/views/BO/organization/Edit';
import CompetitionSee from '@/views/BO/competition/See';
import OrganizationSee from '@/views/BO/organization/See';
import CompetitionEdit from '@/views/BO/competition/Edit';
import MyorganizationInfo from '@/views/global/Profile/myorganization/info/index.jsx';
import MyorganizationList from '@/views/global/Profile/myorganization/index.jsx';
import ProfileNotification from '@/views/global/Profile/notification';
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
import MyorganizationAdmin from './views/global/Profile/myorganization/admin/index.jsx';
import MyorganizationCompetiton from './views/global/Profile/myorganization/competitions/index.jsx';
import PhotographerList from './views/FO/photographer/index.jsx';
import ListOrganization from './views/FO/organization/list/index.jsx';
import PhotographerBOList from './views/BO/user/photographer/index.jsx';
import OrganisationDetails from './views/FO/organization/details/index.jsx';
import AuthMiddleware from '@/middleware/AuthMiddleware.jsx';
import ProfileMyorganizationMiddleware from './middleware/ProfileMyorganizationMiddleware.jsx';
import CompetitionMiddleware from './middleware/CompetitionMiddleware.jsx';
import OrganizationLayout from './layout/OrganizationLayout/index.jsx';
import ListCompetition from './views/FO/competition/details/index.jsx';
import CompetitionAdministration from "@/views/global/Profile/administration";
import DetailsPhotographer from './views/FO/photographer/details/index.jsx';

function Router() {
    return (
        <Routes>
            <Route
                path="/BO"
                element={<AuthMiddleware roles={['ROLE_ADMIN']} />}
            >
                <Route
                    path=""
                    element={<PageLayout environment={'backoffice'} />}
                >
                    <Route element={<BO />} />
                    <Route path="user">
                        <Route path="" element={<UserList />} />
                        <Route
                            path="photographer"
                            element={<PhotographerBOList />}
                        />
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
                <Route path="profile" element={<AuthMiddleware />}>
                    <Route path="" element={<ProfileLayout />}>
                        <Route path="" element={<Profile />} />
                        <Route
                            path="preference"
                            element={<ProfileNotification />}
                        />
                        <Route path="myorganization">
                            <Route path="" element={<MyorganizationList />} />
                            <Route
                                path=":id"
                                element={<ProfileMyorganizationMiddleware />}
                            >
                                <Route
                                    path=""
                                    element={<MyorganizationLayout />}
                                >
                                    <Route
                                        path=""
                                        element={<MyorganizationInfo />}
                                    />
                                    <Route
                                        path="admin"
                                        element={<MyorganizationAdmin />}
                                    />
                                    <Route
                                        path="competition"
                                        element={<MyorganizationCompetiton />}
                                    />
                                    <Route path="pub" element={<div />} />
                                </Route>
                            </Route>
                        </Route>
                        <Route
                            path="participations"
                            element={<CompetitionParticipation />}
                        />
                        <Route
                            path="administrations"
                            element={<CompetitionAdministration />}
                        />
                    </Route>
                </Route>

                <Route
                    path="/createcompetition"
                    element={<CreateCompetitions />}
                />
                <Route path="/organization">
                    <Route path="" element={<ListOrganization />} />
                </Route>
                <Route
                    path="/organization/:id"
                    element={<OrganizationLayout />}
                >
                    <Route path="" element={<OrganisationDetails />}></Route>
                </Route>

                <Route path="photographer">
                    <Route path="" element={<PhotographerList />} />
                </Route>
                <Route path="photographer/:id">
                    <Route path="" element={<DetailsPhotographer />} />
                </Route>

                <Route
                    path="/createorganization"
                    element={<CreateOrganization />}
                />
                <Route
                    path="competitiondetails"
                    element={<ListCompetition />}
                ></Route>

                <Route
                    path="/competition/:id"
                    element={<CompetitionMiddleware />}
                >
                    <Route path="" element={<CompetitionLayout />}>
                        <Route path="" element={<CompetitionView />} />
                        <Route path="rules" element={<CompetitionRules />} />
                        <Route
                            path="endowments"
                            element={<CompetitionEndowments />}
                        />
                        <Route path="jury" element={<CompetitionJury />} />
                        <Route
                            path="pictures"
                            element={<CompetitionPictures />}
                        />
                        <Route
                            path="results"
                            element={<CompetitionResults />}
                        />
                    </Route>
                </Route>

                <Route path="" element={<Home />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default Router;
