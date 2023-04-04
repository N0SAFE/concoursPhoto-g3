import style from "@/components/atoms/Input/style.module.scss";
import Select from "react-select";

export default function Input({ type, name, defaultValue, extra, setState = function (){}}) {
    switch (type) {
        case "email":
            return <input className={style.componentInput} type="email" {...extra} name={name} onChange={(e) => setState(e.target.value)} defaultValue={defaultValue} />;
        case "checkbox":
            return <input className={style.componentInput} type="checkbox" {...extra} name={name} onChange={(e) => setState(e.target.checked)} defaultChecked={defaultValue} />;
        case "select":
            return <Select {...extra} name={name} onChange={(e) => setState(e)} defaultValue={defaultValue} />;
        case "password":
            return <input className={style.componentInput} type="password" {...extra} name={name} onChange={(e) => setState(e.target.value)} defaultValue={defaultValue} />;
        case "tel":
            return <input className={style.componentInput} type="tel" {...extra} name={name} onChange={(e) => setState(e.target.value)} defaultValue={defaultValue} />;
        case "text":
            return <input className={style.componentInput} type="text" {...extra} name={name} onChange={(e) => setState(e.target.value)} defaultValue={defaultValue} />;
        case "number":
            return <input className={style.componentInput} type="number" {...extra} name={name} onChange={(e) => setState(e.target.value)} defaultValue={defaultValue} />;
        case "date":
            return <input className={style.componentInput} type="date" {...extra} name={name} onChange={(e) => setState(e.target.value)} defaultValue={defaultValue} />;
        case "file":
            return <input className={style.componentInput} type="file" {...extra} name={name} onChange={(e) => setState(e.target.value)} defaultValue={defaultValue} />;
        case "custom":
            return extra.component;
        default:
            throw new Error("Unknown input type : {" + type + "}");
    }
}
