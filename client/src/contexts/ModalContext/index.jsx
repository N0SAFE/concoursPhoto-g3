import style from './style.module.scss';
import Icon from '@/components/atoms/Icon';
import { isValidElement, useState } from 'react';
import { createContext, useContext } from 'react';

const modalContext = createContext({
    active: false,
    showModal: () => {},
    hideModal: () => {},
    modalContent: null,
    setModalContent: () => {},
});

function ModalProvider({ children }) {
    const [closeCallbacks, setCloseCallbacks] = useState([]);
    const [active, setActive] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const showModal = (closeCallback = function(){}) => {
        setActive(true);
        setCloseCallbacks([...closeCallbacks, closeCallback]);
    };

    const hideModal = () => {
        setActive(false);
        closeCallbacks.forEach(callback => callback());
        setCloseCallbacks([]);
    };

    console.log(modalContent);

    return (
        <>
            <modalContext.Provider
                value={{
                    active,
                    showModal,
                    hideModal,
                    modalContent,
                    setModalContent,
                    onModalClose: function (callback) {
                        closeCallbacks.push(callback);
                    },
                }}
            >
                <div>
                    <div
                        className={
                            active
                                ? style.modalBackground
                                : style.modalBackgroundHidden
                        }
                        onClick={hideModal}
                    />

                    <div
                        className={`${style.modalContainer} ${
                            active ? style.modalShow : ''
                        }`}
                    >
                        <div className={style.modalContentContainer}>
                            <div className={style.modalContent}>
                                <Icon
                                    className={style.modalClose}
                                    onClick={hideModal}
                                    icon="close"
                                    size={15}
                                />
                                <div>
                                    {modalContent?.content &&
                                    !isValidElement(modalContent)
                                        ? modalContent?.content
                                        : modalContent}
                                </div>
                            </div>
                        </div>
                        <div className={style.modalTop}>
                            {modalContent?.top &&
                                !isValidElement(modalContent) &&
                                modalContent?.top}
                        </div>
                        <div className={style.modalBottom}>
                            {modalContent?.bottom &&
                                !isValidElement(modalContent) &&
                                modalContent?.bottom}
                        </div>
                        <div className={style.modalLeft}>
                            {modalContent?.left &&
                                !isValidElement(modalContent) &&
                                modalContent?.left}
                        </div>
                        <div className={style.modalRight}>
                            {modalContent?.right &&
                                !isValidElement(modalContent) &&
                                modalContent?.right}
                        </div>
                    </div>
                </div>
                <div
                    className={style.modalOutlet}
                    style={{
                        overflow: active ? 'hidden' : 'scroll',
                        height: '100vh',
                    }}
                >
                    {children}
                </div>
            </modalContext.Provider>
        </>
    );
}

function useModal() {
    const context = useContext(modalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}

export { ModalProvider, useModal };
