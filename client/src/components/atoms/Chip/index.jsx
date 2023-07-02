import style from './style.module.scss';
import Icon from '@/components/atoms/Icon';

export default function Chip({
    key,
    icon,
    backgroundColor,
    color,
    iconColor,
    onClick,
    children,
}) {
    return (
        <div
            key={key}
            className={style.chipContainer}
            style={{ backgroundColor: backgroundColor }}
            onClick={onClick}
        >
            {icon && (
                <Icon icon={icon} size="20" style={{ color: iconColor }} />
            )}
            <span style={{ color: color }}>{children}</span>
        </div>
    );
}
