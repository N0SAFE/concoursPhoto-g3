import {useState, useEffect} from "react";
import {toast} from "react-toastify";
import style from './style.module.scss'
import Form from "@/components/organisms/BO/Form/index.jsx";
import useApiFetch from "@/hooks/useApiFetch.js";
import Input from "@/components/atoms/Input/index.jsx";
import {useAuthContext} from "@/contexts/AuthContext.jsx";
import PicturesLines from "@/components/molecules/PicturesLines/PicturesLines";
import useFilesUpdater from "@/hooks/useFilesUploader.js";
import Loader from "@/components/atoms/Loader/index.jsx";

export default function CompetitionPicturesAdd({competition}) {
    const [isLoading, setIsLoading] = useState(true)
    const apiFetch = useApiFetch()
    const [userPictures, setUserPictures] = useState([])
    const {me} = useAuthContext()
    const [usersCanParticipate, setUsersCanParticipate] = useState(false);
    const {uploadFile} = useFilesUpdater();

    const getUsersCanParticipate = function () {
        apiFetch('/check-participation/' + competition.id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(r => r.json()).then(function (d) {
            setUsersCanParticipate(d);
        })
    }

    useEffect(() => {
        getUsersCanParticipate()
    }, [userPictures])

    const getUserPictures = function () {
        const promise = apiFetch('/pictures', {
            query: {
                user: me['@id'],
                competition: competition['@id'],
                groups: [
                    'picture:competition:read',
                    'picture:user:read',
                    'picture:file:read',
                    'file:read'
                ]
            }
        }).then(r => r.json()).then(function (d) {
            console.debug(d)
            setUserPictures(d['hydra:member'])
            setIsLoading(false)
            return d['hydra:member']
        })

        toast.promise(promise, {
            pending: 'Chargement de vos photos soumises',
            success: 'Photos chargées',
            error: 'Erreur lors du chargement des photos',
        })
        return promise
    }

    useEffect(() => {
        const controller = new AbortController();
        const promise = getUserPictures()
        if (import.meta.env.MODE === 'development') {
            toast.promise(promise, {
                pending: 'Chargement de vos photos soumises',
                success: 'Photos chargées',
                error: 'Erreur lors du chargement des photos',
            });
        }

        return () => setTimeout(() => controller.abort());
    }, []);

    return (
        <Loader takeInnerContent={true} active={isLoading} style={{background: "white"}}>
            <div className={style.competitionModalContent}>
                <h2>Soumettre une photo</h2>
                <div>
                    <b>Vous pouvez importer une photo ou plusieurs selon le règlement du concours, voici les critères à
                        respecter :</b>
                    <p>Formats supportés : JPG, PNG | Poids : 1 Mo max par photo (la photo peut être en mode portrait,
                        carré
                        ou paysage)</p>
                </div>
                <Form hasSubmit={true}>
                    <div>
                        <div className={style.picturesAddContainer}>
                            {userPictures.map(picture => {
                                return (
                                    <PicturesLines entity={picture} onChange={function () {
                                        getUserPictures();
                                    }}/>
                                )
                            })}
                        </div>
                        <div className={style.buttonImport}>
                            {usersCanParticipate ? (
                                <Input
                                    type="file"
                                    name={"Importer"}
                                    onChange={async (d) => {
                                        if (!d?.file) {
                                            return
                                        }
                                        const pictureId = await (async () => {
                                            const picture = await uploadFile({
                                                file: d.file,
                                                path: "/files/pictures",
                                            });
                                            return picture['@id'];
                                        })();
                                        const data = {
                                            competition: competition['@id'],
                                            user: me['@id'],
                                            state: true,
                                            submissionDate: new Date().toISOString(),
                                            numberOfVotes: 0,
                                            file: pictureId,
                                            pictureName: "",
                                            priceWon: false,
                                            priceRank: 0
                                        }
                                        await apiFetch('/pictures', {
                                            method: 'POST',
                                            body: JSON.stringify(data),
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                        })
                                        getUserPictures();
                                    }}
                                />
                            ) : (
                                <h2 style={{color: 'red', textAlign: 'center'}}>Vous avez atteint le nombre maximum de
                                    photos postées !</h2>
                            )}
                        </div>
                    </div>
                </Form>
            </div>
        </Loader>
    )
}