import style from './style.module.scss';
import Slider from '@/components/molecules/Slider';
import useApiPath from '@/hooks/useApiPath.js';

export default function FOPortalList({
    boxSingle = [],
    boxSingleContents = [],
    boxUp = [],
    boxUpContents = [],
    boxDown = [],
    boxDownContents = [],
}) {
    const apiPath = useApiPath();
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
            </div>
            <div className={style.boxDuo}>
                <>
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
                </>
            </div>
        </div>
    );
}
