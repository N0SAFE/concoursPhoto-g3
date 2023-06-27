import {useState, useEffect} from "react";
import {toast} from "react-toastify";
import style from './style.module.scss'
import Chip from "@/components/atoms/Chip/index.jsx";
import Table from "@/components/molecules/Table/index.jsx";
import Form from "@/components/organisms/BO/Form/index.jsx";
import Input from "@/components/atoms/Input/index.jsx";
import Button from "@/components/atoms/Button/index.jsx";
import useApiFetch from "@/hooks/useApiFetch.js";

export default function CompetitionJuryEdit({competition: _competition}) {
    const [competition, setCompetition] = useState(_competition)
    const apiFetch = useApiFetch();
    const [user, setUser] = useState('');
    const [userExist, setUserExist] = useState([]);

    useEffect(() => {
        getUsers();
        const controller = new AbortController();
        const promise = Promise.all([

        ]);
        if (import.meta.env.MODE === 'development') {
            toast.promise(promise, {
                pending: 'Chargement du visuel',
                success: 'Visuel du concours chargé',
                error: 'Erreur lors du chargement du concours',
            });
        }

        return () => setTimeout(() => controller.abort());
    }, []);

    const updateEntityState = (key, value) => {
        setEntity({ ...entity, [key]: value });
    };

    const [entity, setEntity] = useState({
        competition: competition['@id'],
        user: '',
        theFunction: '',
        inviteDate: '',
        acceptanceDate: '',
    });

    const getUsers = function () {
        apiFetch('/users', {
            query: {
                groups: [
                    'user:read',
                ],
            }
        }).then(r => r.json()).then(function (d) {
            console.debug(d)
            setUserExist(d['hydra:member'])
            return d['hydra:member']
        })
    }

    return (
        <div className={style.competitionModalContent}>
            <h2>Concours {">"} onglet “Membres du jury” : édition</h2>
            <div>
                <b>Vous pouvez inviter un ou plusieurs membres du jury mais ils doivent être inscrits/membres de la plateforme au préalable.</b>
                <p>Chaque membre invité recevra un email de demande qu’il devra valider pour intégrer la liste des membres du jury de ce concours.</p>
            </div>
            <Table
                list={competition.memberOfTheJuries}
                fields={[
                    'Nom',
                    'Prénom',
                    'Fonction/poste',
                    'Statut'
                ]}
            >
                {function (competition) {
                    return [
                        { content: competition.user.lastname },
                        { content: competition.user.firstname },
                        { content: competition.theFunction },
                        {
                            content: (
                                <Chip
                                    backgroundColor={competition.inviteDate && !competition.acceptanceDate
                                                ? '#00A3FF'
                                                : (competition.acceptanceDate
                                                    ? '#00CE3A'
                                                    : '#FF0000')
                                    }
                                    color={"#fff"}
                                >
                                    {competition.inviteDate && !competition.acceptanceDate
                                        ? 'En attente'
                                        : (competition.acceptanceDate
                                            ? 'Accepté'
                                            : 'Refusé')
                                    }
                                </Chip>
                            ),
                        },
                    ];
                }}
            </Table>
            <div className={style.juryPropositions}>
                <b>Pour inviter un membre du jury, veuillez renseigner son email ci-dessous*</b>
                <p>Vous devez saisir l’email utilisé par le membre ou saisir son nom/prénom si vous ne le connaissez pas.</p>
                <Form
                    handleSubmit={function () {
                        const promise = new Promise(async (resolve, reject) => {
                            try {
                                if (userExist.find(u => u.email === user)) {
                                    const data = {
                                        competition: competition['@id'],
                                        user: userExist.find(u => u.email === user)['@id'],
                                        theFunction: entity.theFunction,
                                        inviteDate: new Date().toISOString(),
                                        acceptanceDate:  new Date().toISOString(),
                                    };

                                    console.debug('data', data);
                                    const res = await apiFetch('/member_of_the_juries', {
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
                                }
                            } catch (e) {
                                console.error(e);
                                reject(e);
                            }
                        });

                        toast.promise(promise, {
                            pending: "Ajout d'un membre du jury",
                            success: 'Membre du jury ajouté',
                            error: "Erreur lors de l'ajout du membre du jury",
                        });
                    }}
                    hasSubmit={true}
                >
                    <div className={style.juryAdd}>
                        <Input
                            type="text"
                            onChange={setUser}
                        />
                        <Button
                            type="submit"
                            color={'black'}
                            textColor={'white'}
                            padding={'14px 0'}
                            border={false}
                            borderRadius={'44px'}
                            width={'150px'}
                        >
                            Ajouter
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}