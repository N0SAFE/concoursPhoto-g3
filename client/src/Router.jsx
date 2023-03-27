import { Route, Routes } from "react-router-dom";
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

function Router() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/" element={<Header />}>
                <Route path="login" element={<Login />} />
                <Route path="logout" element={<Logout />} />
            </Route>
            <Route path="/BO" element={<Header />}>
                <Route path="" element={<BO />} />
                <Route path="user">
                    <Route path="" element={<UserList />} />
                    <Route path=":id" element={<UserEdit />} />
                    <Route path="create" element={<UserCreate />} />
                </Route>
                <Route path="organization">
                    <Route path="" element={<OrganizationList />} />
                </Route>
                <Route path="competition">
                    <Route path="" element={<CompetitionsList />} />
                </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default Router;
