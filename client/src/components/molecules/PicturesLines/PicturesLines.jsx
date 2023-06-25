import style from './style.module.scss'
import Input from "@/components/atoms/Input/index.jsx";
import Button from "@/components/atoms/Button/index.jsx";
import useApiPath from "@/hooks/useApiPath.js";
import {useRef, useState} from 'react'
import useApiFetch from "@/hooks/useApiFetch.js";
import useFilesUpdater from "@/hooks/useFilesUploader.js";

export default function PicturesLines({
                                          entity, onChange = function () {
    }
                                      }) {
    const inputFileRef = useRef();
    const [pictureName, setPictureName] = useState(entity.pictureName)
    const [file, setFile] = useState(entity.file)
    const [fileAsChanged, setFileAsChanged] = useState(false)
    const apiPathComplete = useApiPath();
    const apiFetch = useApiFetch()
    const {uploadFile, deleteFile} = useFilesUpdater();

    const onFileChange = function (e) {
        setFileAsChanged(true)
        if (e.target.files.length === 0) {
            setFile(null);
            return;
        }
        const file = e.target.files[0];
        const FR = new FileReader();
        FR.addEventListener('load', function (evt) {
            setFile({
                file: file,
                to: URL.createObjectURL(file),
                name: file.name,
                blob: evt.target.result,
            });
        });
        FR.addEventListener('error', function (evt) {
            console.error('file reader error', evt);
            setFile(null)
        });
        FR.readAsDataURL(file);
    }

    console.log(file)

    const updateData = async function () {
        const fileId = await (async function () {
            if (!fileAsChanged) {
                return file['@id']
            } else {
                console.debug(file)
                return (await uploadFile({file: file.file, path: "/files/pictures"}))['@id']
            }
        })();
        console.debug(fileId)
        apiFetch('/pictures/' + entity.id, {
            method: "PATCH",
            body: JSON.stringify({
                file: fileId,
                pictureName
            }),
            headers: {
                'Content-Type': 'application/merge-patch+json',
            }
        }).then(function () {
            onChange()
            setPictureName(entity.pictureName);
        })
    }

    const deleteData = async function () {
        apiFetch('/pictures/' + entity.id, {
            method: "DELETE",
            body: JSON.stringify(
                {
                    file: file['@id'],
                }
            ),
            headers: {
                'Content-Type': 'application/merge-patch+json',
            }
        }).then(function () {
            onChange()

        })
    }

    return (
        <div className={style.picturesAddContainerItems}>
            <div>
                <img src={fileAsChanged ? file?.blob : apiPathComplete(file?.path)} alt={entity.pictureName}/>
            </div>
            <div>
                <Input
                    type="text"
                    extra={{placeHolder: "Nom/légende de la photo (conseillé mais non obligatoire)"}}
                    defaultValue={pictureName}
                    onChange={function (d) {
                        setPictureName(d)
                    }}
                />
                <p>Fichier actuel : {' ' + (fileAsChanged ? file?.name : file?.defaultName)}</p>
                <div className={style.buttonList}>
                    <input ref={inputFileRef} onChange={onFileChange} type="file" style={{display: "none"}} />
                    <Button
                        type="button"
                        color={'#F1F1F1'}
                        width={'150px'}
                        height={'50px'}
                        padding={'0 20px'}
                        borderRadius={'25px'}
                        icon={"download"}
                        iconPosition={"right"}
                        onClick={function () {
                            inputFileRef?.current?.click()
                        }}
                    >
                        Télécharger
                    </Button>

                    <Button
                        type="button"
                        color={'#F1F1F1'}
                        width={'150px'}
                        height={'50px'}
                        padding={'0 20px'}
                        borderRadius={'25px'}
                        onClick={deleteData}
                    >
                        Supprimer
                    </Button>
                    <Button
                        type="button"
                        color={'#F1F1F1'}
                        width={'150px'}
                        height={'50px'}
                        padding={'0 20px'}
                        borderRadius={'25px'}
                        onClick={updateData}
                    >
                        Confirmer
                    </Button>
                </div>
            </div>
        </div>
    )
}