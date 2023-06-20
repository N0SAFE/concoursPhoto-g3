import style from '@/components/atoms/Input/style.module.scss';
import Select from 'react-select';
import { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/atoms/Button/index.jsx';

function FileInput({ name, extra, label, onChange, error }) {
    if (!extra?.multiple) {
        const inputRef = useRef();
        return (
            <div className={style.componentImage}>
                <div>
                    {extra?.value ? (
                        <>
                            <Link to={extra?.value.to} target="_blank">
                                {extra?.value.name}
                            </Link>
                            <button
                                type="button"
                                onClick={() => inputRef.current.click()}
                            >
                                edit
                            </button>
                            <button
                                type="button"
                                onClick={() => onChange(null)}
                            >
                                delete
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => inputRef.current.click()}
                            >
                                ajouter un fichier
                            </button>
                        </>
                    )}

                    <input
                        style={{ display: 'none' }}
                        ref={inputRef}
                        className={style.componentInput}
                        type="file"
                        name={name}
                        onChange={async e => {
                            if (e.target.files.length === 0) {
                                onChange(null);
                                return;
                            }
                            const file = e.target.files[0];
                            const FR = new FileReader();
                            FR.addEventListener('load', function (evt) {
                                onChange({
                                    file: file,
                                    to: URL.createObjectURL(file),
                                    name: file.name,
                                    blob: evt.target.result,
                                });
                            });
                            FR.addEventListener('error', function (evt) {
                                console.error('file reader error', evt);
                            });
                            FR.readAsDataURL(file);
                        }}
                    />
                </div>
                <div style={{ height: '100%' }}>
                    {extra?.type === 'image' && extra?.value && (
                        <Link to={extra?.value?.to} target="_blank">
                            <img
                                style={{
                                    height: '100%',
                                    aspectRatio: '16/9',
                                    objectFit: 'contain',
                                    objectPosition: 'center',
                                }}
                                src={
                                    extra.type === 'image'
                                        ? extra?.value?.blob
                                            ? extra?.value?.blob
                                            : extra?.value?.to
                                        : null
                                }
                                onClick={function () {}}
                            />
                        </Link>
                    )}
                </div>
            </div>
        );
    } else {
        throw new Error('not implemented yet');
        const imageUrl = useMemo(() => {
            if (defaultValue) {
                return defaultValue;
            } else {
                return 'https://via.placeholder.com/150';
            }
        }, [defaultValue]);
        const inputRef = useRef();
        return (
            <div className={style.componentImage}>
                <button onClick={() => inputRef.current.click()}>
                    click here
                </button>
                <input
                    ref={inputRef}
                    className={style.componentInput}
                    type="file"
                    {...extra}
                    name={name}
                    onChange={e => onChange(e.target.files)}
                    defaultValue={defaultValue}
                />
                <div className={style.componentImagePreview}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>left</div>
                        <div>
                            right
                            <label htmlFor={label}>{label}</label>
                        </div>
                    </div>
                    <div>bottom</div>
                </div>
            </div>
        );
    }
}

