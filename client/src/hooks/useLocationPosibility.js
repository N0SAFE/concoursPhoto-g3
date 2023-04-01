import { useEffect, useState } from "react";

const getRegionsPossibility = (event, state, { name, code } = {}) => {
    const promiseArray = [];
    if (event === "down" || event === "all") {
        promiseArray.push(getDepartmentsPossibility("down", state));
    }
    if (state.actives.includes("regions")) {
        const filter = [
            code ? `code=${code}` : "" || state.actual.value.codeRegion ? `code=${state.actual.value.codeRegion}` : "",
            name ? `nom=${name}` : "" || state.actual.value.region ? `nom=${state.actual.value.region}` : "",
        ].filter((c) => c !== "");
        console.log(`https://geo.api.gouv.fr/regions?${filter.join("&")}`);
        promiseArray.push(fetch(`https://geo.api.gouv.fr/regions?${filter.join("&")}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                data.length = 30;
                const [regionsPossibility] = data.reduce(
                    ([regionsResponse], c) => {
                        regionsResponse.push({ label: c.nom, value: c.code });
                        return [regionsResponse];
                    },
                    [[], []]
                );
                return { id: "regions", data: regionsPossibility };
            }));
    }
    return Promise.all(promiseArray).then(d => d.flat(2));
};

const getDepartmentsPossibility = (event, state, { codeRegion, name, code } = {}) => {
    const promiseArray = [];
    if (event === "up" || event === "all") {
        promiseArray.push(getRegionsPossibility("up", state));
    }
    if (event === "down" || event === "all") {
        promiseArray.push(getCitiesPossibility("down", state));
    }
    if (state.actives.includes("departments")) {
        const filter = [
            codeRegion ? `codeRegion=${codeRegion}` : "" || state.actual.value.codeRegion ? `codeRegion=${state.actual.value.codeRegion}` : "",
            code ? `code=${code}` : "" || state.actual.value.codeDepartment ? `code=${state.actual.value.codeDepartment}` : "",
            name ? `nom=${name}` : "" || state.actual.value.department ? `nom=${state.actual.value.department}` : "",
        ].filter((c) => c !== "");
        console.log(`https://geo.api.gouv.fr/departements?${filter.join("&")}`);
        promiseArray.push(fetch(`https://geo.api.gouv.fr/departements?${filter.join("&")}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                data.length = 30;
                const [departmentPossibility] = data.reduce(
                    ([departmentResponse], c) => {
                        departmentResponse.push({ label: c.nom, value: c.code, codeRegion: c.codeRegion });
                        return [departmentResponse];
                    },
                    [[]]
                );
                return {id: "departments", data: departmentPossibility};
            }));
    }
    return Promise.all(promiseArray).then(d => d.flat(2));
};

const getCitiesPossibility = async (event, state, { codeRegion, codeDepartment, postcode, name, code } = {}) => {
    const promiseArray = [];
    if (event === "up" || event === "all") {
        promiseArray.push(getDepartmentsPossibility("up", state));
    }
    if (state.actives.includes("cities")) {
        const filter = [
            codeRegion ? `codeRegion=${codeRegion}` : "" || state.actual.value.codeRegion ? `codeRegion=${state.actual.value.codeRegion}` : "",
            codeDepartment ? `codeDepartement=${codeDepartment}` : "" || state.actual.value.codeDepartement ? `codeDepartement=${state.actual.value.codeDepartement}` : "",
            code ? `code=${code}` : "" || state.actual.value.codeCity ? `code=${state.actual.value.codeCity}` : "",
            name ? `nom=${name}` : "" || state.actual.value.city ? `nom=${state.actual.value.city}` : "",
            postcode ? `codePostal=${postcode}` : "" || state.actual.value.postcode ? `codePostal=${state.actual.value.postcode}` : "",
        ].filter((c) => c !== "");
        console.log("https://geo.api.gouv.fr/communes?" + filter.join("&") + "");
        promiseArray.push(
            fetch(`https://geo.api.gouv.fr/communes?${filter.join("&")}`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    data.length = 30;
                    const citiesPossibility = data.reduce((citiesResponse, c) => {
                        citiesResponse.push(c);
                        return citiesResponse;
                    }, []);
                    return {id: "cities", data: citiesPossibility}
                })
        );
    }
    return Promise.all(promiseArray).then(d => d.flat(2));
};

function dataFetch(id, state) {
    switch (id) {
        case "cities":
            return getCitiesPossibility("all", state);
        case "departments":
            return getDepartmentsPossibility("all", state);
        case "regions":
            return getRegionsPossibility("all", state);
        default:
            return getCitiesPossibility("up", state);
    }
}

export default function useLocationPosibility(actives, defaultArgs, {updateOnStart = true} = {}) {
    const [possibilities, setPossibilities] = useState(actives.reduce((p, c) => ((p[c + "Possibility"] = []), p), {}));
    const [actualArgs, setActualArgs] = useState();
    const state = {
        possibilities,
        actual: {
            set: setActualArgs,
            value: actualArgs,
        },
        actives,
    };
    if (actives.length === 0) return [possibilities, () => {}];
    const update = function ({ id, args, overwrite = false }) {
        args = args || {};
        if (id && args.name) {
            args[id] = args.name;
            args.name = null;
        }
        if (overwrite) {
            setActualArgs(args);
            state.actual.value = args;
            dataFetch(id, state).then(p => setPossibilities(p.reduce((acc, { id, data }) => ({ ...acc, [id + "Possibility"]: data }), {})));
        } else {
            const newArgs = { ...actualArgs, ...args };
            setActualArgs(newArgs);
            state.actual.value = newArgs;
            dataFetch(id, state).then(p => setPossibilities(p.reduce((acc, { id, data }) => ({ ...acc, [id + "Possibility"]: data }), {})));
        }
    };
    if(updateOnStart){
        useEffect(() => {
            update(defaultArgs);
        }, []);
    }
    return [possibilities, update];
}
