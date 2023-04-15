import style from './style.module.scss';
import Icon from "@/components/atoms/Icon";
import { useRef, useState } from "react";

export default function Modal({buttonSelected, component}) {
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef();

    const toggleModal = () => {
        if(showModal) {
            setShowModal(false)
        } else {
            setShowModal(true)
        }
    }

    return (
        <>
            <div onClick={toggleModal}>{buttonSelected}</div>
            <div className={showModal ? style.modalBackground : style.modalBackgroundHidden} onClick={toggleModal}/>
            <div ref={modalRef} className={`${style.modal} ${showModal ? style.modalShow : ''}`}>
                <Icon className={style.modalClose} onClick={toggleModal} icon="close" size={15}/>
                <div>
                    {component}
                </div>
            </div>
        </>
    )
}
