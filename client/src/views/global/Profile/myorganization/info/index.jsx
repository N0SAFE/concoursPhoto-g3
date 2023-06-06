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

export default function Myorganization() {
    const { idOrganisation, selectedOrganisation } = useOutletContext();
    const [organisation, setOrganisation] = useState(selectedOrganisation);

    if (isNaN(idOrganisation)) {
        return <div>the idOrganisation is not a number</div>;
    }

    const [typePossibility, setTypePossibility] = useState({
        isLoading: true,
        list: [],
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
    const updateOrgnisation = (key, value) => {
        console.log(key, value);
        setOrganisation({ ...organisation, [key]: value });
    };

    const [errors, setErrors] = useState({});
    const apiFetch = useApiFetch();

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

        getOrganizationTypePossibility().then(data =>
            setTypePossibility({ list: data, isLoading: false })
        );
    }, [selectedOrganisation]);

    return (
        <div className={style.formContainer}>
            <Form
                handleSubmit={function () {
                    const data = {
                        organizerName: organisation.organizer_name,
                        email: organisation.email,
                        numberPhone: organisation.number_phone,
                        websiteUrl: organisation.website_url,
                        address: organisation.address,
                        city: organisation._city?.value,
                        postcode: organisation._postcode?.value,
                        intraCommunityVat: organisation.intra_community_vat,
                        numberSiret: organisation.number_siret,
                        country: organisation.country,
                        organizationType: organisation.organizationType.value,
                        description: organisation.description,
                    };
                    const promise = apiFetch(
                        `/organizations/${organisation.id}`,
                        {
                            method: 'PATCH',
                            body: JSON.stringify(data),
                            headers: {
                                'Content-Type': 'application/merge-patch+json',
                            },
                        }
                    )
                        .then(r => r.json())
                        .then(data => {
                            console.debug(data);
                            if (data['@type'] === 'hydra:Error') {
                                console.error(data);
                                throw new Error(data.description);
                            }
                        });
                    toast.promise(promise, {
                        pending: 'Modification en cours',
                        success: 'Votre organisation a bien été modifié',
                        error: 'Erreur lors de la modification de votre organisation',
                    });
                }}
                hasSubmit={true}
            >
                <div className={style.formInputContainer}>
                    <div className={style.formInputContainerColumn}>
                        <Input
                            type="text"
                            name="organizer_name"
                            label="Nom de l'organisation"
                            onChange={d =>
                                updateOrgnisation('organizer_name', d)
                            }
                            extra={{ value: organisation.organizer_name }}
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
                                updateOrgnisation('organizationType', d)
                            }
                        />

                        <Input
                            type="text"
                            name="email"
                            label="Email"
                            onChange={d => updateOrgnisation('email', d)}
                            extra={{ value: organisation.email }}
                        />
                        <Input
                            type="text"
                            name="number_phone"
                            label="Numéro de téléphone"
                            onChange={d => updateOrgnisation('number_phone', d)}
                            extra={{ value: organisation.number_phone }}
                        />
                        <Input
                            type="text"
                            name="website_url"
                            label="Site web"
                            onChange={d => updateOrgnisation('website_url', d)}
                            extra={{ value: organisation.website_url }}
                        />
                    </div>
                    <div className={style.formInputContainerColumn}>
                        <Input
                            type="text"
                            name="address"
                            label="Adresse"
                            onChange={d => updateOrgnisation('address', d)}
                            extra={{ value: organisation.address }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
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
                                    onInputChange: (cityName, { action }) => {
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
                                                args: { city: cityName },
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
                                    updateOrgnisation('_city', d);
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
                                    onInputChange: (_postcode, { action }) => {
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
                                                args: { postcode: _postcode },
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
                                    updateOrgnisation('_postcode', d);
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
                        <Input
                            type="text"
                            name="country"
                            label="Pays"
                            onChange={d => updateOrgnisation('country', d)}
                            extra={{ value: organisation.country }}
                        />
                        <Input
                            type="text"
                            name="intra_community_vat"
                            label="Numéro de TVA"
                            onChange={d =>
                                updateOrgnisation('intra_community_vat', d)
                            }
                            defaultValue={organisation.intra_community_vat}
                        />
                        <Input
                            type="text"
                            name="number_siret"
                            label="Numéro de SIRET"
                            onChange={d => updateOrgnisation('number_siret', d)}
                            extra={{ value: organisation.number_siret }}
                        />
                    </div>
                </div>
                <div className="test">
                    <h2>Présentation</h2>
                </div>

                <Input
                    type="textarea"
                    name="description"
                    extra={{ rows: 16, value: organisation.description }}
                    label="Description"
                    onChange={d => updateOrgnisation('country', d)}
                ></Input>
                <h2>Réseaux sociaux de l’organisation</h2>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                    }}
                >
                    <div
                        className="container"
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '50px',
                        }}
                    >
                        <Input type="text" label="Votre page Facebook"></Input>
                        <Input type="text" label="Votre chaîne Youtube"></Input>
                    </div>
                    <div
                        className="container"
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '50px',
                        }}
                    >
                        <Input type="text" label="Votre page Instagram"></Input>
                        <Input type="text" label="Votre compte Twitter"></Input>
                    </div>
                    <div
                        className="container"
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '50px',
                        }}
                    >
                        <Input type="text" label="Votre page Linkedin"></Input>
                        <Input type="text" label="Votre compte TikTok"></Input>
                    </div>
                </div>
                <div className={style.registerSubmit}>
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
                        Mettre à jour
                    </Button>
                </div>
            </Form>
        </div>
    );
}
