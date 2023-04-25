import { Outlet } from "react-router-dom";
import Header from "@/layout/PageLayout/Header";
import Footer from "@/layout/PageLayout/Footer";

export default function PageLayout({environment}) {
    return (
        <>
            <Header environment={environment} />
            <Outlet />
            <Footer />
        </>
    );
}