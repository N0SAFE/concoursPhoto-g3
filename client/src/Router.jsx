import { Route, Routes } from "react-router-dom";
import Login from "./views/auth/Login";
import UserList from "./views/BO/UserList";
import UserEdit from "./views/BO/UserEdit";
import UserCreate from "./views/BO/UserCreated.jsx";
import BO from "./views/BO/BO";
import Home from "./views/Home.jsx";
import NotFound from "./views/error/NotFound";

function Router() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route>
                <Route path="/login" element={<Login />} />
            </Route>
            <Route path="/BO">
                <Route path="" element={<BO />} />
                <Route path="user" element={<UserList />} />
                <Route path="user/:id" element={<UserEdit />} />
                <Route path="user/create" element={<UserCreate />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default Router;
