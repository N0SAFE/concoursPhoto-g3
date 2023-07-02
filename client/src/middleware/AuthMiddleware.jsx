import GuardedRoute from '@/layout/GuardedRoute.jsx';
import { toast } from 'react-toastify';
import { useModal } from '@/contexts/ModalContext/index.jsx';
import Login from '@/components/organisms/auth/Login/index.jsx';
import { useNavigate } from 'react-router-dom';

export default function AuthMiddleware({ roles }) {
    const { setModalContent, showModal } = useModal();
    const navigate = useNavigate();

    return (
        <GuardedRoute
            verify={({ isLogged, me }) => {
                if (!isLogged) {
                    return false;
                }
                if (Array.isArray(roles)) {
                    if (roles.length === 0) {
                        throw new Error('the roles array must not be empty');
                    }
                    return roles.reduce(
                        (acc, role) => acc || me.roles.includes(role),
                        false
                    );
                }
                return true;
            }}
            fallback={() => {
                toast.info('Veuillez vous connecter');
                setModalContent(<Login forceRedirect={false} />);
                showModal({ close: () => navigate('/') });
                return <div></div>;
            }}
        />
    );
}
