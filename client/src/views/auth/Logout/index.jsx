import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth"
import { useEffect } from "react";


export default function(){
    const {logout} = useAuth()
    const navigate = useNavigate()
    
    useEffect(()=> {
        logout().then(()=>{
            navigate("/login")
        })
    })
}