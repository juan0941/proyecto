import React from "react";
import '../estilos/DefaultLayout.css'
import { Link } from "react-router-dom";
interface DefaultLayoutProps {
    children: React.ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps){
    return(
        <>
            <header>
                <nav className="navbar">
                <div className="navbar-brand">
                    <a href="/">/JR/</a>
                </div>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to='/'>home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/signup'>register</Link>
                        </li>
                    </ul>
                </nav>
            </header>

            <main>{children}</main>
        </>
    )
}
