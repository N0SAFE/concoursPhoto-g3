import React from 'react';
import { Link, Outlet, useLocation, useMatch } from 'react-router-dom';
import style from './style.module.scss';

export default function ({
    list,
    base,
    orientation = 'horizontal',
    style: _style,
    className,
}) {
    const activeTo = location.pathname;
    list.forEach(item => {
        item.active = false;
        const _base = useMatch(base + '/*')?.pathnameBase ?? '/';
        item._to = _base + item.to;
    });

    if (activeTo) {
        const l = list.find(item => {
            if (item.type === 'startwith') {
                return activeTo.startsWith(item._to);
            }
            return item._to === activeTo;
        });
        if (l) {
            l.active = true;
        }
    }

    return (
        <>
            <div
                className={
                    style.navLinkContainer +
                    ' ' +
                    (orientation === 'vertical' &&
                        style.vertical + ' ' + className)
                }
                style={_style}
            >
                <div>
                    {list.map(({ content, _to, active }, index) => (
                        <li key={index} className={active ? style.active : ''}>
                            <Link to={_to}>{content}</Link>
                        </li>
                    ))}
                </div>
            </div>
        </>
    );
}
