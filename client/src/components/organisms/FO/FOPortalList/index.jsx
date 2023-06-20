import style from './style.module.scss';
import Slider from '@/components/molecules/Slider';
import useApiPath from '@/hooks/useApiPath.js';
import Button from "@/components/atoms/Button/index.jsx";
import {useAuthContext} from "@/contexts/AuthContext.jsx";
import {useModal} from "@/contexts/ModalContext/index.jsx";

export default function FOPortalList({
    boxSingle = [],
    boxSingleContents = [],
    boxUp = [],
    boxUpContents = [],
    boxDown = [],
    boxDownContents = [],
    modalContentSingle = [],
    modalContentDown = [],
    entity,
}) {
    const apiPath = useApiPath();
    const { showModal, setModalContent } = useModal();

    return (
        <div className={style.portalContainer}>
            <div className={style.boxSingle}>
                {boxSingle.type === 'slider' && (
                    <Slider
                        slides={boxSingleContents.map(content => {
                            return {
                                imagePath: apiPath(content),
                                imageAlt: content,
                            };
                        })}
                    />
                )}
                {boxSingle.type === 'picture' && (
                    <img src={apiPath(boxSingle.path)} alt={boxSingle.alt} />
                )}
                <div className={style.boxSingleSecondary}>
                    {entity?.userCanEdit && (
                        <Button textColor={"#fff"} color={"#000"} borderRadius={"25px"} onClick={(e) => {
                            e.preventDefault();
                            setModalContent(modalContentSingle);
                            showModal();
                        }}>
                            éditer
                        </Button>
                    )}
                </div>
            </div>
            <div className={style.boxDuo}>
                <div className={style.boxUp}>
                    {boxUp.type === 'slider' && (
                        <Slider
                            slides={boxUpContents.map(content => {
                                return {
                                    imagePath: apiPath(content),
                                    imageAlt: content,
                                };
                            })}
                        />
                    )}
                    {boxUp.type === 'picture' && (
                        <img src={apiPath(boxUp.path)} alt={boxUp.alt} />
                    )}
                </div>
                <div className={style.boxDown}>
                    {boxDown.type === 'slider' && (
                        <Slider
                            slides={boxDownContents.map(content => {
                                return {
                                    imagePath: apiPath(content),
                                    imageAlt: content,
                                };
                            })}
                        />
                    )}
                    {boxDown.type === 'picture' && (
                        <img src={apiPath(boxDown.path)} alt={boxDown.alt} />
                    )}
                    <div className={style.boxDownSecondary}>
                        {entity?.userCanEdit && (
                            <Button textColor={"#fff"} color={"#000"} borderRadius={"25px"} onClick={(e) => {
                                e.preventDefault();
                                setModalContent(modalContentDown);
                                showModal();
                            }}>
                                éditer
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
