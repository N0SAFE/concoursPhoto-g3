import style from "./style.module.scss";
import Icon from "@/components/atoms/Icon";
import { useState } from "react";
import { createContext, useContext } from "react";

import { useLocation } from "react-router-dom";


const modalContext = createContext({
    active: false,
    showModal: () => {},
    hideModal: () => {},
    modalContent: null,
    setModalContent: () => {},
});

function ModalProvider({ children }) {const location = useLocation();

    const [active, setActive] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const showModal = () => {
        setActive(true);
    };

    const hideModal = () => {
        setActive(false);
    };

    return (
        <>
            <div>
                <div className={active ? style.modalBackground : style.modalBackgroundHidden} onClick={hideModal} />
                <div className={`${style.modal} ${active ? style.modalShow : ""}`}>
                    <Icon className={style.modalClose} onClick={hideModal} icon="close" size={15} />
                    <div>{modalContent}</div>
                </div>
            </div>
            <modalContext.Provider value={{ active, showModal, hideModal, modalContent, setModalContent }}><div style={{overflow: active ? "hidden" : ""}}>{children}</div></modalContext.Provider>
        </>
    );
}

function useModal() {
    const context = useContext(modalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
}

export { ModalProvider, useModal };