import Form from '@/components/organisms/BO/Form/index.jsx';
import Button from '@/components/atoms/Button';
import style from './style.module.scss';
import Loader from '@/components/atoms/Loader/index.jsx';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import useApiFetch from '@/hooks/useApiFetch.js';
import { useAuthContext } from '@/contexts/AuthContext.jsx';
import { toast } from 'react-toastify';

export default function IndexNotif() {
    const { me, refreshUser } = useAuthContext();
    const apiFetch = useApiFetch();
    const { notificationTypePossibility, meNotificationEnabled } =
        useOutletContext();

    const [notificationTypesSelected, setNotificationTypesSelected] = useState(
        meNotificationEnabled
    );

    function containCode(code) {
        for (let item of notificationTypesSelected) {
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
            <div className={style.formContainer}>
                <Form
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
                    <div style={{ marginTop: '10px' }}>
                        <h2>Si vous êtes simple membre</h2>
                        <div
                            style={{
                                backgroundColor: '#F5F5F5',
                                paddingBottom: '2%',
                                paddingTop: '2%',
                                paddingRight: '2%',
                                paddingLeft: '2%',
                            }}
                        >
                            <input
                                type="checkbox"
                                id="scales"
                                name="1"
                                onChange={() => toggleNotificationType(1)}
                                checked={containCode(1)}
                            ></input>
                            <label htmlFor="1">
                                Être informé par email lorsqu'un nouveau
                                concours est publié
                            </label>
                            <br />
                            <input
                                type="checkbox"
                                id="scales"
                                name="2"
                                onChange={() => toggleNotificationType(2)}
                                checked={containCode(2)}
                            ></input>
                            <label htmlFor="2">
                                Être informé par email lorsqu’un concours entre
                                en phase de vote
                            </label>
                            <br />
                            <input
                                type="checkbox"
                                id="scales"
                                name="3"
                                onChange={() => toggleNotificationType(3)}
                                checked={containCode(3)}
                            ></input>
                            <label htmlFor="3">
                                Être informé par email 48h avant la date de fin
                                des votes d’un concours
                            </label>
                            <br />
                            <input
                                type="checkbox"
                                id="scales"
                                name="4"
                                onChange={() => toggleNotificationType(4)}
                                checked={containCode(4)}
                            ></input>
                            <label htmlFor="4">
                                Être informé par email lorsque les résultats
                                d’un concours sont publiés
                            </label>
                            <br />
                            <input
                                type="checkbox"
                                id="scales"
                                name="5"
                                onChange={() => toggleNotificationType(5)}
                                checked={containCode(5)}
                            ></input>
                            <label htmlFor="5">
                                Être informé par email lorsqu’une nouvel
                                article/actualité est publiée dans le blog
                            </label>
                            <br />
                        </div>

                        <div
                            style={{ marginTop: '10px', marginBottom: '10px' }}
                        >
                            <h2>Si vous êtes photographe</h2>
                            <div
                                style={{
                                    backgroundColor: '#F5F5F5',
                                    paddingBottom: '2%',
                                    paddingTop: '2%',
                                    paddingRight: '2%',
                                    paddingLeft: '2%',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    id="scales"
                                    name="6"
                                    onChange={() => toggleNotificationType(6)}
                                    checked={containCode(6)}
                                ></input>
                                <label htmlFor="6">
                                    Être informé lorsqu’un nouveau concours est
                                    publié et que mon profil satisfait les
                                    critères de participation
                                </label>
                                <br />
                                <input
                                    type="checkbox"
                                    id="scales"
                                    name="7"
                                    onChange={() => toggleNotificationType(7)}
                                    checked={containCode(7)}
                                ></input>
                                <label htmlFor="7">
                                    Être informé lorsqu’un concours entre en
                                    phase de soumission
                                </label>
                                <br />
                                <input
                                    type="checkbox"
                                    id="scales"
                                    name="8"
                                    onChange={() => toggleNotificationType(8)}
                                    checked={containCode(8)}
                                ></input>
                                <label htmlFor="8">
                                    Être informé 48h avant la date de fin des
                                    soumissions d’un concours
                                </label>
                                <br />
                            </div>
                        </div>
                    </div>
                    <div className={style.registerSubmit}>
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
