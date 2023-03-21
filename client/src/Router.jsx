import { Route, Routes } from "react-router-dom";
import Login from "./views/auth/Login";
import UserList from "./views/BO/UserList";
import UserEdit from "./views/BO/UserEdit";
import UserCreate from "./views/BO/UserCreated.jsx";

function Router() {
    return (
        <Routes>
            <Route>
                <Route path="/login" element={<Login />} />
            </Route>
            <Route path="/BO">
                <Route path="user" element={<UserList />} />
                <Route path="user/:id" element={<UserEdit />} />
                <Route path="user/create" element={<UserCreate />} />
            </Route>
        </Routes>
    );
}

export default Router;
