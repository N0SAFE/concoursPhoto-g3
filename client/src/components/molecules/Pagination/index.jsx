import React, { useState } from 'react';
import style from './style.module.scss';
import Input from '@/components/atoms/Input/index.jsx';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button/index.jsx';
import Form from '@/components/organisms/BO/Form/index.jsx';

export default function Pagination({handleChangeValue, optionsArray = [], valueSelected, possibilityNextPage, possibilityPreviousPage, nextPageUrl, previousPageUrl}) {
    const navigate = useNavigate();
    const [pageNumber, setPageNumber] = useState('');

    const handleChange = (selectedOption) => {
        if (selectedOption && selectedOption.value) {
            const value = selectedOption.value;
            handleChangeValue(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/?page=${pageNumber}&itemsPerPage=9`);
    }

    const handlePageNumberChange = (e) => {
        setPageNumber(e);
    };

    return (
        <div className={style.paginationContainer}>
            <Input
                label="Afficher par :"
                className={style.paginationSelect}
                type="select"
                onChange={handleChange}
                extra={{
                    value: {value: parseInt(valueSelected), label: parseInt(valueSelected)},
                    options: optionsArray.map((option) => {
                        return { value: option, label: option };
                    }),
                }}
            />
            <div className={style.pagination}>
                <div>
                    {possibilityPreviousPage && (
                        <Button
                            width="40px"
                            height="40px"
                            borderRadius="50%"
                            icon="cheveron-left"
                            padding="15px 5px"
                            onClick={() => navigate(previousPageUrl)}
                        />
                    )}
                </div>
                <div>
                    {possibilityNextPage && (
                        <Button
                            width="40px"
                            height="40px"
                            borderRadius="50%"
                            icon="cheveron-right"
                            padding="15px 5px"
                            onClick={() => navigate(nextPageUrl)}
                        />
                    )}
                </div>
            </div>
            <div>
                <Form hasSubmit={true} onSubmit={() => navigate(`/?page=${pageNumber}&itemsPerPage=9`)}>
                    <Input
                        label="Aller à la page :"
                        className={style.paginationSelect}
                        type="text"
                        value={pageNumber}
                        onChange={handlePageNumberChange}
                    />
                    <Button
                        name="Go"
                        width="40px"
                        height="40px"
                        borderRadius="50%"
                        padding="15px 5px"
                        type="submit"
                        onClick={handleSubmit}
                    />
                </Form>
            </div>
        </div>
    );
}
