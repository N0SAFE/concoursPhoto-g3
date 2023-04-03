import React from "react";
import style from "./style.module.scss";
import Button from "@/components/atoms/Button";

export default function BOForm({ handleSubmit, children, title }) {
    const refs = {};

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(refs);
            }}
            className={style.form}
        >
            <h2>{title}</h2>
            {children}
            <Button type="submit" name="Soumettre" color={"grey"} textColor={"white"} padding={"5px"} border={false} borderRadius={"10px"} />
        </form>
    );
}
