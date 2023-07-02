import style from '@/components/atoms/Button/style.module.scss';
import Icon from '@/components/atoms/Icon';

export default function Button({
    type,
    key,
    onClick,
    color,
    textColor,
    padding,
    width,
    height,
    borderRadius,
    icon,
    disabled,
    iconPosition,
    children,
    style: styleProp,
}) {
    return (
        <div
            className={`${disabled && style.componentButtonContainerDisabled} ${
                style.componentButton
            }`}
        >
            <button
                key={key}
                className={`${disabled && style.componentButtonDisabled} ${
                    style.componentButton
                }`}
                onClick={onClick}
                type={type}
                style={{
                    backgroundColor: color,
                    color: textColor,
                    padding: padding,
                    width: width,
                    borderRadius: borderRadius,
                    height: height,
                    ...styleProp,
                }}
            >
                <div>
                    {icon ? (
                        <>
                            {iconPosition === 'left' ? (
                                <>
                                    <Icon
                                        icon={icon}
                                        size={20}
                                        color={textColor}
                                    />
                                    {children}
                                </>
                            ) : (
                                <>
                                    {children}
                                    <Icon
                                        icon={icon}
                                        size={20}
                                        color={textColor}
                                    />
                                </>
                            )}
                        </>
                    ) : (
                        children
                    )}
                </div>
            </button>
        </div>
    );
}
