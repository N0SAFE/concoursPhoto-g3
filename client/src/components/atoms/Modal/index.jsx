import style from './style.module.scss';
import Icon from "@/components/atoms/Icon";
import { useRef, useState } from "react";

export default function Modal({buttonSelected, component}) {
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef();

    const toggleModal = () => {
        if(showModal) {
            modalRef.current.style.width = "0";
            setTimeout(() => {
                setShowModal(false)
            }, 500);
        } else {
            if (window.innerWidth < 1400) {
                modalRef.current.style.width = "100%";
            } else {
                modalRef.current.style.width = "35%";
            }
            modalRef.current.style.height = "800px";
            modalRef.current.style.top = "50%";
            modalRef.current.style.left = "50%";
            modalRef.current.style.transform = "translate(-50%, -50%)";
            modalRef.current.style.position = "fixed";
            setShowModal(true)
        }
    }

    return (
        <>
            <div onClick={toggleModal}>{buttonSelected}</div>
            <div className={showModal ? style.modalBackground : style.modalBackgroundHidden} onClick={toggleModal}/>
            <div ref={modalRef} className={style.modal}>
                <Icon className={style.modalClose} onClick={toggleModal} icon="close" size={15}/>
                <div>
                    {component}
                </div>
            </div>
        </>
    )
}
