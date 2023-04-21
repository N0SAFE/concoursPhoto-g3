import style from "./style.module.scss"

export default function Loader({children, active, style: _style}){
    if(active){
        return (
            <>
                <div className={style.container} style={_style}><div className={style["lds-roller"]}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
            </>
        )
    }
    return children
}