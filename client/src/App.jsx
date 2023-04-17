import { BrowserRouter } from "react-router-dom";
import Routes from "./Router.jsx";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <AuthProvider>
            <ToastContainer position={toast.POSITION.BOTTOM_LEFT} autoClose={1000} />
            <BrowserRouter>
                <Routes />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
