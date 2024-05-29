import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";
import '../estilos/Dashboard.css';
import LayoutSingout from "../layout/layoutSingout"

interface Transaction {
    id: string;
    type: string;
    amount: number;
    description: string;
}

export default function Dashboard() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [type, setType] = useState('income');
    const [amount, setAmount] = useState<number>(0);
    const [description, setDescription] = useState('');
    const [editTransactionId, setEditTransactionId] = useState<string | null>(null);
    const auth = useAuth();

    useEffect(() => {
        loadTransactions();
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (editTransactionId) {
            await updateTransaction(editTransactionId);
        } else {
            await createTransaction();
        }
        await loadTransactions();
        clearForm();
    }

    async function createTransaction() {
        try {
            const response = await fetch(`${API_URL}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.getAccessToken()}`,
                },
                body: JSON.stringify({
                    type,
                    amount,
                    description,
                }),
            });

            if (response.ok) {
                const json = await response.json();
                setTransactions([json, ...transactions]);
            } else {
                console.error("Error al crear la transacción:", await response.text());
            }
        } catch (error) {
            console.error("Error al crear la transacción:", error);
        }
    }

    async function updateTransaction(id: string) {
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.getAccessToken()}`,
                },
                body: JSON.stringify({
                    type,
                    amount,
                    description,
                }),
            });

            if (response.ok) {
                await loadTransactions();
                clearForm(); // Limpiar el formulario después de una actualización exitosa
            } else {
                console.error("Error al actualizar la transacción:", await response.text());
            }
        } catch (error) {
            console.error("Error al actualizar la transacción:", error);
        }
    }

    async function deleteTransaction(id: string) {
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${auth.getAccessToken()}`,
                },
            });

            if (response.ok) {
                await loadTransactions();
            } else {
                console.error("Error al eliminar la transacción:", await response.text());
            }
        } catch (error) {
            console.error("Error al eliminar la transacción:", error);
        }
    }

    async function loadTransactions() {
        try {
            const response = await fetch(`${API_URL}/transactions`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.getAccessToken()}`,
                },
            });

            if (response.ok) {
                const json = await response.json();
                setTransactions(json);
            } else {
                console.error("Error al cargar las transacciones:", await response.text());
            }
        } catch (error) {
            console.error("Error al cargar las transacciones:", error);
        }
    }

    function handleEdit(id: string) {
        const transactionToEdit = transactions.find(transaction => transaction.id === id);
        if (transactionToEdit) {
            setEditTransactionId(transactionToEdit.id);
            setType(transactionToEdit.type);
            setAmount(transactionToEdit.amount);
            setDescription(transactionToEdit.description);
        }
    }

    function handleDelete(id: string) {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta transacción?")) {
            deleteTransaction(id);
        }
    }

    function clearForm() {
        setEditTransactionId(null);
        setType('income');
        setAmount(0);
        setDescription('');
    }

    return (
        <LayoutSingout>
            <div className="form">
                <h1 className="title">Ingrosos y gastos de {auth.getUser()?.name || ''}</h1>
                <form  onSubmit={handleSubmit}>
                    <div className="input-group">
                        <select className="input" onChange={(e) => setType(e.target.value)} value={type}>
                            <option value="income">Ingreso</option>
                            <option value="expense">Gasto</option>
                        </select>
                        <input 
                            className="input" 
                            type="number" 
                            placeholder="Monto" 
                            onChange={(e) => setAmount(parseFloat(e.target.value))} 
                            value={amount} 
                            min="0"
                        />
                        <input 
                            className="input" 
                            type="text" 
                            placeholder="Descripción" 
                            onChange={(e) => setDescription(e.target.value)} 
                            value={description} 
                        />
                    </div>
                    <button className="button" type="submit">{editTransactionId ? 'Actualizar' : 'Agregar'}</button>
                    {editTransactionId && (
                        <button className="button cancel" type="button" onClick={() => clearForm()}>Cancelar</button>
                    )}
                </form>
                <div className="summary">
                    <h2>Ingresos: {transactions.filter(transaction => transaction.type === 'income').reduce((sum, transaction) => sum + transaction.amount, 0)}</h2>
                    <h2>Gastos: {transactions.filter(transaction => transaction.type === 'expense').reduce((sum, transaction) => sum + transaction.amount, 0)}</h2>
                    <h2 className={transactions.filter(transaction => transaction.type === 'income').reduce((sum, transaction) => sum + transaction.amount, 0) - transactions.filter(transaction => transaction.type === 'expense').reduce((sum, transaction) => sum + transaction.amount, 0) < 0 ? 'negative-balance' : 'positive-balance'}>
                        Balance: {transactions.filter(transaction => transaction.type === 'income').reduce((sum, transaction) => sum + transaction.amount, 0) - transactions.filter(transaction => transaction.type === 'expense').reduce((sum, transaction) => sum + transaction.amount, 0)}
                    </h2>
                </div>
                <div className="from">
                    {transactions.map((transaction) => (
                        <div className="from" key={transaction.id}>
                            <span>{transaction.type === 'income' ? 'Ingreso' : 'Gasto'}: {transaction.amount}</span>
                            <span> - {transaction.description}</span>
                            <div>
                                <button className="edit-button" onClick={() => handleEdit(transaction.id)}>Editar</button>
                                <button className="delete-button" onClick={() => handleDelete(transaction.id)}>Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </LayoutSingout>
    );
}
