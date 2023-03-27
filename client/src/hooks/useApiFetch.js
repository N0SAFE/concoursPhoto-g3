import { useAuthContext } from "@/contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function () {
    const navigate = useNavigate();
    const { checkLogged } = useAuthContext()
    return async function (path, options, refreshToken = true) {
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
            if (response.status === 401 || response.status === 403) {
                const data = await response.json();
                if (((response.status === 401 && data.message === "Expired JWT Token") || (reponse.status === 403 && data.message === "Missing token")) && path !== "/token/refresh") {
                    const isLogged = checkLogged();
                    if(!isLogged){
                        navigate("/login");
                        return response;
                    }
                    return useApiFetch(path, options, { refreshToken: false });
                }
            }
            return response;
        } catch {
            return response;
        }
    };
}
