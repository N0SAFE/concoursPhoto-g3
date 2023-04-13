import style from "@/components/atoms/Input/style.module.scss";
import Select from "react-select";

export default function Input({ type, name, defaultValue, extra, label, onChange = function () {}, error = "" }) {
    const InputElement = (() => {
        switch (type) {
            case "email":
                return <input className={style.componentInput} label={label} type="email" {...extra} name={name} onChange={(e) => onChange(e.target.value)} defaultValue={defaultValue} />;
            case "checkbox":
                return <input className={style.componentInput} label={label} type="checkbox" {...extra} name={name} onChange={(e) => onChange(e.target.checked)} checked={defaultValue} />;
            case "select":
                return <Select {...extra} name={name} label={label} onChange={(e) => onChange(e)} defaultValue={defaultValue} />;
            case "password":
                return <input className={style.componentInput} label={label} type="password" {...extra} name={name} onChange={(e) => onChange(e.target.value)} defaultValue={defaultValue} />;
            case "tel":
                return <input className={style.componentInput} label={label} type="tel" {...extra} name={name} onChange={(e) => onChange(e.target.value)} defaultValue={defaultValue} />;
            case "text":
                return <input className={style.componentInput} label={label} type="text" {...extra} name={name} onChange={(e) => onChange(e.target.value)} defaultValue={defaultValue} />;
            case "number":
                return <input className={style.componentInput} label={label} type="number" {...extra} name={name} onChange={(e) => onChange(parseInt(e.target.value))} defaultValue={defaultValue} />;
            case "date":
                return (
                    <input
                        className={style.componentInput}
                        type="date"
                        {...extra}
                        name={name}
                        onChange={(e) => onChange(new Date(e.target.value))}
                        defaultValue={defaultValue?.toLocaleDateString("en-CA")}
                    />
                );
            case "file":
                return <input className={style.componentInput} type="file" {...extra} name={name} onChange={(e) => onChange(e.target.value)} defaultValue={defaultValue} />;
            case "custom":
                return extra.component;
            case "radio":
                return <input className={style.componentInput} type="radio" {...extra} name={name} onChange={(e) => onChange(e.target.value)} defaultValue={defaultValue} />;
            default:
                throw new Error("Unknown input type : {" + type + "}");
        }
    })();
    return (
        <div className={style.component}>
            <label className={style.componentLabel} htmlFor={label}>
                {label}
            </label>
            {InputElement}
            {error && <p className={style.componentError}>{error}</p>}
        </div>
    );
}
