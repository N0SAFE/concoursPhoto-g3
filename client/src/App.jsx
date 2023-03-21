import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Router.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
