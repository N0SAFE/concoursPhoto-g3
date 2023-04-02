import style from "@/components/atoms/Button/style.module.scss";
import Icon from "@/components/atoms/Icon";

export default function Button({ type, name, key, onClick, color, textColor, padding, borderRadius }) {
    return (
        <div>
            <button key={key} onClick={onClick} className={style.componentButton} type={type} style={{ backgroundColor: color, color: textColor, padding: padding, borderRadius: borderRadius }}>
                <div>
                    {name}
                    <Icon icon="sign-out" size={20} color={textColor} />
                </div>
            </button>
        </div>
    );
}
