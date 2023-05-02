export default function () {
    async function getCityByCode(code, { limit = 30, controller } = {}) {
        console.debug('https://geo.api.gouv.fr/communes/' + code);
        return await fetch('https://geo.api.gouv.fr/communes/' + code, {
            signal: controller?.signal,
        })
            .then(r => r.json())
            .then(d => {
                d.length = limit;
                return d;
            });
    }

    async function getCityByName(name, { limit = 30, controller } = {}) {
        console.debug(
            `https://geo.api.gouv.fr/communes${name ? '?nom=' + name : ''}`
        );
        return await fetch(
            `https://geo.api.gouv.fr/communes${name ? '?nom=' + name : ''}`,
            { signal: controller?.signal }
        )
            .then(r => r.json())
            .then(d => {
                d.length = limit;
                return d;
            });
    }

    async function getDepartmentByCode(code, { limit = 30, controller } = {}) {
        console.debug('https://geo.api.gouv.fr/departements/' + code);
        return await fetch('https://geo.api.gouv.fr/departements/' + code, {
            signal: controller?.signal,
        })
            .then(r => r.json())
            .then(d => {
                d.length = limit;
                return d;
            });
    }

    async function getDepartmentByName(name, { limit = 30, controller } = {}) {
        console.debug(
            `https://geo.api.gouv.fr/departements${name ? '?nom=' + name : ''}`
        );
        return await fetch(
            `https://geo.api.gouv.fr/departements${name ? '?nom=' + name : ''}`,
            { signal: controller?.signal }
        )
            .then(r => r.json())
            .then(d => {
                d.length = limit;
                return d;
            });
    }

    async function getRegionByCode(code, { limit = 30, controller } = {}) {
        console.debug('https://geo.api.gouv.fr/regions/' + code);
        return await fetch('https://geo.api.gouv.fr/regions/' + code, {
            signal: controller?.signal,
        })
            .then(r => r.json())
            .then(d => {
                d.length = limit;
                return d;
            });
    }

    async function getRegionByName(name, { limit = 30, controller } = {}) {
        console.debug(
            `https://geo.api.gouv.fr/regions${name ? '?nom=' + name : ''}`
        );
        return await fetch(
            `https://geo.api.gouv.fr/regions${name ? '?nom=' + name : ''}`,
            { signal: controller?.signal }
        )
            .then(r => r.json())
            .then(d => {
                d.length = limit;
                return d;
            });
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
