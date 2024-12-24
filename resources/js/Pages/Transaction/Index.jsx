import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { TRANSACTION_CATEGORY_CLASS_MAP, TRANSACTION_TYPE_CLASS_MAP } from "../constants";
import Chart from 'chart.js/auto';
import { useEffect } from "react";
export default function Index({auth, transactions}) {
    
    useEffect(() => {
        // Filtruj kategorie i oblicz wartości wydatków
        const categories = [...new Set(transactions.data.map(transaction => transaction.category))];
        const categoryExpenses = categories.map(category => 
            transactions.data
                .filter(transaction => transaction.category === category && transaction.type === "Expense")
                .reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0)
        );
        const categoryIncomes = categories.map(category => 
            transactions.data
                .filter(transaction => transaction.category === category && transaction.type === "Income")
                .reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0)
        );
        // Pobierz kontekst canvas i inicjalizuj wykres
        const ctx = document.getElementById('myChartWydatki');
        const ctx2 = document.getElementById('myChartWplywy');
        if (ctx && ctx2) {
            // Usuń istniejący wykres, jeśli istnieje
            if (ctx.chart) ctx.chart.destroy();
            if (ctx2.chart) ctx2.chart.destroy();    
            // Utwórz nowy wykres
            ctx.chart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: categories,
                    datasets: [{
                        label: 'Wydatki',
                        data: categoryExpenses,
                        backgroundColor: TRANSACTION_CATEGORY_CLASS_MAP[categoryExpenses],
                        hoverOffset: 4
                    }]
                  }
                });
                ctx2.chart = new Chart(ctx2, {
                    type: 'doughnut',
                    data: {
                        labels: categories,
                        datasets: [{
                            label: 'Wpływy',
                            data: categoryIncomes,
                            backgroundColor: TRANSACTION_CATEGORY_CLASS_MAP[categoryIncomes],
                            hoverOffset: 4
                        }]
                      }
                    });
        }
        
    }, [transactions]); // Uruchamiaj useEffect za każdym razem, gdy zmienią się dane `transactions`

    const incomeTransactions = transactions.data.filter(transaction => transaction.type === 'Income');
    const expenseTransactions = transactions.data.filter(transaction => transaction.type === 'Expense');
    return(
        <AuthenticatedLayout
        user = {auth.user}
        header={
            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                <span>{auth.user.name} | </span>
                <span>Saldo: {auth.user.balance.toFixed(2)}</span>
            </h2>
        }>
        <Head title="Moj miesiąc" />
        
        <div className="py-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                     <div className="p-6 text-gray-900 dark:text-gray-100">
                     <div className="flex justify-between items-center">
                                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-green-800"> 
                                <span className="block text-lg font-semibold text-white-600 dark:text-white-400">
                                    Wpływy: {incomeTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0).toFixed(2)}
                                </span></div>
                                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-red-800"> 
                                <span className="block text-lg font-semibold text-white-600 dark:text-white-400">
                                    Wydatki: {expenseTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0).toFixed(2)}
                                </span></div>
                            </div>
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr className="text-nowrap">
                                            <th className="px-3 py-2">ID</th>
                                            <th className="px-3 py-2">name</th>
                                            <th className="px-3 py-2">description</th>
                                            <th className="px-3 py-2">type</th>
                                            <th className="px-3 py-2">amount</th>
                                            <th className="px-3 py-2">category</th>
                                            <th className="px-3 py-2">date</th>
                                            <th className="px-3 py-2 text-right">action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {incomeTransactions.map((transaction) => (
                                            <tr key={transaction.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <td className="px-3 py-2">{transaction.id}</td>
                                                <td className="px-3 py-2">{transaction.name}</td>
                                                <td className="px-3 py-2">{transaction.description}</td>
                                                <td className="px-3 py-2"><span className={"px-2 py-1 rounded text-white "+ TRANSACTION_TYPE_CLASS_MAP[transaction.type]}>{transaction.type}</span></td>
                                                <td className="px-3 py-2">{transaction.amount}</td>
                                                <td className="px-3 py-2"><span className={"px-2 py-1 rounded text-white "+ TRANSACTION_CATEGORY_CLASS_MAP[transaction.category]}>{transaction.category}</span></td>
                                                <td className="px-3 py-2 text-nowrap">{transaction.date}</td>
                                                <td className="px-3 py-2"><Link href={route('transaction.edit', transaction.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">
                                                Edit
                                                </Link>  
                                                <Link href={route('transaction.destroy', transaction.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1">
                                                Delete
                                                </Link>  
                                                </td>
                                            </tr>
                                            
                                        ))}
                                    </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>    
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr className="text-nowrap">
                                            <th className="px-3 py-2">ID</th>
                                            <th className="px-3 py-2">name</th>
                                            <th className="px-3 py-2">description</th>
                                            <th className="px-3 py-2">type</th>
                                            <th className="px-3 py-2">amount</th>
                                            <th className="px-3 py-2">category</th>
                                            <th className="px-3 py-2">date</th>
                                            <th className="px-3 py-2 text-right">action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {expenseTransactions.map((transaction) => (
                                            <tr key={transaction.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <td className="px-3 py-2">{transaction.id}</td>
                                                <td className="px-3 py-2">{transaction.name}</td>
                                                <td className="px-3 py-2">{transaction.description}</td>
                                                <td className="px-3 py-2"><span className={"px-2 py-1 rounded text-white "+ TRANSACTION_TYPE_CLASS_MAP[transaction.type]}>{transaction.type}</span></td>
                                                <td className="px-3 py-2">{transaction.amount}</td>
                                                <td className="px-3 py-2"><span className={"px-2 py-1 rounded text-white "+ TRANSACTION_CATEGORY_CLASS_MAP[transaction.category]}>{transaction.category}</span></td>
                                                <td className="px-3 py-2 text-nowrap">{transaction.date}</td>
                                                <td className="px-3 py-2"><Link href={route('transaction.edit', transaction.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">
                                                Edit
                                                </Link>  
                                                <Link href={route('transaction.destroy', transaction.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1">
                                                Delete
                                                </Link>  
                                                </td>
                                            </tr>
                                            
                                        ))}
                                    </tbody>
                            </table>
                            <Pagination links={transactions.meta.links} />
                        </div>
                    </div>
                </div>
            </div>    
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                        <div style={{ width: "500px", float: "left"}}>
                        <canvas id="myChartWydatki"></canvas>
                        </div>
                        <div style={{ width: "500px", float: "right"}}>
                        <canvas id="myChartWplywy"></canvas>
                        </div>
                        </div>
                    </div>
                </div>
            </div>    
        </AuthenticatedLayout>
    );
}