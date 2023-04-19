import {Link} from "react-router-dom";
import style from "./style.module.scss";

export default function Breadcrumb({ items }) {
    return (
        <nav className={style.breadcrumbContainer}>
            <ol className={style.breadcrumb}>
                {items.map((item, index) => (
                    <li key={index}>
                        {item.link ? <Link to={item.link}>{item.label}</Link> : item.label}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
