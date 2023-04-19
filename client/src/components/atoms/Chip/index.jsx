import style from "./style.module.scss";
import Icon from "@/components/atoms/Icon";

export default function Chip({title, key, icon, backgroundColor, color, iconColor}) {
    return (
        <div key={key} className={style.chipContainer} style={{ backgroundColor: backgroundColor }}>
            {icon && <Icon icon={icon} size="20" style={{ color: iconColor }}/>}
            <span style={{ color: color }}>{title}</span>
        </div>
    );
}
