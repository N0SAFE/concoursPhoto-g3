import style from './style.module.scss';
import Button from '@/components/atoms/Button/index.jsx';
import useApiPath from '@/hooks/useApiPath.js';

// requestType possibility :
// last-pictures-posted
// last-pictures-obtained-votes
// pictures-obtained-price

export default function PicturesAside({ pictures, asideLabel }) {
    const apiPath = useApiPath();

    return (
        <div className={style.asideContainer}>
            <div>
                <h2>{asideLabel}</h2>
                <div>
                    {pictures.map(picture => {
                        return (
                            <img
                                src={apiPath(picture.file.path)}
                                alt={picture.competition_name}
                            />
                        );
                    })}
                </div>
            </div>
            <Button
                name={'Voir les photos et voter'}
                borderRadius={'30px'}
                padding={'20px'}
                color={'#A8A8A8'}
                textColor={'#fff'}
                onClick={() => navigate('/')}
            />
        </div>
    );
}
