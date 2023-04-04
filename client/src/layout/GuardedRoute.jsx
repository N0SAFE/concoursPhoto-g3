import { useAuthContext } from "@/contexts/AuthContext.jsx";
import { Outlet } from "react-router-dom";

export default function({ fallback, verify = () => true }){
    const auth = useAuthContext()
    if(verify(auth)){
        return <Outlet />
    }
    if(typeof fallback === "function"){
        return (
            <>
                {fallback(auth)}
            </>
        )
    }
    return (
        <>
            {fallback}
        </>
    )
}