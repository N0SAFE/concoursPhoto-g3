import style from './style.module.scss'
import Icon from "@/components/atoms/Icon";

export default function Card({imagePath, title, filters = [], stats = [], finalDate }) {
    return (
        <div className={style.cardContainer}>
            <div className={style.cardHeader}>
                <img src={imagePath} alt={title}/>
            </div>
            <div className={style.cardBody}>
                <h3>{title}</h3>
                <div className={style.cardFilter}>
                    {(filters) && filters.map((filter, index) => {
                        return (
                            <span key={index}>{filter}</span>
                        );
                    })}
                </div>
            </div>
            {(stats || finalDate) && (
                <div className={style.cardFooter}>
                    <div className={style.cardFilter}>
                        {stats.map((stat, index) => {
                            return (
                                <div key={index}>
                                    <Icon icon={stat.icon} size="20" />
                                    <span>{stat.name}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div>
                        {finalDate && (
                            <div className={style.date}>
                                <p>Jusqu'au {finalDate}</p>
                                <Icon icon="time" size="20"/>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
