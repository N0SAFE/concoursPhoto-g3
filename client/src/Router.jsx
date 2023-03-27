import { Route, Routes } from "react-router-dom";
import Login from "@/views/auth/Login";
import Logout from "@/views/auth/Logout";
import UserList from "@/views/BO/user/List";
import UserEdit from "@/views/BO/user/Edit";
import UserCreate from "@/views/BO/user/Create";
import BO from "@/views/BO";
import Home from "@/views/Home";
import NotFound from "@/views/error/NotFound";
import Navbar from "@/components/molecules/Navbar/index.jsx";
import { Outlet } from "react-router-dom";
import OrganizationList from "./views/BO/organization/List";

function Header() {
    return (
        <header>
            <Navbar />
            <Outlet />
        </header>
    );
}

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
                <Route path="user" element={<UserList />} />
                <Route path="user/:id" element={<UserEdit />} />
                <Route path="user/create" element={<UserCreate />} />
                <Route path="organization" element={<OrganizationList />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default Router;
