import { BrowserRouter } from "react-router-dom";
import Routes from "./Router.jsx";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ModalProvider } from "./contexts/ModalContext/index.jsx";

function App() {
    return (
        <AuthProvider>
            <ToastContainer position={toast.POSITION.BOTTOM_LEFT} autoClose={1000} />
            <BrowserRouter>
                <ModalProvider>
                    <Routes />
                </ModalProvider>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
