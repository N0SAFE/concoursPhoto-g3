import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth"
import { useEffect } from "react";
import { toast } from "react-toastify";


export default function(){
    const {logout} = useAuth()
    const navigate = useNavigate()

    useEffect(()=> {
        const promise = logout().then(()=>{
            navigate("/auth/login")
        })
        toast.promise(promise, {
            pending: "Déconnexion en cours",
            success: "Déconnexion réussie",
            error: {
                render({ data }) {
                    return data.message;
                },
            }
        }); 
    }, [])
}
