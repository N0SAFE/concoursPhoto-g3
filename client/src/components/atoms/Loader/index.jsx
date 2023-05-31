import style from './style.module.scss';

export default function Loader({
    children,
    active,
    style: _style,
    takeInnerContent,
}) {
    if (active) {
        if (takeInnerContent) {
            return (
                <>
                    <div className={style.takeInnerContainer} style={_style}>
                        <div style={{ visibility: 'hidden' }}>{children}</div>
                        <div className={style['lds-roller']}>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </>
            );
        }
        return (
            <>
                <div className={style.container} style={_style}>
                    <div className={style['lds-roller']}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </>
        );
    }
    return children;
}
