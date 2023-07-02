import React, { useState } from 'react';
import style from './style.module.scss';
import Input from '@/components/atoms/Input/index.jsx';
import Button from '@/components/atoms/Button/index.jsx';
import Form from '@/components/organisms/BO/Form/index.jsx';

const DEFAULT_ITEMS_PER_PAGE = 9;

const caching = {};

export default function Pagination({
    classListInnerContainer = '',
    _useBetaCache = false,
    items,
    totalPageCount,
    defaultCurrentPage = 1,
    defaultItemPerPage = 9,
    onPageChange = function () {},
    onItemsPerPageChange = function () {},
    onChange = function () {},
    renderItem = function (item) {
        return item;
    },
    children = function (items) {
        return items;
    },
    itemPerPageSelectorValue = Array.from(
        { length: DEFAULT_ITEMS_PER_PAGE },
        (_, index) => index + 1
    ),
}) {
    const [_pageCurrent, _setPageCurrent] = useState(
        parseInt(defaultCurrentPage)
    );
    const [_itemPerPage, _setItemsPerPage] = useState(
        parseInt(defaultItemPerPage)
    );

    if (isNaN(_pageCurrent) || isNaN(_itemPerPage)) {
        throw new Error(
            'Pagination: pageCurrent and itemPerPage must must be a number'
        );
    }

    const hasPreviousPage = _pageCurrent > 1;
    const hasNextPage = _pageCurrent < totalPageCount;

    const dotSize = 2;
    const dots = [];
    const start = Math.max(1, _pageCurrent - dotSize);
    const end = Math.min(totalPageCount, _pageCurrent + dotSize);
    for (let i = start; i <= end; i++) {
        dots.push(i);
    }

    if (_pageCurrent !== 1 && items.length === 0) {
        _setPageCurrent(1);
        onPageChange(1);
    }

    return (
        <div className={style.container}>
            <div className={classListInnerContainer}>
                {children(items.map(renderItem), {
                    pageCurrent: _pageCurrent,
                    itemPerPage: _itemPerPage,
                    totalPageCount,
                    hasNextPage,
                    hasPreviousPage,
                    dots,
                })}
            </div>
            <div className={style.paginationContainer}>
                <Input
                    label="Afficher par :"
                    className={style.paginationSelect}
                    type="select"
                    onChange={({ value }) => {
                        _setItemsPerPage(value);
                        onItemsPerPageChange(value);
                        onChange();
                    }}
                    extra={{
                        value: {
                            value: parseInt(_itemPerPage),
                            label: parseInt(_itemPerPage),
                        },
                        options: itemPerPageSelectorValue.map(option => {
                            return { value: option, label: option };
                        }),
                    }}
                />
                <div className={style.pagination}>
                    <div>
                        {hasPreviousPage ? (
                            <Button
                                width="40px"
                                height="40px"
                                borderRadius="50%"
                                icon="cheveron-left"
                                padding="15px 5px"
                                onClick={() => {
                                    const page = _pageCurrent - 1;
                                    _setPageCurrent(page);
                                    onPageChange(page);
                                    onChange();
                                }}
                            />
                        ) : (
                            <Button
                                width="40px"
                                height="40px"
                                borderRadius="50%"
                                icon="cheveron-left"
                                padding="15px 5px"
                                disabled
                            />
                        )}
                    </div>
                    {dots.map((dot, index) => {
                        return (
                            <div>
                                <Button
                                    width="40px"
                                    height="40px"
                                    borderRadius="50%"
                                    padding="15px 5px"
                                    onClick={() => {
                                        if (dot === _pageCurrent) return;
                                        _setPageCurrent(dot);
                                        onPageChange(dot);
                                        onChange();
                                    }}
                                    style={{
                                        backgroundColor:
                                            _pageCurrent === dot && '#000',
                                        color: _pageCurrent === dot && '#fff',
                                    }}
                                >
                                    {dot}
                                </Button>
                            </div>
                        );
                    })}
                    <div>
                        {hasNextPage ? (
                            <Button
                                width="40px"
                                height="40px"
                                borderRadius="50%"
                                icon="cheveron-right"
                                padding="15px 5px"
                                onClick={() => {
                                    const page = _pageCurrent + 1;
                                    _setPageCurrent(page);
                                    onPageChange(page);
                                    onChange();
                                }}
                            />
                        ) : (
                            <Button
                                width="40px"
                                height="40px"
                                borderRadius="50%"
                                icon="cheveron-right"
                                padding="15px 5px"
                                disabled
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Form
                        hasSubmit={true}
                        handleSubmit={e => {
                            const page = parseInt(e.target.page.value);
                            if (isNaN(page)) return;
                            if (page < 1) return;
                            onPageChange(page);
                            _setPageCurrent(page);
                            onChange();
                        }}
                    >
                        <Input
                            name="page"
                            label="Aller à la page :"
                            className={style.paginationSelect}
                            type="number"
                            value={_pageCurrent}
                        />
                        <Button
                            width="40px"
                            height="40px"
                            borderRadius="50%"
                            padding="15px 5px"
                            type="submit"
                        >
                            Go
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}
