import { Route, Routes } from "react-router-dom";
import Login from "@/components/organisms/auth/Login";
import Register from "@/components/organisms/auth/Register";
import UserList from "@/views/BO/user/List";
import UserEdit from "@/views/BO/user/Edit";
import UserCreate from "@/views/BO/user/Create";
import UserSee from "@/views/BO/user/See";
import BO from "@/views/BO";
import Home from "@/views/Home";
import NotFound from "@/views/error/NotFound";
import OrganizationList from "@/views/BO/organization/List";
import Header from "@/layout/Header";
import CompetitionList from "@/views/BO/competition/List";
import OrganizationCreate from "@/views/BO/organization/Create";
import CompetitionCreate from "@/views/BO/competition/Create";
import GuardedRoute from "@/layout/GuardedRoute.jsx";
import { Navigate } from "react-router-dom";
import Profile from "@/views/global/Profile";
import OrganizationEdit from "@/views/BO/organization/Edit";
import CompetitionSee from "@/views/BO/competition/See";
import OrganizationSee from "@/views/BO/organization/See";
import CompetitionEdit from "@/views/BO/competition/Edit";
import { useModal } from "./contexts/ModalContext/index.jsx";
import { toast } from "react-toastify";
import Myorganization from "@/views/global/Profile/myorganization/index.jsx";
import IndexNotif from "@/views/global/Profile/notif";
import CompetitionView from "@/views/FO/competition/CompetitionView";
import Navlink from "@/layout/Navlink";
import CompetitionLayout from "@/layout/CompetitionLayout";
import CompetitionRules from "@/views/FO/competition/CompetitionRules";
import CompetitionEndowments from "@/views/FO/competition/CompetitionEndowments";
import CompetitionJury from "@/views/FO/competition/CompetitionJury";
import CompetitionPictures from "@/views/FO/competition/CompetitionPictures";
import CompetitionResults from "@/views/FO/competition/CompetitionResults";

const profileRouteList = [
    { content: "Mon profil", to: "/me" },
    { content: "Mes préférences", to: "/preference" },
    { content: "Mes organisations", to: "/myorganization" },
    { content: "Concours créés par mon organisation", to: "/me" },
    { content: "Concours auxquels j’ai participé", to: "/me" },
    { content: "Mes publicités", to: "/me" },
];

const competitionRouteList = [
    { content: "Le concours", to: "" },
    { content: "Règlement", to: "/rules" },
    { content: "Prix à gagner", to: "/endowments" },
    { content: "Membres du Jury", to: "/jury" },
    { content: "Les photos", to: "/pictures" },
    { content: "Résultats", to: "/results" },
]

function Router() {
    const getLoginComponent = () => {
        return (
            <Login
                onSuccess={hideModal}
                onRegisterButtonClick={() => {
                    console.log("ui");
                    setModalContent(getRegisterComponent());
                }}
            />
        );
    };

    const getRegisterComponent = () => {
        return (
            <Register
                onSuccess={hideModal}
                onLoginButtonClick={() => {
                    setModalContent(getLoginComponent());
                }}
            />
        );
    };
    const { setModalContent, showModal, hideModal } = useModal();
    return (
        <Routes>
            <Route
                path="/BO"
                element={
                    <GuardedRoute
                        verify={({ isLogged, me }) => isLogged && me.roles.includes("ROLE_ADMIN")}
                        fallback={() => {
                            toast.info("veuillez vous connecter");
                            setModalContent(getLoginComponent());
                            showModal();
                            return <Navigate to="/" replace={true} />;
                        }}
                    />
                }
            >
                <Route path="" element={<Header environment={"backoffice"} />}>
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
            <Route path="/" element={<Header />}>
                <Route path="profile" element={<GuardedRoute verify={({ isLogged }) => isLogged} fallback={<Navigate to="/auth/login" replace={true} />} />}>
                    <Route element={<Navlink base="/profile" list={profileRouteList} />}>
                        <Route path="me" element={<Profile />} />
                        <Route path="preference" element={<IndexNotif />} />
                        <Route path="myorganization" element={<Myorganization />} />
                    </Route>
                </Route>
                <Route path="/competition/:id" element={<CompetitionLayout />}>
                    <Route path="" element={<Navlink base="/competition/:id" list={competitionRouteList} />}>
                        <Route path="" element={<CompetitionView />} />
                        <Route path="rules" element={<CompetitionRules />} />
                        <Route path="endowments" element={<CompetitionEndowments />} />
                        <Route path="jury" element={<CompetitionJury />} />
                        <Route path="pictures" element={<CompetitionPictures />} />
                        <Route path="results" element={<CompetitionResults />} />
                    </Route>
                </Route>
                <Route path="" element={<Home />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default Router;
