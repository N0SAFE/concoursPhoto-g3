import useLocationPosibility from "@/hooks/useLocationPosibility.js"
import { useEffect } from "react"

export default function(){
    const [{citiesPossibility, regionsPossibility}, action] = useLocationPosibility(["cities", "regions"], {id: "city", args: {name: "Paris", codeRegion: 76}})
    console.log({citiesPossibility, regionsPossibility})
    useEffect(()=> {
        setTimeout(()=>{
            action({id: "region", args: {codeRegion: 11}, overwrite: false})
        }, 5000)
    }, [])
    return (
        <div>
            <h1>Test</h1>
        </div>
    )
}