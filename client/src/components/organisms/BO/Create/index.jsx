import { useState, useEffect } from "react";
import React from "react";
import style from "./style.module.scss";

export default function BOCreate({handleSubmit, children}) {
    const refs = {};

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(refs);
            }}
            className={style.form}
        >
            {children}
            <button type="submit">Submit</button>
        </form>
    );
}
