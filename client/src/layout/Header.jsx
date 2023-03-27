import Navbar from "@/components/molecules/Navbar";
import { Outlet } from "react-router-dom";

export default function Header() {
    return (
        <header>
            <Navbar />
            <Outlet />
        </header>
    )
}
