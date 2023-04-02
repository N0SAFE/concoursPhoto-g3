import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth"
import { useEffect } from "react";
import { toast } from "react-toastify";


export default function(){
    const {logout} = useAuth()
    const navigate = useNavigate()
    
    useEffect(()=> {
        logout().then(()=>{
            navigate("/login")
            toast.success("Vous êtes déconnecté")
        })
    })
}