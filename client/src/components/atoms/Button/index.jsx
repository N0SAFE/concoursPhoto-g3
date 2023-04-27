import style from "@/components/atoms/Button/style.module.scss";
import Icon from "@/components/atoms/Icon";

export default function Button({ type, name, key, onClick, color, textColor, padding, width, borderRadius, icon, disabled }) {
    return (
        <div className={`${disabled && style.componentButtonContainerDisabled} ${style.componentButtonContainer}`}>
            <button key={key} className={`${disabled && style.componentButtonDisabled} ${style.componentButton}`} onClick={onClick} type={type} style={{ backgroundColor: color, color: textColor, padding: padding, width: width, borderRadius: borderRadius }}>
                <div>
                    {name}
                    {icon && <Icon icon={icon} size={20} color={textColor} />}
                </div>
            </button>
        </div>
    );
}
