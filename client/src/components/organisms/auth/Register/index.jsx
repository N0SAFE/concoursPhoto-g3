import Input from '@/components/atoms/Input';
import BOForm from '@/components/organisms/BO/Form';
import useApiFetch from '@/hooks/useApiFetch';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import style from './style.module.scss';
import Button from '@/components/atoms/Button';
import { Link } from 'react-router-dom';
import { useModal } from '@/contexts/ModalContext';
import Login from '@/components/organisms/auth/Login';

export default function UserRegister() {
    const apiFetch = useApiFetch();
    const { hideModal, setModalContent } = useModal();

    const [entityPossibility, setEntityPossibility] = useState({
        genders: [],
        statut: [],
    });
    const [gtc, setGtc] = useState(false);
    const [entity, setEntity] = useState({
        state: false,
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        roles: [],
        gender: '',
        statut: '',
        dateOfBirth: null,
    });

    const updateEntity = (key, value) => {
        setEntity({ ...entity, [key]: value });
    };

    const [errors, setErrors] = useState({});

    const getGendersPossibility = () => {
        return apiFetch('/genders', {
            method: 'GET',
        })
            .then(r => r.json())
            .then(data => {
                return data['hydra:member'].map(function (item) {
                    return { label: item.label, value: item['@id'] };
                });
            });
    };
    const getPersonalstatus = () => {
        return apiFetch('/personal_statuts', {
            method: 'GET',
        })
            .then(r => r.json())
            .then(data => {
                console.debug(data);
                return data['hydra:member'].map(function (item) {
                    return { label: item.label, value: item['@id'] };
                });
            });
    };

    useEffect(() => {
        const promise = Promise.all([
            getGendersPossibility(),
            getPersonalstatus(),
        ]).then(([genders, statut]) =>
            setEntityPossibility({ genders, statut })
        );
        toast.promise(promise, {
            pending: 'Chargement des possibilités',
            success: 'Possibilités chargées',
            error: 'Erreur lors du chargement des possibilités',
        });
    }, []);

    return (
        <div className={style.register}>
            <div className={style.registerTrailer}>
                <h2>Inscription</h2>
                <span>Créez votre compte membre, c’est gratuit !</span>
                <span>
                    Vous pourrez voter et participer en tant que photographe aux{' '}
                    <br /> concours proposés. Si vous représentez une
                    organisation et <br /> souhaitez publier un concours, créez
                    d’abord votre compte.
                </span>
            </div>
            <BOForm
                className={style.registerForm}
                handleSubmit={function () {
                    const promise = new Promise(async (resolve, reject) => {
                        if (!gtc) {
                            reject(
                                "Vous devez accepter les conditions générales d'utilisation"
                            );
                            return;
                        }
                        const data = {
                            state: true,
                            email: entity.email,
                            firstname: entity.firstname,
                            lastname: entity.lastname,
                            roles: ['ROLE_MEMBER'],
                            personalStatut: entity.statut.value,
                            dateOfBirth: entity.dateOfBirth.toISOString(),
                            creationDate: new Date().toISOString(),
                            registrationDate: new Date().toISOString(),
                            country: 'FRANCE',
                            isVerified: false,
                            plainPassword: entity.password || undefined,
                        };
                        if (
                            data.firstname &&
                            data.lastname &&
                            data.dateOfBirth &&
                            data.personalStatut &&
                            data.email
                        ) {
                            if (!data.plainPassword) {
                                reject('Le mot de passe est obligatoire');
                                return;
                            } else if (data.plainPassword.length < 8) {
                                reject(
                                    'Le mot de passe doit faire minimum 8 caractères !'
                                );
                                return;
                            } else if (
                                !data.plainPassword.match(
                                    /^(?=.*[A-Z])(?=.*\d).+$/
                                )
                            ) {
                                reject(
                                    'Le mot de passe doit contenir au moins une lettre majuscule et un chiffre !'
                                );
                                return;
                            }
                            try {
                                await apiFetch('/users', {
                                    method: 'POST',
                                    body: JSON.stringify(data),
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                })
                                    .then(r => r.json())
                                    .then(data => {
                                        if (data['@type'] === 'hydra:Error') {
                                            reject(data);
                                            return;
                                        }
                                        resolve(data);
                                    });
                            } catch (e) {
                                reject(e);
                            }
                        } else {
                            reject('Veuillez remplir tous les champs');
                        }
                    });
                    promise.then(hideModal);
                    toast.promise(promise, {
                        pending: 'Création du compte',
                        success: 'Compte créé',
                        error: {
                            render({ data }) {
                                return data;
                            },
                        },
                    });
                }}
                hasSubmit={true}
            >
                <div>
                    <Input
                        type="text"
                        name="Prénom"
                        label="Prénom*"
                        extra={{ required: true }}
                        onChange={d => updateEntity('firstname', d)}
                        defaultValue={entity.firstname}
                    />
                    <Input
                        type="text"
                        name="lastname"
                        label="Nom*"
                        extra={{ required: true }}
                        onChange={d => updateEntity('lastname', d)}
                        defaultValue={entity.lastname}
                    />
                    <div className={style.group}>
                        <div>
                            <Input
                                type="date"
                                name="dateOfBirth"
                                label="Date de naissance*"
                                extra={{ required: true }}
                                onChange={d => updateEntity('dateOfBirth', d)}
                                defaultValue={entity.dateOfBirth}
                            />
                        </div>
                        <div>
                            <Input
                                type="select"
                                name="personalStatut"
                                label="Vous êtes*"
                                defaultValue={entity.statut}
                                extra={{
                                    options: entityPossibility.statut,
                                    required: true,
                                    placeholder: 'Cliquez-ici',
                                }}
                                onChange={d => updateEntity('statut', d)}
                                className={style.registerSelect}
                            />
                        </div>
                    </div>
                    <Input
                        type="email"
                        name="email"
                        label="Adresse mail*"
                        extra={{ required: true }}
                        onChange={d => updateEntity('email', d)}
                        defaultValue={entity.email}
                    />
                    <Input
                        type="password"
                        name="password"
                        label="Mot de passe*"
                        extra={{
                            required: true,
                            placeholder:
                                '8 caractères min dont 1 chiffre et 1 lettre majuscule',
                        }}
                        onChange={d => updateEntity('password', d)}
                        defaultValue={entity.password}
                    />
                    <div className={style.registerRule}>
                        <Input
                            type="checkbox"
                            onChange={setGtc}
                            defaultValue={gtc}
                        />
                        <p>
                            En cochant cette case, j'accepte les{' '}
                            <span>conditions générales d'utilisation</span>{' '}
                            ainsi que la <span>politique d'utilisation</span> de
                            mes données personnelles.
                        </p>
                    </div>
                    <div className={style.registerSubmit}>
                        <Button
                            type="submit"
                            name="Créer mon compte"
                            color={'black'}
                            textColor={'white'}
                            padding={'14px 30px'}
                            border={false}
                            borderRadius={'44px'}
                            width={'245px'}
                        />
                    </div>
                    <p className={style.registerProposition}>
                        Vous avez déjà un compte ?{' '}
                        <Link
                            onClick={e => {
                                e.preventDefault();
                                setModalContent(<Login />);
                            }}
                        >
                            Connectez-vous
                        </Link>
                    </p>
                </div>
            </BOForm>
        </div>
    );
}

export function getRegisterModalContent() {
    return <Register />;
}
