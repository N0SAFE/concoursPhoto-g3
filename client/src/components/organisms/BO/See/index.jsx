export default function ({ properties = [], entity }) {
    if(!Array.isArray(properties)) {
        throw new Error("properties must be an array");
    }
    if(!(entity instanceof Object)) {
        throw new Error("entity must be an object");
    }
    function createField(property, key) {
        if (!(property instanceof Object)) {
            throw new Error("property must be an object");
        }

        const { display, customData, type = "text", name } = property;

        let data = entity[name];
        if (customData) {
            if (typeof customData === "function") {
                data = customData({ entity, property });
            } else {
                data = customData;
            }
        }
        
        if(type === "text") {
            return (
                <div key={key}>
                    <label>{display} : </label>
                    <span>{data}</span>
                </div>
            );
        }
        if(type === "img"){
            return (
                <div key={key}>
                    <label>{display}</label>
                    <img src={data} />
                </div>
            );
        }
        if(type === "custom"){
            return (
                <div key={key}>
                    <label>{display}</label>
                    {data}
                </div>
            );
        }
        if(type === "list"){
            return (
                <div key={key}>
                    <label>{display}</label>
                    <ul>
                        {data.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>
            );
        }
        if(type === "list-dropdown"){
            return (
                <div key={key}>
                    <label>{display}</label>
                    <ul>
                        {data.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>
            );
        }
    }
    
    return (
        <div style={{display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%"
        }}>
            {properties.map((p, i) => {
                if(Array.isArray(p)){
                    return (
                        <div key={i}>
                            {p.map((property, y) => createField(property, y))}
                        </div>
                    )
                }
                return <div key={i}>
                    {createField(p, i)}
                </div>
            })}
        </div>
    )
}
