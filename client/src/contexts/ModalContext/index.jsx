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
    const [outerCloseCallbacks, setOuterCloseCallbacks] = useState([]); // [closeCallback]
    const [innerCloseCallbacks, setInnerCloseCallbacks] = useState([]); // [closeCallback]
    const [active, setActive] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const showModal = ({close = () => {}} = {}) => {
        setActive(true);
        setInnerCloseCallbacks([...innerCloseCallbacks, close]);
    };

    const innerClose = () => {
        setActive(false);
        innerCloseCallbacks.forEach(callback => callback());
        setInnerCloseCallbacks([]);
        setOuterCloseCallbacks([]);
    };

    const outerClose = () => {
        setActive(false);
        outerCloseCallbacks.forEach(callback => callback());
        setOuterCloseCallbacks([]);
        setInnerCloseCallbacks([]);
    }

    return (
        <>
            <modalContext.Provider
                value={{
                    active,
                    showModal,
                    hideModal: outerClose,
                    modalContent,
                    setModalContent,
                    onModalClose: function (callback) {
                        closeCallbacks.push(callback);
                    }
                }}
            >
                <div>
                    <div
                        className={
                            active
                                ? style.modalBackground
                                : style.modalBackgroundHidden
                        }
                        onClick={innerClose}
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
                                    onClick={innerClose}
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
                        overflow: active ? 'hidden' : 'auto',
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
