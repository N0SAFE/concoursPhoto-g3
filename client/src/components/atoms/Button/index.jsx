import style from "@/components/atoms/Button/style.module.scss";
import Icon from "@/components/atoms/Icon";

export default function Button({ type, name, key, onClick, color, textColor, padding, width, borderRadius, icon }) {
    return (
        <>
            <button key={key} onClick={onClick} className={style.componentButton} type={type} style={{ backgroundColor: color, color: textColor, padding: padding, width: width, borderRadius: borderRadius }}>
                <div>
                    {name}
                    {icon && <Icon icon={icon} size={20} color={textColor} />}
                </div>
            </button>
        </>
    );
}
