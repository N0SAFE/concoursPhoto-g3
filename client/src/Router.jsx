import { Route, Routes } from "react-router-dom";
import Login from "@views/auth/Login";
import UserList from "@views/BO/user/List";
import UserEdit from "@views/BO/user/Edit";
import UserCreate from "@views/BO/user/Create";
import BO from "@views/BO";
import Home from "@views/Home";
import NotFound from "@views/error/NotFound";

function Router() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/" >
                <Route path="login" element={<Login />} />
            </Route>
            <Route path="/BO">
                <Route path="" element={<BO />} />
                <Route path="user" element={<UserList />} />
                <Route path="user/:id" element={<UserEdit />} />
                <Route path="user/create" element={<UserCreate />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default Router;
