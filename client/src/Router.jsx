import { Route, Routes } from "react-router-dom";
import Login from "./views/auth/Login";

function Router() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default Router;
