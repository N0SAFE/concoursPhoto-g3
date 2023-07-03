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
    const [isLoading, setIsLoading] = useState(false);
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
                    const promise = apiFetch('/advertising_spaces', {
                        method: 'POST',
                        body: JSON.stringify({
                            locationName: entity.locationName,
                            heightPx: entity.heightPx,
                            widthPx: entity.widthPx,
                            referencePrice: entity.referencePrice,
                            state:true
                        }),
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
                        type="text"
                        name="locationName"
                        value={entity.locationName}
                        onChange={e => updateEntityState('locationName', e)}
                    />
                    <Input
                        label="Hauteur en pixel"
                        type="number"
                        name="heightPx"
                        value={entity.heightPx}
                        onChange={e => updateEntityState('heightPx', e)}
                    />
                    <Input
                        label="Largeur en pixel"
                        type="number"
                        name="widthPx"
                        value={entity.widthPx}
                        onChange={e => updateEntityState('widthPx', e)}
                    />
                    <Input
                        label="Prix de référence"
                        type="number"
                        name="referencePrice"
                        value={entity.referencePrice}
                        onChange={e => updateEntityState('referencePrice', e)}
                    />
                </div>
            </Form>
            <Button onClick={() => navigate('/BO/user')}>Retour</Button>
        </Loader>
    );
}
