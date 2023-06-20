import { useAuthContext } from '@/contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from './useAuth.js';
import { useModal } from '@/contexts/ModalContext/index.jsx';
import { getLoginModalContent } from '@/components/organisms/auth/Login/index.jsx';

export const queryListSymbol = Symbol('query-list');
function createQueryParams(params) {
    if (!params) return '';
    const keys = Object.keys(params);
    if (keys.length === 0) return '';
    let query = '?';
    const recursive = (obj, key) => {
        if (typeof obj === 'object' && obj !== null) {
            if (Array.isArray(obj)) {
                obj.forEach((value, index) => {
                    recursive(value, `${key}[${index}]`);
                });
            } else {
                Reflect.ownKeys(obj).forEach(subKey => {
                    if (subKey === queryListSymbol) {
                        recursive(obj[subKey], `${key}`);
                        return;
                    }
                    recursive(obj[subKey], `${key}[${subKey}]`);
                });
            }
        } else {
            query += `${key}=${obj}&`;
        }
    };
    keys.forEach(key => {
        recursive(params[key], key);
    });
    return query.slice(0, -1);
}

export default function () {
    const navigate = useNavigate();
    const { setModalContent, showModal } = useModal();
    const { logout } = useAuth();
    const { checkLogged } = useAuthContext();

    return function apiFetch(path, options, { refreshToken = true } = {}) {
        if (!options) {
            options = {};
        }
        if (typeof options !== 'object') {
            reject(new Error('options must be an object'));
            return;
        }
        options.credentials = 'include';
        const request = fetch(
            new URL(
                import.meta.env.VITE_API_URL +
                    path +
                    createQueryParams(options.query)
            ),
            options
        );
        return new Promise(async (resolve, reject) => {
            try {
                const response = await request;
                if (!refreshToken) {
                    if (response.ok) resolve(response);
                    else reject(response);
                    return;
                }
                try {
                    if (response.status === 401) {
                        const data = await response.json();
                        response.json = async () => data;
                        if (
                            (data.message === 'Expired JWT Token' ||
                                data.message === 'Missing token' ||
                                data.message === 'Invalid credentials.') &&
                            path !== '/token/refresh'
                        ) {
                            const { isLogged } = await checkLogged();
                            if (!isLogged) {
                                logout().then(() => {
                                    navigate('/');
                                    setModalContent(getLoginModalContent());
                                    showModal();
                                });
                                toast.error(
                                    'une erreur est survenue, veuillez vous reconnecter'
                                );
                                reject(
                                    new Error(
                                        'une erreur est survenue, veuillez vous reconnecter'
                                    )
                                );
                                return;
                            }
                            resolve(
                                await apiFetch(path, options, {
                                    refreshToken: false,
                                    signal,
                                }).resPromise
                            );
                            return;
                        }
                    }
                    if (response.ok) resolve(response);
                    else reject(response);
                    return;
                } catch (e) {
                    if (response.ok) resolve(response);
                    else reject(response);
                    return;
                }
            } catch (e) {
                reject(e);
                return;
            }
        });
    };
}
