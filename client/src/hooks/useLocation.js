export default function () {
    async function getCityByCode(code) {
        console.debug("https://geo.api.gouv.fr/communes/" + code);
        return await fetch("https://geo.api.gouv.fr/communes/" + code).then((r) => r.json()).then(d => {d.length = 30; return d});
    }

    async function getCityByName(name) {
        console.debug(`https://geo.api.gouv.fr/communes${name ? "?nom=" + name : ""}`);
        return await fetch(`https://geo.api.gouv.fr/communes${name ? "?nom=" + name : ""}`).then((r) => r.json()).then(d => {d.length = 30; return d});
    }

    async function getDepartmentByCode(code) {
        console.debug("https://geo.api.gouv.fr/departements/" + code);
        return await fetch("https://geo.api.gouv.fr/departements/" + code).then((r) => r.json()).then(d => {d.length = 30; return d});
    }

    async function getDepartmentByName(name) {
        console.debug(`https://geo.api.gouv.fr/departements${name ? "?nom=" + name : ""}`);
        return await fetch(`https://geo.api.gouv.fr/departements${name ? "?nom=" + name : ""}`).then((r) => r.json()).then(d => {d.length = 30; return d});
    }

    async function getRegionByCode(code) {
        console.debug("https://geo.api.gouv.fr/regions/" + code);
        return await fetch("https://geo.api.gouv.fr/regions/" + code).then((r) => r.json()).then(d => {d.length = 30; return d});
    }

    async function getRegionByName(name) {
        console.debug(`https://geo.api.gouv.fr/regions${name ? "?nom=" + name : ""}`);
        return await fetch(`https://geo.api.gouv.fr/regions${name ? "?nom=" + name : ""}`).then((r) => r.json()).then(d => {d.length = 30; return d});
    }

    return {
        getCityByCode,
        getCityByName,
        getDepartmentByCode,
        getDepartmentByName,
        getRegionByName,
        getRegionByCode,
    };
}
