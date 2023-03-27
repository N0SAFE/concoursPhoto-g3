import style from "./style.module.scss";

export default function BOList({ fields, entityList, customAction = () => true, useId = true, actions = [] }) {
    return (
        <table className={style.table}>
            <thead>
                <tr>
                    {fields.map(({ display }, index) =>
                        <th key={index}>
                            {display}
                        </th>
                    )}
                    <th>
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                {entityList.map((entity, index) =>
                    <tr key={useId ? entity.id : index}>
                        {fields.map(({ property }, index) => {
                            if (typeof customAction !== "function") {
                                throw new Error("customAction must be a function");
                            }

                            const customActionResponse = customAction({ entity, property });
                            if (!customActionResponse) {
                                return (
                                    <td key={index}>
                                        {entity[property]}
                                    </td>
                                );
                            }

                            return (
                                <td key={index}>
                                    {customActionResponse}
                                </td>
                            );
                        })}
                        <td>
                            {actions.map(({ action, label }, index) => {
                                return (
                                    <button key={index} onClick={() => action({ entity })}>
                                        {label}
                                    </button>
                                );
                            })}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