function ProfileInput({ name, extra, onChange, error }) {
    if (!extra?.multiple) {
        const inputRef = useRef();
        return (
            <div className={style.componentProfile}>
                <div className={style.imageWrapper}>
                    {extra?.type === 'image' && extra?.value ? (
                        <Link to={extra?.value?.to} target="_blank">
                            <img
                                className={style.image}
                                src={
                                    extra.type === 'image'
                                        ? extra?.value?.blob
                                            ? extra?.value?.blob
                                            : extra?.value?.to
                                        : null
                                }
                                onClick={function () {}}
                            />
                        </Link>
                    ) : (
                        <svg
                            width="112"
                            height="112"
                            viewBox="0 0 112 112"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="56" cy="56" r="56" fill="#F1F1F1" />
                            <path
                                d="M35 79C35 67.8491 44.1782 58.8095 55.5 58.8095C66.8219 58.8095 76 67.8491 76 79H70.875C70.875 70.6369 63.9914 63.8571 55.5 63.8571C47.0086 63.8571 40.125 70.6369 40.125 79H35ZM55.5 56.2857C47.0053 56.2857 40.125 49.5093 40.125 41.1429C40.125 32.7764 47.0053 26 55.5 26C63.9947 26 70.875 32.7764 70.875 41.1429C70.875 49.5093 63.9947 56.2857 55.5 56.2857ZM55.5 51.2381C61.1631 51.2381 65.75 46.7205 65.75 41.1429C65.75 35.5652 61.1631 31.0476 55.5 31.0476C49.8369 31.0476 45.25 35.5652 45.25 41.1429C45.25 46.7205 49.8369 51.2381 55.5 51.2381Z"
                                fill="white"
                            />
                        </svg>
                    )}
                </div>
                <div className={style.buttonWrapper}>
                    {extra?.value ? (
                        <>
                            <Button
                                color={'#F1F1F1'}
                                width={'250px'}
                                height={'50px'}
                                padding={'0 20px'}
                                borderRadius={'25px'}
                                type="button"
                                onClick={() => inputRef.current.click()}
                            >
                                Télécharger ma photo
                            </Button>
                            <Button
                                color={'#F1F1F1'}
                                width={'150px'}
                                height={'50px'}
                                padding={'0 20px'}
                                borderRadius={'25px'}
                                type="button"
                                onClick={() => onChange(null)}
                            >
                                Supprimer
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                color={'#F1F1F1'}
                                width={'250px'}
                                height={'50px'}
                                padding={'0 20px'}
                                borderRadius={'25px'}
                                type="button"
                                onClick={() => inputRef.current.click()}
                            >
                                Télécharger ma photo
                            </Button>
                        </>
                    )}

                    <input
                        style={{ display: 'none' }}
                        ref={inputRef}
                        className={style.componentInput}
                        type="file"
                        name={name}
                        onChange={async e => {
                            if (e.target.files.length === 0) {
                                onChange(null);
                                return;
                            }
                            const file = e.target.files[0];
                            const FR = new FileReader();
                            FR.addEventListener('load', function (evt) {
                                onChange({
                                    file: file,
                                    to: URL.createObjectURL(file),
                                    name: file.name,
                                    blob: evt.target.result,
                                });
                            });
                            FR.addEventListener('error', function (evt) {
                                console.error('file reader error', evt);
                            });
                            FR.readAsDataURL(file);
                        }}
                    />
                </div>
            </div>
        );
    } else {
        throw new Error('not implemented yet');
        const imageUrl = useMemo(() => {
            if (defaultValue) {
                return defaultValue;
            } else {
                return 'https://via.placeholder.com/150';
            }
        }, [defaultValue]);
        const inputRef = useRef();
        return (
            <div className={style.componentProfile}>
                <button onClick={() => inputRef.current.click()}>
                    Télécharger ma photo
                </button>
                <input
                    ref={inputRef}
                    className={style.componentInput}
                    type="file"
                    {...extra}
                    name={name}
                    onChange={e => onChange(e.target.files)}
                    defaultValue={defaultValue}
                />
                <div className={style.componentImagePreview}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>left</div>
                        <div>right</div>
                    </div>
                    <div>bottom</div>
                </div>
            </div>
        );
    }
}

