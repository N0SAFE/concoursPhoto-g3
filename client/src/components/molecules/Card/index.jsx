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
}) {
    const navigate = useNavigate();

    const handleClick = idContent => {
        navigate('/competition/' + idContent);
    };

    return (
        <div
            className={style.cardContainer}
            onClick={() => handleClick(idContent)}
        >
            <div className={style.cardHeader}>
                <img
                    src={import.meta.env.VITE_API_URL + '/' + imagePath}
                    alt={title}
                />
            </div>
            <div className={style.cardBody}>
                <h3>{title}</h3>
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
            </div>
            {(stats || finalDate) && (
                <div className={style.cardFooter}>
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
    );
}
