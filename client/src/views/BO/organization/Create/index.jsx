import Input from "@/components/atoms/Input/index.jsx";
import BOCreate from "@/components/organisms/BO/Form";
import useApiFetch from "@/hooks/useApiFetch.js";
import { useState, useEffect } from "react";
import useLocationPosibility from "@/hooks/useLocationPosibility.js";
import { toast } from "react-toastify";
import useFilesUploader from "@/hooks/useFilesUploader.js";
import Button from "@/components/atoms/Button";
import Loader from '@/components/atoms/Loader/index.jsx';
import { useNavigate } from "react-router-dom";
import style from './style.module.scss';


export default function OrganizationCreate() {
    const [isLoading, setIsLoading] = useState(true);
    const apiFetch = useApiFetch();
    const { uploadFile } = useFilesUploader();
    const navigate = useNavigate();

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
        useState(true);

    const [entityPossibility, setEntityPossibility] = useState({ types: [] });
    const [entity, setEntity] = useState({
        organizerName: null,
        description: null,
        address: null,
        city: null,
        postcode: null,
        phoneNumber: null,
        email: null,
        state: false,
        logo: null,
        country: null,
        creationDate: null,
        websiteUrl: null,
        organizationType: null,
        numberSiret: null,
        intraCommunityVat: null,
    });

    const updateEntityState = (key, value) => {
        setEntity({ ...entity, [key]: value });
    };

    const [errors, setErrors] = useState({});

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
        const controller = new AbortController();
        const promise = Promise.all([
            getOrganizationTypePossibility(controller),
        ]).then(([types]) => setEntityPossibility({ types }));
        promise.then(function () {
            setIsLoading(false);
        });
        if (import.meta.env.MODE === 'development') {
            toast.promise(promise, {
                pending: 'Chargement des données',
                success: 'Données chargées',
                error: 'Erreur lors du chargement des données',
            });
        }
        return () => setTimeout(() => controller.abort());
    }, []);

    useEffect(() => {
        updateLocationPossibility({
            args: {
                codeCity: entity.city?.value,
                postcode: entity.postcode?.value,
            },
        }).then(function (d) {
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
    console.debug('entity', entity);
    return (
        <Loader active={isLoading}>
            <BOCreate
                title="Création d'une organisation"
                handleSubmit={function () {
                    const promise = new Promise(async (resolve, reject) => {
                        try {
                            const logoId = await (async () => {
                                if (entity.logo === null) {
                                    return null;
                                } else {
                                    const logo = await uploadFile({
                                        file: entity.logo.file,
                                    });
                                    return logo['@id'];
                                }
                            })();
                            const data = {
                                organizerName: entity.organizerName,
                                description: entity.description,
                                address: entity.address,
                                citycode: entity.city.value,
                                postcode: entity.postcode.value,
                                numberPhone: entity.phoneNumber,
                                email: entity.email,
                                state: entity.state,
                                country: 'France',
                                creationDate: new Date().toISOString(),
                                websiteUrl: entity.websiteUrl,
                                organizationType: entity.organizationType.value,
                                logo: logoId,
                                numberSiret: entity.numberSiret,
                                intraCommunityVat: entity.intraCommunityVat,
                            };
                            console.debug('data', data);
                            const res = await apiFetch('/organizations', {
                                method: 'POST',
                                body: JSON.stringify(data),
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            })
                                .then(r => r.json())
                                .then(data => {
                                    if (data['@type'] === 'hydra:Error') {
                                        throw new Error(data.description);
                                    }
                                    return data;
                                });
                            console.debug('res', res);
                            resolve(res);
                        } catch (e) {
                            console.error(e);
                            reject(e);
                        }
                    });

                    promise.then(function () {
                        navigate('/BO/organization');
                    });
                    toast.promise(promise, {
                        pending: "Création de l'organisation",
                        success: 'Organisation créée',
                        error: "Erreur lors de la création de l'organisation",
                    });
                }}
            >
                <div className={style.all}>
                    <Input
                        type="text"
                        name="organizerName"
                        label="Nom de l'organisation"
                        extra={{ required: true }}
                        onChange={d => updateEntityState('organizerName', d)}
                        defaultValue={entity.organizerName}
                    />

                    <Input
                        type="text"
                        name="description"
                        label="Description"
                        extra={{ required: true }}
                        onChange={d => updateEntityState('description', d)}
                        defaultValue={entity.description}
                    />

                    <Input
                        type="text"
                        name="phoneNumber"
                        label="Numéro de téléphone"
                        extra={{ required: true }}
                        onChange={d => updateEntityState('phoneNumber', d)}
                        defaultValue={entity.phoneNumber}
                    />

                    <Input
                        type="file"
                        name="logo"
                        label="Logo"
                        onChange={d => updateEntityState('logo', d)}
                        extra={{ value: entity.logo, type: 'image' }}
                    />

                    <Input
                        type="checkbox"
                        name="state"
                        label="Actif"
                        onChange={d => updateEntityState('state', d)}
                        defaultValue={entity.state}
                    />
                    <Input
                        type="email"
                        name="email"
                        label="Email"
                        extra={{ required: true }}
                        onChange={d => updateEntityState('email', d)}
                        defaultValue={entity.email}
                    />
                    <Input
                        type="text"
                        name="numberSiret"
                        label="Numéro SIRET"
                        extra={{ required: true }}
                        onChange={d => updateEntityState('numberSiret', d)}
                        defaultValue={entity.numberSiret}
                    />
                    <Input
                        type="text"
                        name="intraCommunityVat"
                        label="Numéro TVA"
                        extra={{ required: true }}
                        onChange={d =>
                            updateEntityState('intraCommunityVat', d)
                        }
                        defaultValue={entity.intraCommunityVat}
                    />
                    <Input
                        type="text"
                        name="address"
                        label="Adresse"
                        extra={{ required: true }}
                        onChange={d => updateEntityState('address', d)}
                        defaultValue={entity.address}
                    />

                    <Input
                        type="text"
                        name="websiteUrl"
                        label="Site internet"
                        extra={{ required: true }}
                        onChange={d => updateEntityState('websiteUrl', d)}
                        defaultValue={entity.websiteUrl}
                    />

                    <Input
                        type="select"
                        name="type"
                        label="Type"
                        defaultValue={entity.type}
                        extra={{
                            options: entityPossibility.types,
                            required: true,
                        }}
                        onChange={d => updateEntityState('organizationType', d)}
                    />

                    <div style={{ display: 'flex', gap: '30px' }}>
                        <Input
                            type="select"
                            name="city"
                            label="Ville"
                            extra={{
                                isLoading: locationPossibilityIsLoading,
                                isClearable: true,
                                required: true,
                                options: citiesPossibility,
                                multiple: false,
                                value: entity.city,
                                onInputChange: (cityName, { action }) => {
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
                                        updateLocationPossibility({
                                            id: 'city',
                                            args: { city: cityName },
                                        });
                                    }
                                },
                            }}
                            onChange={d => {
                                updateEntityState('city', d);
                            }}
                        />

                        <Input
                            type="select"
                            name="postalCode"
                            label="Code postal"
                            extra={{
                                isLoading: locationPossibilityIsLoading,
                                isClearable: true,
                                required: true,
                                options: postalCodesPossibility,
                                multiple: false,
                                value: entity.postcode,
                                onInputChange: (_postcode, { action }) => {
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
                                        updateLocationPossibility({
                                            id: 'city',
                                            args: { postcode: _postcode },
                                        });
                                    }
                                },
                            }}
                            onChange={d => updateEntityState('postcode', d)}
                        />
                    </div>
                </div>
            </BOCreate>
            <Button name="Retour" onClick={() => navigate("/BO/organization")} />
        </Loader>
    );
}
