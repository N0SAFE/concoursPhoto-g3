import { Route, Routes } from "react-router-dom";
import Login from "./views/auth/Login";
import NotFound from "./views/error/NotFound";

function Router() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default Router;
