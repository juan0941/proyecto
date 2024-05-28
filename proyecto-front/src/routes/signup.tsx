import { useState } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import {  Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";
import { AuthResponseError } from "../types/types";

export default function Signup() {  // Cambio a Signup (corrección de typo)
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorResponse, setErrorResponse] = useState('');

    const auth = useAuth();
    const goTo = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/signup`, {  
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    username,
                    password
                }),
            });

            if (response.ok) {
                console.log('El usuario se creó correctamente');
                setErrorResponse('');

                goTo('/')
            } else {
                console.log('El usuario no se creó correctamente');
                const json = await response.json() as AuthResponseError;       
                setErrorResponse(json.body.error);
                return;     
}
        } catch (error) {
            console.log(error);
        }
    }

    if (auth.isAuthenticated) {
        return <Navigate to='/dashboard' />;
    }

    return (
        <DefaultLayout>
            <form className="form" onSubmit={handleSubmit}>
                <h1>Signup</h1>  
                {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
                <div className="contenedor-input">
                <label>Nombre</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="contenedor-input">
                <label>Usuario</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="contenedor-input">
                <label>Contraseña</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className="button" type="submit">Crear Usuario</button>  {/* Agregar type="submit" */}
            </form>
        </DefaultLayout>
    );
}
