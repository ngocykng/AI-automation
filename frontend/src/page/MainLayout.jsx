import { Outlet } from "react-router-dom";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";


export default function MainLayout() {
    return (
        <>
            <Header />

            <main
                style={{
                    minHeight: "calc(100vh - 120px)"
                }}
            >
                <Outlet />
            </main>

            <Footer />
        </>
    );
}