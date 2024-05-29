import React from "react";
import '../estilos/DefaultLayout.css'
import { Link } from "react-router-dom";
interface layoutSingoutProps {
    children: React.ReactNode;
}

export default function LayoutSingout({ children }: layoutSingoutProps){
    return(
        <>
            <header>
                <nav className="navbar">
                <div className="navbar-brand">
                    <a href="/">/JR/</a>
                </div>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                         <a href="/">cerrar sesion</a>
                        </li>

                    </ul>
                </nav>
            </header>

            <main>{children}</main>
        </>
    )
}
