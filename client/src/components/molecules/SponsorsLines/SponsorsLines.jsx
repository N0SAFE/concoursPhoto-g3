import style from './style.module.scss'
import Input from "@/components/atoms/Input/index.jsx";
import Button from "@/components/atoms/Button/index.jsx";
import useApiPath from "@/hooks/useApiPath.js";
import {useRef, useState} from 'react'
import useApiFetch from "@/hooks/useApiFetch.js";
import useFilesUpdater from "@/hooks/useFilesUploader.js";

export default function SponsorsLines({entity, onChange = function () {}}) {
    console.debug(entity)
    const inputFileRef = useRef();
    const [destinationUrl, setDestinationUrl] = useState(entity.destinationUrl)
    const [file, setFile] = useState(entity.organization.logo)
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

    const updateData = async function () {
        const fileId = await (async function () {
            if (!fileAsChanged) {
                return file['@id']
            } else {
                console.debug(file)
                return (await uploadFile({file: file.file, path: "/files/sponsors"}))['@id']
            }
        })();
        console.debug(fileId)
        apiFetch('/sponsors/' + entity.id, {
            method: "PATCH",
            body: JSON.stringify({
                destinationUrl,
            }),
            headers: {
                'Content-Type': 'application/merge-patch+json',
            }
        }).then(function () {
            onChange()
            setDestinationUrl(entity.destinationUrl);
        })
    }

    const deleteData = async function () {
        console.debug(entity.id)
        apiFetch('/sponsors/' + entity.id, {
            method: "DELETE"
        }).then(function (d) {
            console.debug(d)
            onChange()
        })
    }

    return (
        <div className={style.sponsorsAddContainerItems}>
            <div>
                <img src={fileAsChanged ? file?.blob : apiPathComplete(file?.path)} alt={entity.destinationUrl}/>
            </div>
            <div>
                <h3>{entity.organization.organizerName}</h3>
                <div className={style.sponsorsActions}>
                    <Input
                        label="URL de destination au clic*"
                        type="text"
                        defaultValue={destinationUrl}
                        onChange={function (d) {
                            setDestinationUrl(d)
                        }}
                    />
                    <div className={style.buttonList}>
                        <input ref={inputFileRef} onChange={onFileChange} type="file" style={{display: "none"}}/>
                        <Button
                            type="button"
                            color={'#F1F1F1'}
                            width={'50px'}
                            height={'50px'}
                            borderRadius={'25px'}
                            onClick={updateData}
                            icon={"checkmark"}
                        ></Button>
                        <Button
                            type="button"
                            color={'#F1F1F1'}
                            width={'50px'}
                            height={'50px'}
                            borderRadius={'25px'}
                            onClick={deleteData}
                            icon={"trash"}
                        ></Button>
                    </div>
                </div>
            </div>
        </div>
    )
}