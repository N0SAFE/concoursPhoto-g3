import style from '@/components/atoms/Input/style.module.scss';
import Select from 'react-select';
import { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';

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

export default function Input({
    type,
    name,
    defaultValue,
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
