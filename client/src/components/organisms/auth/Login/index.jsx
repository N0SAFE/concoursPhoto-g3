import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Form from '@/components/organisms/BO/Form';
import { useState } from 'react';
import style from './style.module.scss';
import { Link } from 'react-router-dom';
import { useModal } from '@/contexts/ModalContext';
import Register from '@/components/organisms/auth/Register';
import useAuthFunction from '@/hooks/useAuthFunction.js';

export default function Login({ forceRedirect }) {
    const { setModalContent, hideModal } = useModal();
    const { login } = useAuthFunction();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [identifier, setIdentifier] = useState('');

    return (
        <div className={style.loginContainer}>
            <div className={style.loginTrailer}>
                <h2>Connexion</h2>
                <span>
                    Veuillez vous identifier pour pouvoir voter et participer.
                </span>
                <p className={style.loginProposition}>
                    Si vous n'avez pas de compte,{' '}
                    <Link
                        onClick={e => {
                            e.preventDefault();
                            setModalContent(<Register />);
                        }}
                    >
                        inscrivez-vous
                    </Link>
                    , c'est gratuit.
                </p>
            </div>
            <Form
                handleSubmit={async function () {
                    const promise = login({
                        identifier: identifier,
                        password: password,
                    }).then(function ({me}) {
                        if (forceRedirect) {
                            navigate(forceRedirect);
                            return;
                        }
                        if(forceRedirect === false) {
                            return;
                        }   
                        if (me.roles.includes('ROLE_ADMIN')) {
                            navigate('/BO');
                        } else {
                            navigate('/');
                        }
                    });
                    promise.then(function () {
                        hideModal();
                    });
                    toast.promise(promise, {
                        pending: 'Connexion en cours',
                        success: 'Connexion réussie',
                        error: {
                            render({ data }) {
                                return data.message;
                            },
                        },
                    });
                }}
                hasSubmit={true}
            >
                <div className={style.loginFields}>
                    <Input
                        label="Email ou pseudo*"
                        name="email"
                        type="email"
                        placeholder="Email"
                        onChange={setIdentifier}
                    />
                    <Input
                        label="Mot de passe*"
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={setPassword}
                    />
                    <div className={style.loginSubmit}>
                        <Button
                            type="submit"
                            color={'black'}
                            textColor={'white'}
                            padding={'14px 30px'}
                            border={false}
                            borderRadius={'44px'}
                            width={'245px'}
                        >
                            Se connecter
                        </Button>
                    </div>
                    <p
                        className={`${style.loginProposition} ${style.loginPropositionExtra}`}
                    >
                        Vous avez oublié votre mot de passe ?{' '}
                        <Link
                            onClick={e => {
                                e.preventDefault();
                                setModalContent(<Register />);
                            }}
                        >
                            Cliquez-ici
                        </Link>
                    </p>
                </div>
            </Form>
        </div>
    );
}

export function getLoginModalContent() {
    return <Login />;
}
