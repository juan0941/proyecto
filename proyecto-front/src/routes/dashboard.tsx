import { useAuth } from "../auth/AuthProvider";
import React, { useEffect, useState } from "react";
import { API_URL } from "../auth/constants";

interface Todo {
    id: string;
    title: string;
    completed: boolean;
}

export default function Dashboard() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [title, setTitle] = useState('');
    const auth = useAuth();

    useEffect(() => {
        loadTodos();
    }, []);

    async function handleSubmit(e: React.FocusEvent<HTMLFormElement>){
        e.preventDefault();

        createTodo();
    }

    async function createTodo(){
        try {
            const response = await fetch(`${API_URL}/todos`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.getAccessToken()}`,
                },
                body: JSON.stringify({
                    title,
                }),
            });

            if ( response.ok){
                const json = await response.json();
                setTodos([ json,...todos]);
            }else{
                //mostrar error de conexion
            }
        } catch (error) {
            
        }
    }

    async function loadTodos() {
        try {
            const response = await fetch(`${API_URL}/todos`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.getAccessToken()}`,
                },
            });

            if (response.ok) {
                const json = await response.json();
                setTodos(json);
            } else {
                // Mostrar error en la UI o manejarlo de alguna manera
            }
        } catch (error) {
            // Manejar la excepción adecuadamente, por ejemplo:
            console.error("Error al cargar los todos:", error);
        }
    }

    return (
        <div>
            <h1>Dashboard de {auth.getUser()?.name || ''}</h1>
            <form onSubmit={handleSubmit}>
            <div className="contenedor-input">
                <input type="text" placeholder="Nuevo todo..." onChange={(e) => setTitle(e.target.value)} value={title}/>
            </div>
            </form>
            {todos.map((todo) => (
                <div key={todo.id}>{todo.title}</div>
            ))}
        </div>
    );
}
