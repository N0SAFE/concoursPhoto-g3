import style from "@/components/atoms/Input/style.module.scss";

export default function Input({ type, name, value }) {
    return (
        <div>
            <input className={style.componemtInput} type={type} name={name} value={value} />
        </div>
    );
}