export default function Input({
    type,
    name,
    defaultValue,
    placeholder,
    extra,
    label,
    labelDisposition,
    className,
    onChange = function () {},
    error = '',
}) {
    const InputElement = (() => {
        switch (type) {
            case 'email':
                return (
                    <input
                        className={style.componentInput}
                        label={label}
                        type="email"
                        {...extra}
                        name={name}
                        onChange={e => onChange(e.target.value)}
                        defaultValue={defaultValue}
                    />
                );
            case 'checkbox':
                return (
                    <input
                        className={style.componentInput}
                        label={label}
                        labelDisposition={labelDisposition}
                        type="checkbox"
                        {...extra}
                        name={name}
                        onChange={e => onChange(e.target.checked)}
                        checked={defaultValue}
                    />
                );
            case 'select':
                return (
                    <Select
                        {...extra}
                        name={name}
                        placeholder={placeholder}
                        label={label}
                        onChange={e => onChange(e)}
                        defaultValue={defaultValue}
                        className={className}
                        menuPlacement={extra?.menuPlacement || 'auto'}
                    />
                );
            case 'password':
                return (
                    <input
                        className={style.componentInput}
                        label={label}
                        type="password"
                        {...extra}
                        name={name}
                        onChange={e => onChange(e.target.value)}
                        defaultValue={defaultValue}
                    />
                );
            case 'array':
                return (
                    <input
                        className={style.componentInput}
                        label={label}
                        type="array"
                        {...extra}
                        name={name}
                        onChange={e => onChange(e.target.value)}
                        defaultValue={defaultValue}
                    />
                );
            case 'tel':
                return (
                    <input
                        className={style.componentInput}
                        label={label}
                        type="tel"
                        {...extra}
                        name={name}
                        onChange={e => onChange(e.target.value)}
                        defaultValue={defaultValue}
                    />
                );
            case 'textarea':
                return (
                    <textarea
                        className={style.componentInput}
                        label={label}
                        type="textarea"
                        {...extra}
                        name={name}
                        onChange={e => onChange(e.target.value)}
                        defaultValue={defaultValue}
                    />
                );
            case 'text':
                return (
                    <input
                        className={style.componentInput}
                        label={label}
                        placeholder={placeholder}
                        type="text"
                        {...extra}
                        name={name}
                        onChange={e => onChange(e.target.value)}
                        defaultValue={defaultValue}
                    />
                );
            case 'number':
                return (
                    <input
                        className={style.componentInput}
                        label={label}
                        type="number"
                        {...extra}
                        name={name}
                        onChange={e => onChange(parseInt(e.target.value))}
                        defaultValue={defaultValue}
                    />
                );
            case 'date':
                return (
                    <input
                        className={style.componentInput}
                        type="date"
                        {...extra}
                        name={name}
                        onChange={e => onChange(new Date(e.target.value))}
                        defaultValue={defaultValue?.toLocaleDateString('en-CA')}
                    />
                );
            // case "file":
            //     return <input className={style.componentInput} type="file" {...extra} name={name} onChange={(e) => onChange(e.target.files)} defaultValue={defaultValue} />;
            case 'file':
                return (
                    <FileInput
                        type="image"
                        extra={extra}
                        name={name}
                        onChange={onChange}
                    />
                );
            case 'profile_image':
                return (
                    <ProfileInput
                        type="image"
                        extra={extra}
                        name={name}
                        onChange={onChange}
                    />
                );
            case 'custom':
                return extra.component;
            case 'radio':
                return (
                    <input
                        className={style.componentInput}
                        value={label}
                        type="radio"
                        {...extra}
                        name={name}
                        onChange={e => onChange(e.target.value)}
                        defaultValue={defaultValue}
                    />
                );
            case 'radioList':
                return (
                    <div className={style.radioList}>
                        {extra?.options?.map(option => {
                            return (
                                <div className={style.component}>
                                    <label htmlFor={option.value}>
                                        {option.label}
                                    </label>
                                    <input
                                        className={style.componentInput}
                                        value={option.value}
                                        type="radio"
                                        {...extra}
                                        name={name}
                                        onChange={e => onChange(option)}
                                        checked={
                                            extra?.value?.value === option.value
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>
                );
            default:
                throw new Error('Unknown input type : {' + type + '}');
        }
    })();
    return (
        <div className={style.component}>
            {labelDisposition === 'left' && (
                <label className={style.componentLabel} htmlFor={label}>
                    {label}
                </label>
            )}
            {!labelDisposition && (
                <label className={style.componentLabel} htmlFor={label}>
                    {label}
                </label>
            )}
            {InputElement}
            {labelDisposition === 'right' && (
                <label className={style.componentLabel} htmlFor={label}>
                    {label}
                </label>
            )}
            {error && <p className={style.componentError}>{error}</p>}
        </div>
    );
}
