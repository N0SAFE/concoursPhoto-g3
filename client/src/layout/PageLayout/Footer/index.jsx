import style from "./style.module.scss";

export default function Footer() {
    return (
        <footer className={style.footerContainer}>
            <ul>
                <li>
                    <p><span>ConcoursPhotos.com</span> @ Tous droits réservés</p>
                </li>
                <li>
                    A propos
                </li>
                <li>
                    Mentions légales
                </li>
                <li>
                    Données personnelles
                </li>
                <li>
                    Annoncer sur ce site
                </li>
                <li>
                    Nous contacter
                </li>
            </ul>
        </footer>
    )
}