import style from './style.module.scss';
import Icon from '@/components/atoms/Icon';
import Chip from '@/components/atoms/Chip';
import { useNavigate } from 'react-router-dom';

export default function Card({
    idContent,
    imagePath,
    title,
    filters = [],
    stats = [],
    finalDate,
    orientation = 'horizontal',
    onClick = () => {},
}) {
    const navigate = useNavigate();

    return (
        <div
            className={
                style.cardContainer +
                ' ' +
                (orientation === 'horizontal'
                    ? style.cardContainerHorizontal
                    : style.cardContainerVertical)
            }
            onClick={() => onClick(idContent)}
        >
            <div className={style.cardHeader}>
                <img
                    src={import.meta.env.VITE_API_URL + '/' + imagePath}
                    alt={title}
                />
            </div>
            <div className={style.cardDisposition}>
                <div className={style.cardBody}>
                    <h3>{title}</h3>
                    <div className={style.cardFilterContainer}>
                        <div className={style.cardFilter}>
                            {filters &&
                                filters.map((filter, index) => {
                                    return (
                                        <Chip
                                            key={index}
                                            title={filter}
                                            backgroundColor={'#F5F5F5'}
                                        />
                                    );
                                })}
                        </div>
                        <div className={style.cardFilterFade}></div>
                    </div>
                </div>
                {stats && (
                    <div className={style.cardFooter}>
                        <div>
                            <div className={style.cardFilter}>
                                {stats.map((stat, index) => {
                                    return (
                                        <Chip
                                            icon={stat.icon}
                                            key={index}
                                            title={stat.name}
                                            backgroundColor={'#F5F5F5'}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            {finalDate && (
                                <div className={style.date}>
                                    <p>Jusqu'au {finalDate}</p>
                                    <Icon icon="time" size="20" />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
