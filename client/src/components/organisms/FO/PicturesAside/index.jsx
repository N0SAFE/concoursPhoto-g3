import style from './style.module.scss';
import Button from '@/components/atoms/Button/index.jsx';
import Picture from '@/components/atoms/Picture/index.jsx';
import useApiPath from '@/hooks/useApiPath.js';
import { useNavigate } from 'react-router-dom';

export default function PicturesAside({ pictures, asideLabel, idPage }) {
    const apiPath = useApiPath();
    const navigate = useNavigate();
    
    return (
        <div className={style.asideContainer}>
            <div>
                <h2>{asideLabel}</h2>
                <div>
                    {pictures.map(picture => {
                        return (
                            <Picture
                                key={picture.id}
                                src={apiPath(picture.file.path)}
                                alt={picture.competition_name}
                                photographer={picture.user}
                            />
                        );
                    })}
                </div>
            </div>
            <Button
                borderRadius={'30px'}
                padding={'20px'}
                color={'#A8A8A8'}
                textColor={'#fff'}
                onClick={() => navigate(`/competition/${idPage}/pictures`)}
            >
                Voir les photos et voter
            </Button>
        </div>
    );
}
