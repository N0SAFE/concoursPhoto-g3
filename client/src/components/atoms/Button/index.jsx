import style from "@/components/atoms/Button/style.module.scss";
import Icon from "@/components/atoms/Icon";

export default function Button({ type, name }) {
    return (
        <div>
            <button className={style.componemtButtonSubmit} type={type}>
                {name}
                <Icon icon="sign-out" size={20} color="black" />
            </button>
        </div>
    );
}
