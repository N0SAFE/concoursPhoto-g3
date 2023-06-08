import { BrowserRouter } from 'react-router-dom';
import Routes from './Router.jsx';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ModalProvider } from './contexts/ModalContext/index.jsx';
import style from './main.module.scss';
import { Helmet } from 'react-helmet';
import useApiPath from './hooks/useApiPath.js';

function App() {
    const apiFetch = useApiPath();
    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Concours photo</title>
                <link
                    type="image/svg+xml"
                    rel="icon" 
                    href={apiFetch('logo-concoursPhoto-little.svg')}
                />
            </Helmet>
            <AuthProvider>
                <ToastContainer
                    position={toast.POSITION.BOTTOM_LEFT}
                    autoClose={1000}
                />
                <main className={style.main}>
                    <BrowserRouter>
                        <ModalProvider>
                            <Routes />
                        </ModalProvider>
                    </BrowserRouter>
                </main>
            </AuthProvider>
        </>
    );
}

export default App;
