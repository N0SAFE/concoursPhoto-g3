import style from './style.module.scss';
import Button from '@/components/atoms/Button';

export default function Table({
    fields,
    list,
    actions = [],
    children,
    onLineClick = (entity) => {}
}) {
    return (
        <table className={style.tableContainer}>
            <thead>
                <tr>
                    {fields.map((display, index) => (
                        <th key={index}>{display}</th>
                    ))}
                    {actions.length > 0 && <th>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {list?.map(function (entity) {
                    const entityFields = children(entity);
                    return (
                        <tr key={entity.id} onClick={() => onLineClick(entity)}>
                            {entityFields.map(function ({content, style}, index) {
                                return <td style={style} key={index}>{content}</td>;
                            })}
                            {actions.length > 0 && (
                                <td>
                                    {actions.map(function (
                                        { name, action, component },
                                        index
                                    ) {
                                        if(typeof component === "function"){
                                            return component(entity, action, index);
                                        }else if(component){
                                            return component;
                                        }
                                        return (
                                            <Button
                                                key={index}
                                                onClick={() => callback(entity)}
                                            >
                                                {name}
                                            </Button>
                                        );
                                    })}
                                </td>
                            )}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
