import Input from '@/components/atoms/Input/index.jsx';
import Form from '@/components/organisms/BO/Form';
import useApiFetch from '@/hooks/useApiFetch.js';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader/index.jsx';
import style from './style.module.scss';

export default function PubCreate() {
    const [isLoading, setIsLoading] = useState(true);
    const apiFetch = useApiFetch();
    const navigate = useNavigate();

    const [entity, setEntity] = useState({
        locationName: null,
        heightPx: null,
        widthPx: null,
        referencePrice: null,
    });

    const updateEntityState = (key, value) => {
        setEntity({ ...entity, [key]: value });
    };

    return (
        <Loader active={isLoading}>
            <Form
                className={style.formContainer}
                title="Ajouter une Pub"
                handleSubmit={async function (e) {
                    e.preventDefault();
                    const errors = {};
                    if (!entity.locationName) {
                        const data = {
                            locationName: entity.locationName,
                            heightPx: entity.heightPx,
                            widthPx: entity.widthPx,
                            referencePrice: entity.referencePrice,
                        };
                    }
                    const promise = apiFetch('/advertising_spaces', {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                        .then(r => r.json())
                        .then(data => {
                            if (data['@type'] === 'hydra:Error') {
                                throw data;
                            }
                        });
                    promise.then(() => {
                        navigate('/BO/pub');
                    });
                    toast.promise(promise, {
                        pending: 'Ajout de la Pub en cours...',
                        success: 'Pub ajouté',
                        error: {
                            render: ({ data }) => {
                                console.debug(data);
                                if (data['@type'] === 'hydra:Error') {
                                    return data['hydra:description'];
                                }
                                return data.message;
                            },
                        },
                    });
                }}
            >
                <div className={style.formWrapper}>
                    <Input
                        label="Nom de l'emplacement"
                        name="locationName"
                        value={entity.locationName}
                        onChange={e =>
                            updateEntityState('locationName', e.target.value)
                        }
                        error={errors.locationName}
                    />
                    <Input
                        label="Hauteur en pixel"
                        name="heightPx"
                        value={entity.heightPx}
                        onChange={e =>
                            updateEntityState('heightPx', e.target.value)
                        }
                        error={errors.heightPx}
                    />
                    <Input
                        label="Largeur en pixel"
                        name="widthPx"
                        value={entity.widthPx}
                        onChange={e =>
                            updateEntityState('widthPx', e.target.value)
                        }
                        error={errors.widthPx}
                    />
                    <Input
                        label="Prix de référence"
                        name="referencePrice"
                        value={entity.referencePrice}
                        onChange={e =>
                            updateEntityState('referencePrice', e.target.value)
                        }
                        error={errors.referencePrice}
                    />
                </div>
            </Form>
            <Button onClick={() => navigate('/BO/user')}>Retour</Button>
        </Loader>
    );
}
