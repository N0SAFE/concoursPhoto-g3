import React from 'react';
import style from './style.module.scss';
import Button from '@/components/atoms/Button';

export default function Form({
    handleSubmit,
    children,
    title,
    className,
    hasSubmit = false,
}) {
    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                handleSubmit(e);
            }}
            className={className ?? style.form}
        >
            {title ? <h2>{title}</h2> : null}
            {children}
            {!hasSubmit && (
                <Button
                    type="submit"
                    color={'grey'}
                    textColor={'white'}
                    padding={'5px'}
                    border={false}
                    borderRadius={'10px'}
                >
                    Soumettre
                </Button>
            )}
        </form>
    );
}
