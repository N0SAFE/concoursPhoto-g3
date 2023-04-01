export default function(){
    async function getCityByCode(code){
        console.debug("https://geo.api.gouv.fr/communes/" + code)
        return await fetch("https://geo.api.gouv.fr/communes/" + code).then(r => r.json())
    }
    
    async function getDepartmentBByCode(code){
        console.debug("https://geo.api.gouv.fr/departements/" + code)
        return await fetch("https://geo.api.gouv.fr/departements/" + code).then(r => r.json())
    }
    
    async function regionByCode(code){
        console.debug("https://geo.api.gouv.fr/regions/" + code)
        return await fetch("https://geo.api.gouv.fr/regions/" + code).then(r => r.json())
    }
    
    return {
        getCityByCode,
        getDepartmentBByCode,
        regionByCode
    }
}