import BOForm from '@/components/organisms/BO/Form/index.jsx';
import Button from '@/components/atoms/Button';
import style from './style.module.scss';
import Loader from '@/components/atoms/Loader/index.jsx';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import useApiFetch from '@/hooks/useApiFetch.js';
import { useAuthContext } from '@/contexts/AuthContext.jsx';
import { toast } from 'react-toastify';
import Input from "@/components/atoms/Input/index.jsx";

export default function ProfileNotification() {
    const { me, refreshUser } = useAuthContext();
    const apiFetch = useApiFetch();
    const { notificationTypePossibility, meNotificationEnabled } =
        useOutletContext();

    const [notificationTypesSelected, setNotificationTypesSelected] = useState(
        meNotificationEnabled
    );
    
    console.log(meNotificationEnabled);

    function containCode(code) {
        for (let item of notificationTypesSelected) {
            console.log(item);
            console.log(code)
            if (item[0] === code) {
                return true;
            }
        }
        return false;
    }

    function toggleNotificationType(code) {
        if (notificationTypesSelected.has(code)) {
            notificationTypesSelected.delete(code);
            setNotificationTypesSelected(new Map(notificationTypesSelected));
        } else {
            setNotificationTypesSelected(
                new Map(
                    notificationTypesSelected.set(
                        code,
                        notificationTypePossibility.map.get(code)
                    )
                )
            );
        }
    }

    return (
        <Loader active={notificationTypePossibility.isLoading}>
            <div className={style.notificationContainer}>
                <BOForm
                    hasSubmit={true}
                    handleSubmit={function () {
                        const promise = apiFetch(me['@id'], {
                            method: 'PATCH',
                            body: JSON.stringify({
                                notificationEnabled: Array.from(
                                    notificationTypesSelected.values()
                                ),
                            }),
                            headers: {
                                'Content-Type': 'application/merge-patch+json',
                            },
                        });
                        toast.promise(promise, {
                            pending: 'Enregistrement...',
                            success: 'Enregistré !',
                            error: "Erreur lors de l'enregistrement",
                        });
                        5;
                        promise.then(() => {
                            refreshUser();
                        });
                    }}
                >
                    <div>
                        <h2>Si vous êtes simple membre</h2>
                        <div className={style.notificationGroup}>
                            <Input
                                type="checkbox"
                                labelDisposition={"right"}
                                label={"Être informé par email lorsqu'un nouveau concours est publié (tous)"}
                                onChange={() => toggleNotificationType(1)}
                                defaultValue={containCode(1)}
                            />
                            <Input
                                type="checkbox"
                                labelDisposition={"right"}
                                label={"Être informé par email lorsqu’un concours entre en phase de vote"}
                                onChange={() => toggleNotificationType(2)}
                                defaultValue={containCode(2)}
                            />
                            <Input
                                type="checkbox"
                                labelDisposition={"right"}
                                label={"Être informé par email 48h avant la date de fin des votes d’un concours"}
                                onChange={() => toggleNotificationType(3)}
                                defaultValue={containCode(3)}
                            />
                            <Input
                                type="checkbox"
                                labelDisposition={"right"}
                                label={"Être informé par email lorsque les résultats d’un concours sont publiés"}
                                onChange={() => toggleNotificationType(4)}
                                defaultValue={containCode(4)}
                            />
                        </div>
                        <h2>Si vous êtes photographe</h2>
                        <div className={style.notificationGroup}>
                            <Input
                                type="checkbox"
                                labelDisposition={"right"}
                                label={"Être informé par email lorsqu’un nouveau concours est publié et que mon profil satisfait les critères de participation"}
                                onChange={() => toggleNotificationType(5)}
                                defaultValue={containCode(5)}
                            />
                            <Input
                                type="checkbox"
                                labelDisposition={"right"}
                                label={"Être informé par email lorsqu’un concours entre en phase de soumission"}
                                onChange={() => toggleNotificationType(6)}
                                defaultValue={containCode(6)}
                            />
                            <Input
                                type="checkbox"
                                labelDisposition={"right"}
                                label={"Être informé par email 48h avant la date de fin des soumissions d’un concours"}
                                onChange={() => toggleNotificationType(7)}
                                defaultValue={containCode(7)}
                            />
                        </div>
                    </div>
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
                </BOForm>
            </div>
        </Loader>
    );
}
