import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {useAuthContext} from "@/contexts/AuthContext";

export default function Home() {
    const {isLogged, me, checkLogged} = useAuthContext();
    const navigate = useNavigate();
    useEffect(() => {
        if (!isLogged) {
            navigate("/login");
        }
    }, []);

    return (
        <div>
            <h1>Home</h1>
            <button onClick={function(){checkLogged()}}>click !</button>
        </div>
    )
}
