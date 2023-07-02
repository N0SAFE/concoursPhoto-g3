import {useState, useEffect} from "react";
import {toast} from "react-toastify";
import style from './style.module.scss'
import Form from "@/components/organisms/BO/Form/index.jsx";
import Button from "@/components/atoms/Button/index.jsx";
import useApiFetch from "@/hooks/useApiFetch.js";
import Input from "@/components/atoms/Input/index.jsx";
import useApiPath from "@/hooks/useApiPath.js";
import useFilesUpdater from "@/hooks/useFilesUploader.js";
import SponsorsLines from "@/components/molecules/SponsorsLines/SponsorsLines.jsx";
import Loader from "@/components/atoms/Loader/index.jsx";

export default function SponsorsEdit({competition: _competition}) {
    const apiFetch = useApiFetch()
    const [competition, setCompetition] = useState(_competition)
    const [competitionSponsors, setCompetitionSponsors] = useState([])
    const [sponsorsPossibility, setStatusPossibility] = useState({
        list: [],
        isLoading: true
    });
    const {uploadFile} = useFilesUpdater();
    const [isLoading, setIsLoading] = useState(true)
    const [sponsors, setSponsors] = useState([])


    useEffect(() => {
        getSponsorsInCompetition().then(data => {
            setStatusPossibility({ list: data, isLoading: false });
        });
        getSponsors();
    }, [])

    const getSponsorsInCompetition = function () {
        const promise = apiFetch('/sponsors', {
            query: {
                competition: competition['@id'],
                groups: [
                    'sponsor:competition:read',
                    'sponsor:organization:read',
                    'organization:read',
                    'organization:logo:read',
                    'file:read'
                ],
            }
        }).then(r => r.json()).then(function (d) {
            console.debug(d)
            setCompetitionSponsors(d['hydra:member'])
            setIsLoading(false)
            return d['hydra:member']
        })

        toast.promise(promise, {
            pending: 'Chargement des sponsors',
            success: 'Sponsors chargés',
            error: 'Erreur lors du chargement des sponsors',
        })
        return promise
    }

    const getSponsors = function () {
        const promise = apiFetch('/sponsors', {
            query: {
                groups: [
                    'sponsor:competition:read',
                    'sponsor:organization:read',
                    'organization:read'
                ],
            }
        }).then(r => r.json()).then(function (d) {
            console.debug(d)
            setSponsors(d['hydra:member'])
            setIsLoading(false)
            return d['hydra:member']
        })

        toast.promise(promise, {
            pending: 'Chargement des sponsors',
            success: 'Sponsors chargés',
            error: 'Erreur lors du chargement des sponsors',
        })
        return promise
    }

    const updateEntityState = (key, value) => {
        setEntity({ ...entity, [key]: value });
    };

    const [entity, setEntity] = useState({
        competition: competition['@id'],
        organization: "",
        logo: "",
        destinationUrl: "",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        sponsorRank: 0,
        price: 0,
    });

    return (
        <Loader takeInnerContent={true} active={isLoading} style={{background: "white"}}>
            <div className={style.competitionModalContent}>
                <h2>Concours {">"} sponsors : édition</h2>
                <div>
                    <b>Vous pouvez télécharger plusieurs visuels de sponsors, voici les formats, poids et tailles à
                        respecter :</b>
                    <p>Formats supportés : JPG, PNG, GIF | Taille : 840x525 pixels minimum | Poids : 2 Mo max</p>
                    <p>Pour modifier l’ordre d’affichage, utilisez les flèches ou le glisser-déposer :</p>
                </div>
                <div className={style.sponsorList}>
                    {competitionSponsors.map(sponsor => {
                        return (
                            <SponsorsLines entity={sponsor} onChange={function () {
                                getSponsorsInCompetition();
                            }}/>
                        )
                    })}
                </div>
                <div className={style.sponsorPropositions}>
                    <b>Sélectionnez le sponsor dans la liste ci-dessous puis cliquez sur ajouter</b>
                    <Form
                        handleSubmit={function () {
                            const promise = new Promise(async (resolve, reject) => {
                                try {
                                    const data = {
                                        organization: '/organizations/' + entity.organization.value,
                                        competition: competition['@id'],
                                        startDate: new Date().toISOString(),
                                        endDate: new Date().toISOString(),
                                        sponsorRank: 0,
                                        price: 0,
                                    };
                                    console.debug('data', data);
                                    const res = await apiFetch('/sponsors', {
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
                                            getSponsorsInCompetition();
                                            return data;
                                        });
                                    console.debug('res', res);
                                    resolve(res);
                                } catch (e) {
                                    console.error(e);
                                    reject(e);
                                }
                            });

                            toast.promise(promise, {
                                pending: "Ajout d'un sponsor",
                                success: 'Sponsor ajouté',
                                error: "Erreur lors de l'ajout du sponsor",
                            });
                        }}
                        hasSubmit={true}
                    >
                        <div className={style.sponsorAdd}>
                            <Input
                                className={style.formSelect}
                                type="select"
                                extra={{
                                    options: sponsors.map(sponsor => {
                                        return {
                                            value: sponsor.organization.id,
                                            label: sponsor.organization.organizerName
                                        }
                                    }),
                                }}
                                onChange={d => updateEntityState('organization', d)}
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
                    <p>
                        Si vous trouvez pas le sponsor dans la liste proposée, merci de le demander
                        à <u>l’administrateur</u>, il sera ajouté avec son logo. L’URL de destination au clic est à
                        définir.
                    </p>
                </div>
            </div>
        </Loader>
    );
}