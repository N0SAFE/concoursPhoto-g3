import BOForm from '@/components/organisms/BO/Form/index.jsx';
import Button from '@/components/atoms/Button';
import style from './style.module.scss';
import Loader from '@/components/atoms/Loader';
import { useState } from 'react';
import Input from "@/components/atoms/Input";
import {useAuthContext} from "@/contexts/AuthContext.jsx";
import useApiFetch from "@/hooks/useApiFetch.js";
import {toast} from "react-toastify";

export default function ProfileNotification() {
    const [isLoading, setIsLoading] = useState(false);
    const { me } = useAuthContext();
    const [notificationEnabled, setNotificationEnabled] = useState();
    const apiFetch = useApiFetch();

    const updateEntityState = (key, value) => {
        setEntity({ ...entity, [key]: value });
    };

    const [entityPossibility, setEntityPossibility] = useState({
        notificationEnabled: [],
        statut: [],
    });

    const [entity, setEntity] = useState({
        notificationEnabled: null,
        statut: '',
    });

    let notificationOne, notificationTwo, notificationThree, notificationFour, notificationFive, notificationSix, notificationSeven, notificationEight = "";
    me.notificationEnabled?.map(notification => {
        if (notification.notification_code === 1) {
            notificationOne = true;
        } else if (notification.notification_code === 2) {
            notificationTwo = true;
        } else if (notification.notification_code === 3) {
            notificationThree = true;
        } else if (notification.notification_code === 4) {
            notificationFour = true;
        } else if (notification.notification_code === 5) {
            notificationFive = true;
        } else if (notification.notification_code === 6) {
            notificationSix = true;
        } else if (notification.notification_code === 7) {
            notificationSeven = true;
        } else if (notification.notification_code === 8) {
            notificationEight = true;
        }
    })

    return (
        <Loader active={isLoading}>
            <div className={style.formContainer}>
                <BOForm title="Si vous êtes simple membre" hasSubmit={true} handleSubmit={
                    function () {
                        const promise = new Promise(async (resolve, reject) => {
                            try {
                                const data = {
                                    firstname: me.firstname,
                                    lastname: me.lastname,
                                    dateOfBirth: me.date_of_birth,
                                    email: me.email,
                                    personalStatut: me.statut.value,
                                    notificationEnabled: me.notificationEnabled.map(n => n.value)
                                };
                                console.debug('data', data);
                                const res = await apiFetch('/users', {
                                    method: 'POST',
                                    body: JSON.stringify(data),
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                })
                                    .then(r => r.json())
                                    .then(data => {
                                        console.debug(data);
                                        if (data['@type'] === 'hydra:Error') {
                                            throw new Error(data.description);
                                        }
                                    });
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
                            pending: 'Ajout de la notification en cours...',
                            success: 'Notification ajoutée !',
                            error: "Erreur lors de l'ajout de la notification",
                        });
                    }
                }>
                    <div>
                        <div className={style.notificationContainer}>
                            <Input type="checkbox" label="Être informé par email lorsqu'un nouveau concours est publié" labelDisposition="right" defaultValue={notificationOne} onChange={d => updateEntityState('notificationEnabled', d)} />
                            <Input type="checkbox" label="Être informé par email lorsqu’un concours entre en phase de vote" labelDisposition="right" defaultValue={notificationTwo} onChange={d => updateEntityState('notificationEnabled', d)} />
                            <Input type="checkbox" label="Être informé par email 48h avant la date de fin
                                des votes d’un concours" labelDisposition="right" defaultValue={notificationThree} onChange={d => updateEntityState('notificationEnabled', d)} />
                            <Input type="checkbox" label="Être informé par email lorsque les résultats
                                d’un concours sont publiés" labelDisposition="right" defaultValue={notificationFour} onChange={d => updateEntityState('notificationEnabled', d)} />
                            <Input type="checkbox" label="Être informé par email lorsqu’une nouvel
                                article/actualité est publiée dans le blog" labelDisposition="right" defaultValue={notificationFive} onChange={d => updateEntityState('notificationEnabled', d)} />
                        </div>
                        <h2>Si vous êtes photographe</h2>
                        <div className={style.notificationContainer}>
                            <Input type="checkbox" label="Être informé lorsqu’un nouveau concours est
                                publié et que mon profil satisfait les
                                critères de participation" labelDisposition="right" defaultValue={notificationSix} onChange={d => updateEntityState('notificationEnabled', d)} />
                            <Input type="checkbox" label="Être informé lorsqu’un concours entre en
                                phase de soumission" labelDisposition="right" defaultValue={notificationSeven} onChange={d => updateEntityState('notificationEnabled', d)} />
                            <Input type="checkbox" label="Être informé 48h avant la date de fin des
                                soumissions d’un concours" labelDisposition="right" defaultValue={notificationEight} onChange={d => updateEntityState('notificationEnabled', d)} />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        name="Mettre à jour"
                        color={'black'}
                        textColor={'white'}
                        padding={'14px 30px'}
                        border={false}
                        borderRadius={'44px'}
                        width={'245px'}
                    />
                </BOForm>
            </div>
        </Loader>
    );
}
