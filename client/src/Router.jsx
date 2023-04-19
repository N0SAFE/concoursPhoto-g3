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
import ProfileUser from "@/views/global/Profile/User";
import OrganizationEdit from "@/views/BO/organization/Edit";
import CompetitionSee from "@/views/BO/competition/See";
import OrganizationSee from "@/views/BO/organization/See";
import CompetitionEdit from "@/views/BO/competition/Edit";
import IndexNotif from "@/views/global/Profile/notif/index.jsx";
import Myorganisation from "./views/global/Profile/myorganization/index.jsx";
import ProfilLayout from "@/layout/Profil.jsx";
import { useModal } from "./contexts/ModalContext/index.jsx";
import { toast } from "react-toastify";

function Router() {
    const getLoginComponent = () => {
        return (
            <Login
                onSuccess={hideModal}
                onRegisterButtonClick={() => {
                    console.log("ui")
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
    const {setModalContent, showModal, hideModal} = useModal();
    return (
        <Routes>
            <Route path="/BO" element={<GuardedRoute verify={({ isLogged, me }) => isLogged && me.roles.includes("ROLE_ADMIN")} fallback={() => {toast.info('veuillez vous connecter'); setModalContent(getLoginComponent()); showModal(); return <Navigate to="/" replace={true} />}} />}>
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
                <Route path="profile" element={<GuardedRoute verify={({ isLogged }) => isLogged} fallback={() => {toast.info('veuillez vous connecter'); setModalContent(getLoginComponent()); showModal(); return <Navigate to="/" replace={true} />}} />}>
                    <Route element={<ProfilLayout />}>
                        <Route path="me" element={<Profile />} />
                        <Route path="preference" element={<IndexNotif />} />
                        <Route path="myorganization" element={<Myorganisation />} />
                    </Route>
                    <Route path=":id" element={<ProfileUser />} />
                </Route>
                <Route path="" element={<Home />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default Router;
