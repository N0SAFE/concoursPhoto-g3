import { useAuthContext } from "@/contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function () {
    const navigate = useNavigate();
    const { checkLogged } = useAuthContext()
    return async function apiFetch(path, options, {refreshToken = true} = {}) {
        if(!options){
            options = {};
        }
        if(typeof options !== "object"){
            throw new Error("options must be an object");
        }
        options.credentials = "include";
        const response = await fetch(new URL(import.meta.env.VITE_API_URL + path), options);
        if(!refreshToken) {
            return response
        }
        try {
            if (response.status === 401) {
                const data = await response.json();
                response.json = async () => data;
                if ((data.message === "Expired JWT Token" || data.message === "Missing token" || data.message === "Invalid credentials.") && path !== "/token/refresh") {
                    const {isLogged} = await checkLogged();
                    if(!isLogged){
                        navigate("/auth/logout");
                        toast.error("une erreur est survenue, veuillez vous reconnecter");
                        return response;
                    }
                    return apiFetch(path, options, { refreshToken: false });
                }
            }
            return response;
        } catch(e) {
            return response;
        }
    };
}
