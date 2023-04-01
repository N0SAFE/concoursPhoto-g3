import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "@/views/auth/Login";
import Logout from "@/views/auth/Logout";
import UserList from "@/views/BO/user/List";
import UserEdit from "@/views/BO/user/Edit";
import UserCreate from "@/views/BO/user/Create";
import BO from "@/views/BO";
import Home from "@/views/Home";
import NotFound from "@/views/error/NotFound";
import OrganizationList from "@/views/BO/organization/List";
import Header from "@/layout/Header";
import CompetitionsList from "@/views/BO/competition/List";
import OrganizationCreate from "@/views/BO/organization/Create";
import CompetitionCreate from "@/views/BO/competition/Create";
import GuardedRoute from "./layout/GuardedRoute.jsx";
import { Navigate } from "react-router-dom";
import Test from "./views/Test.jsx";

function Router() {
    return (
        <Routes>
            <Route path="/" element={<Header />}>
                <Route path="login" element={<Login />} />
                <Route path="logout" element={<Logout />} />
            </Route>
            <Route path="/BO" element={<GuardedRoute verify={({ isLogged, me }) => isLogged && me.roles.includes("ROLE_ADMIN")} fallback={<Navigate to="/login" replace={true} />}/>}>
                <Route path="" element={<Header />}>
                    <Route element={<BO />} />
                    <Route path="user">
                        <Route path="" element={<UserList />} />
                        <Route path=":id" element={<UserEdit />} />
                        <Route path="create" element={<UserCreate />} />
                    </Route>
                    <Route path="organization">
                        <Route path="" element={<OrganizationList />} />
                        <Route path="create" element={<OrganizationCreate />} />
                    </Route>
                    <Route path="competition">
                        <Route path="" element={<CompetitionsList />} />
                        <Route path="create" element={<CompetitionCreate />} />
                    </Route>
                </Route>
            </Route>
            <Route path="/" element={<GuardedRoute verify={({ isLogged }) => isLogged} fallback={<Navigate to="/login" replace={true} />}/>}>
                <Route path="" element={<Home />} />
            </Route>
            <Route path="/test" element={<Test />}/>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default Router;
