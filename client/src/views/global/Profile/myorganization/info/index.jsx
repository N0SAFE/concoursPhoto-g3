import Form from '@/components/organisms/BO/Form/index.jsx';
import Input from '@/components/atoms/Input/index.jsx';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import useApiFetch from '@/hooks/useApiFetch.js';
import Button from '@/components/atoms/Button';
import useLocationPosibility from '@/hooks/useLocationPosibility.js';
import style from './style.module.scss';
import useLocation from '@/hooks/useLocation.js';
import { useOutletContext } from 'react-router-dom';
import Loader from '@/components/atoms/Loader/index.jsx';
import useFilesUploader from "@/hooks/useFilesUploader.js";
import useApiPath from "@/hooks/useApiPath.js";

export default function Myorganization() {
    const { idOrganisation, selectedOrganisation } = useOutletContext();
    const [organisation, setOrganisation] = useState(selectedOrganisation);
    const apiPathComplete = useApiPath();
    const [gtc, setGtc] = useState(false);
    const { deleteFile, uploadFile } = useFilesUploader();

    const [updatedFile, setUpdatedFile] = useState({
        logo: organisation.logo
            ? {
                to: apiPathComplete(organisation.logo.path),
                name: organisation.logo.defaultName,
            }
            : null,
    });

    const updateFileState = (key, value) => {
        setUpdatedFile({ ...updatedFile, [key]: value });
    };

    if (isNaN(idOrganisation)) {
        return <div>the idOrganisation is not a number</div>;
    }

    const [typePossibility, setTypePossibility] = useState({
        isLoading: true,
        list: [],
    });

    const [socialNetworksPossibility, setSocialNetworksPossibility] = useState({
        list: [],
        isLoading: true,
    });

    const [cityIsLoading, setCityIsLoading] = useState(true);
    const { getCityByCode } = useLocation();

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

    const getCity = (controller, cityCode) => {
        return getCityByCode(cityCode, { controller });
    };

    const updatesOrgnisation = (...args) => {
        setOrganisation(
            args.reduce(function (acc, [key, value]) {
                return { ...acc, [key]: value };
            }, organisation)
        );
    };
    const updateOrganization = (key, value) => {
        setOrganisation({ ...organisation, [key]: value });
    };

    const [errors, setErrors] = useState({});
    const apiFetch = useApiFetch();

    const getSocialNetworks = () => {
        return apiFetch('/social_networks', {
            method: 'GET',
        })
            .then(r => r.json())
            .then(data => {
                console.debug(data);
                return data['hydra:member'];
            });
    };

    const getOrganizationTypePossibility = controller => {
        return apiFetch('/organization_types', {
            method: 'GET',
            signal: controller?.signal,
        })
            .then(r => r.json())
            .then(data => {
                return data['hydra:member'].map(function (item) {
                    return { label: item.label, value: item['@id'] };
                });
            });
    };

    useEffect(() => {
        setOrganisation(selectedOrganisation);
        const controller = new AbortController();
        if (selectedOrganisation.citycode) {
            getCity(controller, selectedOrganisation.citycode).then(data => {
                if (selectedOrganisation.postcode) {
                    updatesOrgnisation(
                        [
                            '_city',
                            {
                                label: data.nom,
                                value: data.code,
                            },
                        ],
                        [
                            '_postcode',
                            {
                                label: selectedOrganisation.postcode,
                                value: selectedOrganisation.postcode,
                            },
                        ]
                    );
                } else {
                    updatesOrgnisation([
                        '_city',
                        {
                            label: data.nom,
                            value: data.code,
                        },
                    ]);
                }
                setCityIsLoading(false);
            });
        }

        getSocialNetworks().then(data =>
            setSocialNetworksPossibility({ list: data, isLoading: false })
        );

        getOrganizationTypePossibility().then(data =>
            setTypePossibility({ list: data, isLoading: false })
        );
    }, [selectedOrganisation]);

    return (
        <Loader active={socialNetworksPossibility.isLoading} takeInnerContent={true} style={{borderRadius: '10px'}}>
            <div className={style.formContainer}>
                <Form
                    handleSubmit={async function () {
                        const promise = new Promise(async (resolve, reject) => {
                            if (!gtc) {
                                toast.error("Vous devez déclarer !");
                                reject("Vous devez déclarer !");
                                return;
                            }
                            const newLogoId = await (async () => {
                                if (updatedFile.logo === null) {
                                    return null;
                                } else if (updatedFile.logo.file) {
                                    return await uploadFile({
                                        file: updatedFile.logo.file,
                                    }).then((r) => r["@id"]);
                                }
                            })();

                            const data = {
                                organizerName: organisation.organizerName,
                                email: organisation.email,
                                numberPhone: organisation.numberPhone,
                                websiteUrl: organisation.websiteUrl,
                                address: organisation.address,
                                citycode: organisation._city?.value,
                                postcode: organisation._postcode?.value,
                                intraCommunityVat: organisation.intraCommunityVat,
                                numberSiret: organisation.numberSiret,
                                country: organisation.country,
                                organizationType: organisation.organizationType.value,
                                description: organisation.description,
                                logo: newLogoId,
                                organizationLinks: Array.from(organisation.organizationLinks)
                                    .map(([key, value]) => {
                                        return value;
                                    })
                                    .filter((l) => l.link !== ""),
                            };

                            const apiPromise = apiFetch(`/organizations/${organisation.id}`, {
                                method: "PATCH",
                                body: JSON.stringify(data),
                                headers: {
                                    "Content-Type": "application/merge-patch+json",
                                },
                            })
                                .then((r) => r.json())
                                .then((data) => {
                                    console.debug(data);
                                    if (data["@type"] === "hydra:Error") {
                                        console.error(data);
                                        throw new Error(data.description);
                                    }
                                    if (updatedFile.logo === null && organisation.logo) {
                                        deleteFile({
                                            path: organisation.logo["@id"],
                                        });
                                    }
                                });

                            toast.promise(apiPromise, {
                                pending: "Modification en cours",
                                success: "Votre organisation a bien été modifiée",
                                error: "Erreur lors de la modification de votre organisation",
                            })
                                .then(resolve)
                                .catch(reject);
                        });

                        await promise;
                    }}
                    hasSubmit={true}
                >
                    <h2>{organisation.organizerName}</h2>
                    <div className={style.formProfile}>
                        <Input
                            type="profile_image"
                            name="logo"
                            onChange={d => updateFileState('logo', d)}
                            extra={{
                                value: updatedFile.logo,
                                type: 'image',
                            }}
                        />
                    </div>
                    <div className={style.formWrapper}>
                        <div className={style.formColumn}>
                            <Input
                                type="text"
                                name="organizerName"
                                label="Nom de l'organisation"
                                onChange={d =>
                                    updateOrganization('organizerName', d)
                                }
                                extra={{value: organisation.organizerName}}
                            />
                            <Input
                                type="select"
                                name="type"
                                label="Type"
                                extra={{
                                    isLoading: typePossibility.isLoading,
                                    options: typePossibility.list,
                                    required: true,
                                    value: organisation.organizationType,
                                }}
                                onChange={d =>
                                    updateOrganization('organizationType', d)
                                }
                            />
                            <Input
                                type="text"
                                name="email"
                                label="Email"
                                onChange={d => updateOrganization('email', d)}
                                extra={{value: organisation.email}}
                            />
                            <Input
                                type="text"
                                name="numberPhone"
                                label="Numéro de téléphone"
                                onChange={d => updateOrganization('numberPhone', d)}
                                extra={{value: organisation.numberPhone}}
                            />
                            <Input
                                type="text"
                                name="websiteUrl"
                                label="Site web"
                                onChange={d => updateOrganization('websiteUrl', d)}
                                extra={{value: organisation.websiteUrl}}
                            />
                        </div>
                        <div className={style.formColumn}>
                            <Input
                                type="text"
                                name="address"
                                label="Adresse"
                                onChange={d => updateOrganization('address', d)}
                                extra={{value: organisation.address}}
                            />
                            <div className={style.formRow}>
                                <Input
                                    type="select"
                                    name="city"
                                    label="Ville"
                                    extra={{
                                        isLoading:
                                        organisation.locationPossibilityIsLoading,
                                        value: organisation._city,
                                        isClearable: true,
                                        required: true,
                                        options: citiesPossibility,
                                        multiple: false,
                                        onInputChange: (cityName, {action}) => {
                                            if (action === 'menu-close') {
                                                updateLocationPossibility({
                                                    id: 'city',
                                                    args: {
                                                        codeCity:
                                                        organisation._city
                                                            ?.value,
                                                        city: '',
                                                    },
                                                });
                                            }
                                            if (action === 'input-change') {
                                                updateLocationPossibility({
                                                    id: 'city',
                                                    args: {city: cityName},
                                                });
                                            }
                                        },
                                        onMenuOpen: function () {
                                            updateLocationPossibility({
                                                id: 'city',
                                                args: {
                                                    codeCity:
                                                    organisation._city?.value,
                                                    postcode:
                                                    organisation._postcode
                                                        ?.value,
                                                },
                                            });
                                        },
                                    }}
                                    onChange={d => {
                                        updateOrganization('_city', d);
                                        updateLocationPossibility({
                                            id: 'city',
                                            args: {
                                                codeCity: d?.value,
                                                postcode:
                                                organisation._postcode?.value,
                                            },
                                        });
                                    }}
                                />
                                <Input
                                    type="select"
                                    name="postalCode"
                                    label="Code postal"
                                    extra={{
                                        isLoading: locationPossibilityIsLoading,
                                        value: organisation._postcode,
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
                                                        organisation._postcode
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
                                                    args: {postcode: _postcode},
                                                });
                                            }
                                        },
                                        onMenuOpen: function () {
                                            updateLocationPossibility({
                                                id: 'city',
                                                args: {
                                                    codeCity:
                                                    organisation._city?.value,
                                                    postcode:
                                                    organisation._postcode
                                                        ?.value,
                                                },
                                            });
                                        },
                                    }}
                                    onChange={d => {
                                        updateOrganization('_postcode', d);
                                        updateLocationPossibility({
                                            id: 'city',
                                            args: {
                                                codeCity: organisation._city?.value,
                                                postcode: d?.value,
                                            },
                                        });
                                    }}
                                />
                            </div>
                            <div className={style.formColumn}>
                                <Input
                                    type="text"
                                    name="country"
                                    label="Pays"
                                    onChange={d => updateOrganization('country', d)}
                                    extra={{value: organisation.country}}
                                />
                                <Input
                                    type="text"
                                    name="intraCommunityVat"
                                    label="Numéro de TVA"
                                    onChange={d =>
                                        updateOrganization('intraCommunityVat', d)
                                    }
                                    defaultValue={organisation.intraCommunityVat}
                                />
                                <Input
                                    type="text"
                                    name="numberSiret"
                                    label="Numéro de SIRET"
                                    onChange={d => updateOrganization('numberSiret', d)}
                                    extra={{value: organisation.numberSiret}}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={style.formWrapperColumn}>
                        <h2>Présentation</h2>
                        <Input
                            type="textarea"
                            name="description"
                            extra={{rows: 16, value: organisation.description}}
                            label="Description"
                            onChange={d => updateOrganization('country', d)}
                        />
                    </div>
                    <h2>Réseaux sociaux de l’organisation</h2>
                    <div className={style.formSocialNetworks}>
                        {socialNetworksPossibility.list.map(socialNetwork => {
                            // socialNetwork.id === 'facebook' || ....
                            return (<Input
                                type="text"
                                name="organizationLinks"
                                label={socialNetwork.label}
                                onChange={d => {
                                    const map = organisation.organizationLinks
                                    map.set(socialNetwork['@id'], {
                                        link: d,
                                        socialNetworks: socialNetwork['@id'],
                                    })
                                    updateOrganization('organizationLinks', map)
                                }}
                                defaultValue={organisation.organizationLinks.get(socialNetwork['@id'])?.link}
                            />)
                        })}
                    </div>
                    <div className={style.formRules}>
                        <Input
                            type="checkbox"
                            onChange={setGtc}
                            defaultValue={gtc}
                        />
                        <p>
                            Je déclare exercer un mandat ou une fonction qui m’octroie
                            le droit d’administrer cette organisation et de publier des jeux concours en son nom
                        </p>
                    </div>
                    <div className={style.formSubmit}>
                        <Button
                            type="submit"
                            color={cityIsLoading ? 'grey' : 'black'}
                            textColor={'white'}
                            padding={'14px 30px'}
                            border={false}
                            borderRadius={'44px'}
                            width={'245px'}
                            disabled={cityIsLoading}
                        >
                            Sauvegarder
                        </Button>
                    </div>
                </Form>
            </div>
        </Loader>
    );
}
