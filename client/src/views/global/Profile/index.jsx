import Form from '@/components/organisms/BO/Form/index.jsx';
import Input from '@/components/atoms/Input/index.jsx';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import useApiFetch from '@/hooks/useApiFetch.js';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext.jsx';
import Button from '@/components/atoms/Button';
import useLocationPosibility from '@/hooks/useLocationPosibility.js';
import style from './style.module.scss';
import useAuth from '@/hooks/useAuth.js';
import { useModal } from '@/contexts/ModalContext/index.jsx';
import Login from '@/components/organisms/auth/Login/index.jsx';
import Loader from '@/components/atoms/Loader/index.jsx';
import useFilesUploader from '@/hooks/useFilesUploader.js';
import useApiPath from '@/hooks/useApiPath.js';

export default function Profile() {
    const { refreshUser } = useAuthContext();
    const { gendersPossibility, socialNetworksPossibility } =
        useOutletContext(); // to avoid the loading when we change the page
    const [statusPossibility, setStatusPossibility] = useState({
        list: [],
        isLoading: true,
    });

    const [categoriesPossibility, setCategoriesPossibility] = useState({
        list: [],
        isLoading: true,
    });

    const { me } = useAuthContext();
    const { logout } = useAuth();
    const { setModalContent, showModal } = useModal();
    const apiPathComplete = useApiPath();
    const [updatedFile, setUpdatedFile] = useState({
        pictureProfil: me.pictureProfil
            ? {
                  to: apiPathComplete(me.pictureProfil.path),
                  name: me.pictureProfil.defaultName,
              }
            : null,
    });
    const updateFileState = (key, value) => {
        setUpdatedFile({ ...updatedFile, [key]: value });
    };
    const { deleteFile, uploadFile } = useFilesUploader();

    const [locationPossibility, updateLocationPossibility] =
        useLocationPosibility(['cities'], {}, { updateOnStart: false });

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
    ].map(c => ({ label: c, value: c }));

    const [locationPossibilityIsLoading, setLocationPossibilityIsLoading] =
        useState(false);

    const [entity, setEntity] = useState({
        ...me,
        city: { label: me.city.nom, value: me.city.code },
        postcode: { label: me.postcode, value: me.postcode },
        gender: { label: me.gender.label, value: me.gender['@id'] },
        statut: {
            label: me.personalStatut.label,
            value: me.personalStatut['@id'],
        },
        dateOfBirth: new Date(me.dateOfBirth),
        category: {
            label: me.photographerCategory.label,
            value: me.photographerCategory['@id'],
        },
        photographerDescription: me.photographerDescription,
        websiteUrl: me.websiteUrl,
        userLinks: new Map(
            me.userLinks.map(l => {
                return [
                    l?.socialNetworks?.['@id'],
                    {
                        user: l.user,
                        socialNetworks: l?.socialNetworks?.['@id'],
                        link: l.link,
                    },
                ];
            })
        ),
    });

    console.debug(entity);

    const updateEntity = (key, value) => {
        setEntity({ ...entity, [key]: value });
    };

    const [errors, setErrors] = useState({});
    const apiFetch = useApiFetch();
    const navigate = useNavigate();
    const Languetest = [
        { label: 'Francais', value: 'Francais' },
        { label: 'Anglais', value: 'Anglais' },
    ];

    const getCategoryPossibility = () => {
        return apiFetch('/photographer_categories', {
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
        getPersonalstatus().then(data => {
            setStatusPossibility({ list: data, isLoading: false });
        });
        getCategoryPossibility().then(data => {
            setCategoriesPossibility({ list: data, isLoading: false });
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
        <Loader
            active={
                gendersPossibility.isLoading ||
                socialNetworksPossibility.isLoading
            }
            takeInnerContent={true}
            style={{ borderRadius: '10px' }}
        >
            <div className={style.formContainer}>
                <Form
                    handleSubmit={async function () {
                        const newLogoId = await (async () => {
                            if (updatedFile.pictureProfil === null) {
                                return null;
                            } else if (updatedFile.pictureProfil.file) {
                                return await uploadFile({
                                    file: updatedFile.pictureProfil.file,
                                }).then(r => r['@id']);
                            }
                        })();
                        const data = {
                            email: entity.email,
                            plainPassword: entity.password || undefined,
                            firstname: entity.firstname,
                            lastname: entity.lastname,
                            address: entity.address,
                            city: entity.city.value,
                            postcode: entity.postcode.value,
                            gender: entity.gender.value,
                            personalStatut: entity.statut.value,
                            dateOfBirth: entity.dateOfBirth.toISOString(),
                            pseudonym: entity.pseudonym,
                            photographerDescription:
                                entity.photographerDescription,
                            photographerCategory: entity.category.value,
                            websiteUrl: entity.websiteUrl,
                            userLinks: Array.from(entity.userLinks)
                                .map(([key, value]) => {
                                    return value;
                                })
                                .filter(l => l.link !== ''),
                            country: entity.country,
                            pictureProfil: newLogoId,
                        };
                        console.debug('data', data);
                        // if (password !== passwordConfirm) {
                        //     setErrors({ password: "Les mots de passe ne correspondent pas" });
                        //     return;
                        // }
                        const promise = apiFetch('/users/' + me.id, {
                            method: 'PATCH',
                            body: JSON.stringify(data),
                            headers: {
                                'Content-Type': 'application/merge-patch+json',
                            },
                        })
                            .then(r => r.json())
                            .then(data => {
                                console.debug(data);
                                if (data['@type'] === 'hydra:Error') {
                                    console.error(data);
                                    throw new Error(data.description);
                                }
                                if (
                                    me.email !== entity.email ||
                                    entity.plainPassword
                                ) {
                                    logout().then(function () {
                                        setModalContent(<Login />);
                                        showModal();
                                        navigate('/');
                                    });
                                } else {
                                    refreshUser();
                                }
                                if (
                                    updatedFile.pictureProfil === null &&
                                    entity.pictureProfil
                                ) {
                                    deleteFile({
                                        path: entity.pictureProfil['@id'],
                                    });
                                }
                            });

                        if (me.email !== entity.email || entity.plainPassword) {
                            toast.promise(promise, {
                                pending: 'Modification en cours',
                                success:
                                    'Votre profile a bien été modifié, veuillez vous reconnecter',
                                error: 'Erreur lors de la modification de votre profil',
                            });
                        } else {
                            toast.promise(promise, {
                                pending: 'Modification en cours',
                                success: 'Votre profile a bien été modifié',
                                error: 'Erreur lors de la modification de votre profil',
                            });
                        }
                    }}
                    hasSubmit={true}
                >
                    <Input
                        type="profile_image"
                        name="pictureProfil"
                        onChange={d => updateFileState('pictureProfil', d)}
                        extra={{
                            value: updatedFile.pictureProfil,
                            type: 'image',
                        }}
                    />
                    <Input
                        type="radioList"
                        name="genre"
                        onChange={d => updateEntity('gender', d)}
                        extra={{
                            value: entity.gender,
                            options: gendersPossibility.list,
                        }}
                    />
                    <div className={style.formWrapper}>
                        <div className={style.formColumn}>
                            <Input
                                type="text"
                                name="Prénom"
                                label="Prénom*"
                                onChange={d => updateEntity('firstname', d)}
                                defaultValue={entity.firstname}
                            />
                            <Input
                                type="text"
                                name="Nom"
                                label="Nom*"
                                onChange={d => updateEntity('lastname', d)}
                                defaultValue={entity.lastname}
                            />
                            <div className={style.formRow}>
                                <Input
                                    type="date"
                                    name="Date de naissance"
                                    label="Date de naissance*"
                                    onChange={d =>
                                        updateEntity('dateOfBirth', d)
                                    }
                                    defaultValue={entity.dateOfBirth}
                                />
                                <Input
                                    type="select"
                                    name="status"
                                    label="Vous êtes*"
                                    onChange={d => updateEntity('statut', d)}
                                    extra={{
                                        value: entity.statut,
                                        options: statusPossibility.list,
                                        isLoading: statusPossibility.isLoading,
                                    }}
                                    className={style.formSelect}
                                />
                            </div>
                            <Input
                                type="email"
                                name="Email*"
                                label="Email*"
                                extra={{ required: true }}
                                onChange={d => updateEntity('email', d)}
                                defaultValue={entity.email}
                            />
                            <Input
                                type="password"
                                name="Mot de passe"
                                label="Mot de passe*"
                                extra={{
                                    placeholder:
                                        '8 caractères min dont 1 chiffre et 1 lettre majuscule',
                                }}
                                onChange={d => updateEntity('password', d)}
                            />
                        </div>
                        <div className={style.formColumn}>
                            <Input
                                type="text"
                                name="Adresse"
                                label="Adresse"
                                onChange={d => updateEntity('adress', d)}
                                defaultValue={entity.address}
                            />
                            <div className={style.formRow}>
                                {' '}
                                <Input
                                    type="select"
                                    name="Code Postal"
                                    label="Code postal"
                                    extra={{
                                        isLoading: locationPossibilityIsLoading,
                                        value: entity.postcode,
                                        isClearable: true,
                                        required: true,
                                        options: postalCodesPossibility,
                                        multiple: false,
                                        onInputChange: (
                                            _postcode,
                                            { action }
                                        ) => {
                                            if (action === 'menu-close') {
                                                updateLocationPossibility({
                                                    id: 'city',
                                                    args: {
                                                        postcode:
                                                            entity.postcode
                                                                ?.value,
                                                    },
                                                });
                                            }
                                            if (
                                                action === 'input-change' &&
                                                _postcode.length === 5
                                            ) {
                                                updateLocationPossibility({
                                                    id: 'city',
                                                    args: {
                                                        postcode: _postcode,
                                                    },
                                                });
                                            }
                                        },
                                    }}
                                    onChange={d => updateEntity('postcode', d)}
                                    className={style.formSelect}
                                />
                                <Input
                                    type="select"
                                    name="Ville"
                                    label="Ville"
                                    extra={{
                                        isLoading: locationPossibilityIsLoading,
                                        value: entity.city,
                                        isClearable: true,
                                        required: true,
                                        options: citiesPossibility,
                                        multiple: false,
                                        onInputChange: (
                                            cityName,
                                            { action }
                                        ) => {
                                            if (action === 'menu-close') {
                                                updateLocationPossibility({
                                                    id: 'city',
                                                    args: {
                                                        codeCity:
                                                            entity.city?.value,
                                                        city: '',
                                                    },
                                                });
                                            }
                                            if (action === 'input-change') {
                                                updateLocationPossibility({
                                                    id: 'city',
                                                    args: { city: cityName },
                                                });
                                            }
                                        },
                                    }}
                                    onChange={d => updateEntity('city', d)}
                                    className={style.formSelect}
                                />
                            </div>
                            <div className={style.formRow}>
                                <Input
                                    type="text"
                                    name="country"
                                    label="Pays"
                                    onChange={d => updateEntity('country', d)}
                                    defaultValue={entity.country}
                                />
                                <Input
                                    type="select"
                                    name="langue"
                                    label="Langue"
                                    extra={{
                                        value: Languetest[0],
                                        options: Languetest,
                                    }}
                                    className={style.formSelect}
                                />
                            </div>
                            <div className={style.formColumn}>
                                <Input
                                    type="text"
                                    name="pseudonym"
                                    label="Pseudo"
                                    onChange={d => updateEntity('pseudonym', d)}
                                    defaultValue={entity.pseudonym}
                                />
                            </div>
                        </div>
                    </div>
                    <h2>Si vous êtes photographe</h2>
                    <div className={style.formWrapperColumn}>
                        <div className={style.formColumn}>
                            <Input
                                type="textarea"
                                extra={{ rows: 16 }}
                                name="photographerDescription"
                                label="Bio / fiche de présentation dans l’annuaire des photographes (si vous avez soumis au moins 1 photo à un concours)"
                                onChange={d =>
                                    updateEntity('photographerDescription', d)
                                }
                                defaultValue={entity.photographerDescription}
                            />
                        </div>
                        <div className={style.formWrapper}>
                            <Input
                                type="select"
                                name="PhotographeCategory"
                                label="Votre catégorie en tant que photographe ?"
                                onChange={d => updateEntity('category', d)}
                                extra={{
                                    value: entity.category,
                                    options: categoriesPossibility.list,
                                    isLoading: categoriesPossibility.isLoading,
                                }}
                                className={style.formSelect}
                            />
                            <Input
                                type="text"
                                name="websiteUrl"
                                label="Votre site web personnel"
                                onChange={d => updateEntity('websiteUrl', d)}
                                defaultValue={entity.websiteUrl}
                            />
                        </div>
                    </div>
                    <h2>Vos réseaux sociaux</h2>
                    <div className={style.formSocialNetworks}>
                        {socialNetworksPossibility.list.map(socialNetwork => {
                            // socialNetwork.id === 'facebook' || ....
                            return (
                                <Input
                                    type="text"
                                    name="userLinks"
                                    label={socialNetwork.label}
                                    onChange={d => {
                                        const map = entity.userLinks;
                                        map.set(socialNetwork['@id'], {
                                            link: d,
                                            socialNetworks:
                                                socialNetwork['@id'],
                                        });
                                        updateEntity('userLinks', map);
                                    }}
                                    defaultValue={
                                        entity.userLinks.get(
                                            socialNetwork['@id']
                                        )?.link
                                    }
                                />
                            );
                        })}
                    </div>
                    <div className={style.formSubmit}>
                        <Button
                            type="submit"
                            color={'black'}
                            textColor={'white'}
                            padding={'14px 30px'}
                            border={false}
                            borderRadius={'44px'}
                            width={'245px'}
                        >
                            Mettre à jour
                        </Button>
                    </div>
                </Form>
            </div>
        </Loader>
    );
}
