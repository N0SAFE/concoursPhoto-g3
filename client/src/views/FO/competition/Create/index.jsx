import Input from '@/components/atoms/Input';
import Form from '@/components/organisms/BO/Form';
import useApiFetch from '@/hooks/useApiFetch';
import {useState, useEffect} from 'react';
import {toast} from 'react-toastify';
import style from './style.module.scss';
import Button from '@/components/atoms/Button';
import {useModal} from '@/contexts/ModalContext';
import {useNavigate} from 'react-router-dom';
import useLocationPosibility from '@/hooks/useLocationPosibility.js';

export default function CreateCompetitions() {
    const apiFetch = useApiFetch();
    const [gtc, setGtc] = useState(false);
    const {hideModal, setModalContent} = useModal();
    const navigate = useNavigate();

    const [entityPossibility, setEntityPossibility] = useState({
        genders: [],

    });
    const [entity, setEntity] = useState({
        state: false,
        email: '',
        phoneNumber: '',
        password: '',
        city: '',
        postcode: '',
        firstname: '',
        lastname: '',
        roles: [],
        gender: '',
        dateOfBirth: null,
        creationDate: null,
    });
    const [locationPossibility, updateLocationPossibility] =
        useLocationPosibility(['cities'], {}, {updateOnStart: false});
    const citiesPossibility = locationPossibility.citiesPossibility.map(c => ({
        label: `${c.nom} [${c.codesPostaux.join(',')}]`,
        value: c.code,
    }));
    const postalCodesPossibility = [
        ...new Set(
            locationPossibility.citiesPossibility
                .map(c => c.codesPostaux)
                .flat()
        ),
    ].map(c => ({label: c, value: c}));
    const [locationPossibilityIsLoading, setLocationPossibilityIsLoading] =
        useState(false);

    const updateEntity = (key, value) => {
        setEntity({...entity, [key]: value});
    };
    const updateEntityState = (key, value) => {
        setEntity({...entity, [key]: value});
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

    const getOrganizationsName = controller => {
        return apiFetch('/organizations', {
            method: 'GET',
            signal: controller?.signal,
        })
            .then(r => r.json())
            .then(data => {
                console.debug(data);
                return data['hydra:member'].map(function (item) {
                    return { label: item.organizerName, value: item['@id'] };
                });
            });
    };

    const getThemes = controller => {
        return apiFetch('/themes', {
            method: 'GET',
            signal: controller?.signal,
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
        ]).then(([genders]) =>
            setEntityPossibility({genders})
        );
        toast.promise(promise, {
            pending: 'Chargement des possibilités',
            success: 'Possibilités chargées',
            error: 'Erreur lors du chargement des possibilités',
        });
    }, []);

    useEffect(() => {
        updateLocationPossibility({
            args: {
                codeCity: entity.city?.value,
                postcode: entity.postcode?.value,
            },
        }).then(d => {
            if (
                d.length === 1 &&
                d[0].id === 'cities' &&
                d[0].data.length === 1
            ) {
                if (
                    d[0].data[0].codesPostaux.length === 1 &&
                    !entity.postcode
                ) {
                    setEntity({
                        ...entity,
                        postcode: {
                            label: d[0].data[0].codesPostaux[0],
                            value: d[0].data[0].codesPostaux[0],
                        },
                    });
                } else if (!entity.city) {
                    setEntity({
                        ...entity,
                        city: {
                            label: d[0].data[0].nom,
                            value: d[0].data[0].code,
                        },
                    });
                }
            } // this if statement set the value of the city and postcode if there is only one possibility for the given value (lagny le sec {code: 60341} as one postcode so the postcode will be set in the entity)
            setLocationPossibilityIsLoading(false);
        });
    }, [entity.postcode, entity.city]);


    return (
        <div>
            <h1>Créez votre concours</h1>
            <div style={{marginBottom: "2%"}} className={style.formWrapper}>
                <div className={style.formColumn}>

                    <h2 style={{marginTop: "15px"}}>Qui peut créer un concours photo ?</h2>
                    <p>La création d’un concours est ouvert aux organisations suivantes :
                        <li style={{marginTop: "10px"}}> Mairies</li>
                        <li> Offices de tourisme</li>
                        <li> Agglomérations</li>
                        <li> Départements</li>
                        <li> Régions</li>
                        <li> Collectivités territoriales</li>
                        <li> Organisations gouvernementales</li>
                        <li> Organismes de droit public</li>
                        <li> Entreprises privées</li>
                        <li> Associations, ONG</li>
                    </p>
                </div>
                <div className={style.formColumn}>
                    <h2>Combien ça coûte</h2>
                    <p>Le prix est établi pour chaque concours publié et il depend de plusieurs critères :
                        <li style={{marginTop: "10px"}}> Nature de votre organisation (privée, publique,
                            association/ONG)</li>
                        <li> Taille de votre organisation (moyens budgétaires)</li>
                        <li> Objet du concours photo, étendue, audience visée.</li>

                        <p style={{marginTop: "10px"}}>Pour recevoir un devis, veuillez renseigner le formulaire de
                            demande de création suivant qui va créer automatiquement
                            un compte membre et une fiche organisme associée. Votre demande sera étudiée et vous
                            recevrez un devis. Après avoir encaissé le paiement,
                            vous pourrez paramétrer et publier votre concours.</p>

                        <p style={{marginTop: "10px"}}>Si vous avez déjà créé un compte membre, veuillez vous connecter
                            puis rendez-vous dans
                            “Mon profil / Mes organisations / Concours”</p>
                    </p>
                </div>
            </div>
            <Form
                title="Vous êtes ?"
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
                            dateOfBirth: entity.dateOfBirth.toISOString(),
                            creationDate: new Date().toISOString(),
                            registrationDate: new Date().toISOString(),
                            country: 'FRANCE',
                            phoneNumber: entity.phoneNumber,
                            citycode: entity.city.value,
                            postcode: entity.postcode.value,
                            isVerified: false,
                            plainPassword: entity.password || undefined,
                        };
                        if (
                            data.firstname &&
                            data.lastname &&
                            data.dateOfBirth &&
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
                            render({data}) {
                                return data;
                            },
                        },
                    });
                }}
                hasSubmit={true}
            >


                <div className={style.formWrapper}>
                    <div className={style.formColumn}>
                        <Input
                            type="text"
                            name="lastname"
                            label="Nom*"
                            extra={{required: true}}
                            onChange={d => updateEntity('lastname', d)}
                            defaultValue={entity.lastname}
                        />
                        <Input
                            type="text"
                            name="Prénom"
                            label="Prénom*"
                            extra={{required: true}}
                            onChange={d => updateEntity('firstname', d)}
                            defaultValue={entity.firstname}
                        />
                        <Input
                            type="email"
                            name="email"
                            label="Adresse mail*"
                            extra={{required: true}}
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
                    </div>
                    <div className={style.formColumn}>
                        <Input
                            type="tel"
                            name="phoneNumber"
                            label="Numéro de téléphone"
                            extra={{required: true}}
                            onChange={d => updateEntityState('phoneNumber', d)}
                            defaultValue={entity.phoneNumber}
                        />
                        <Input
                            type="date"
                            name="dateOfBirth"
                            label="Date de naissance*"
                            extra={{required: true}}
                            onChange={d => updateEntity('dateOfBirth', d)}
                            defaultValue={entity.dateOfBirth}
                        />
                        <div style={{display: 'flex', gap: '30px'}}>
                            <Input
                                type="select"
                                name="city"
                                label="Ville"
                                extra={{
                                    isLoading: locationPossibilityIsLoading,
                                    value: entity.city,
                                    isClearable: true,
                                    required: true,
                                    options: citiesPossibility,
                                    multiple: false,
                                    onInputChange: (cityName, {action}) => {
                                        if (action === 'menu-close') {
                                            updateLocationPossibility({
                                                id: 'city',
                                                args: {
                                                    codeCity: entity.city?.value,
                                                    city: '',
                                                },
                                            });
                                        }
                                        if (action === 'input-change') {
                                            setLocationPossibilityIsLoading(true);
                                            updateLocationPossibility({
                                                id: 'city',
                                                args: {city: cityName},
                                            }).then(function () {
                                                setLocationPossibilityIsLoading(
                                                    false
                                                );
                                            });
                                        }
                                    },
                                }}
                                onChange={d => updateEntityState('city', d)}
                            />
                            <Input
                                type="select"
                                name="postalCode"
                                label="Code postal"
                                extra={{
                                    isLoading: locationPossibilityIsLoading,
                                    value: entity.postcode,
                                    isClearable: true,
                                    required: true,
                                    options: postalCodesPossibility,
                                    multiple: false,
                                    onInputChange: (_postcode, {action}) => {
                                        if (action === 'menu-close') {
                                            updateLocationPossibility({
                                                id: 'city',
                                                args: {
                                                    postcode:
                                                    entity.postcode?.value,
                                                },
                                            });
                                        }
                                        if (
                                            action === 'input-change' &&
                                            _postcode.length === 5
                                        ) {
                                            setLocationPossibilityIsLoading(true);
                                            updateLocationPossibility({
                                                id: 'city',
                                                args: {postcode: _postcode},
                                            }).then(function () {
                                                setLocationPossibilityIsLoading(
                                                    false
                                                );
                                            });
                                        }
                                    },
                                }}
                                onChange={d => updateEntityState('postcode', d)}
                            />
                        </div>
                    </div>

                </div>

                <h2 style={{marginTop: "2%"}}>A propos du concours que vous souhaitez publier</h2>
                <div style={{marginBottom: "1%"}} className={style.formWrapper}>
                    <div className={style.formColumn}>
                        <Input
                            type="select"
                            name="zone"
                            label="Quelle est l’étendue/zone de visibilité du concours ? *"
                        />
                        <Input
                            type="text"
                            name="Combien y-a-t-il de prix à gagner ? *"
                            label="Combien y-a-t-il de prix à gagner ? *"
                        />
                    </div>
                    <div className={style.formColumn}>
                        <Input
                            type="text"
                            name="Combien y-a-t-il de sponsors ? *"
                            label="Combien y-a-t-il de sponsors ? *"
                        />
                        <Input
                            type="text"
                            name="Quelle est la valeur totale des dotations/prix à gagner ? *"
                            label="Quelle est la valeur totale des dotations/prix à gagner ? *"
                        />
                    </div>
                </div>
                <Input
                    type="textarea"
                    name="Quelle est le thème et la nature du concours ? *"
                    label="Quelle est le thème et la nature du concours ? *"
                    extra={{rows: 16}}

                />
                <Input
                    type="checkbox"
                    onChange={setGtc}
                    defaultValue={gtc}
                />
                <p>
                    En validant ce formulaire, j’accepte qu’un compte membre soit créé pour traiter ma demande.
                </p>
                <div className={style.registerSubmit}>
                    <Button
                        type="submit"
                        name="Envoyer la demande"
                        color={'black'}
                        textColor={'white'}
                        padding={'14px 30px'}
                        border={false}
                        borderRadius={'44px'}
                        width={'245px'}
                    >Envoyer la demande</Button>
                </div>
            </Form>
        </div>
    );
}
   