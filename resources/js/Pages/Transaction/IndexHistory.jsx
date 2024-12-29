import Pagination from "@/Components/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { TRANSACTION_CATEGORY_CLASS_MAP, TRANSACTION_TYPE_CLASS_MAP } from "../constants";
import Chart from 'chart.js/auto';
import { useEffect } from "react";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
export default function Index({auth, transactions, queryParams=null, success}) {
    
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
        console.log(TRANSACTION_CATEGORY_CLASS_MAP[categoryExpenses]);
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
    queryParams = queryParams || {};
    const searchFieldChanged = (name, value) => {
        if(value) {
            queryParams[name] = value;
        }else{
            delete queryParams[name];
        }
        router.get(route("transaction.history"), queryParams);
    };
    const onKeyPress = (name, e) => {
    if(e.key !== 'Enter') {
        return;
    }
    searchFieldChanged(name, e.target.value);
    };

    const sortChanged = (name) => {
        if(name === queryParams.sort_field) {
            if(queryParams.sort_direction === 'asc') {
                queryParams.sort_direction = 'desc';
            }
            else{
                queryParams.sort_direction = 'asc';
            }
        }
        else{
            queryParams.sort_field = name;
            queryParams.sort_direction = 'asc';
        }
        router.get(route("transaction.history"), queryParams);
    }
    const deleteTransaction = (transaction) => {
        if(!window.confirm('Czy na pewno chcesz usunąć tę transakcję?')) {
        return;
        }
        router.delete(route('transaction.destroy', transaction.id));
    }   
    
    return(
        <AuthenticatedLayout
        user = {auth.user}
        header={
            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                <span>{auth.user.name} | </span>
                <span>Saldo: {auth.user.balance.toFixed(2)}</span>
            </h2>
        }>
        <Head title="Historia transakcji" />
        <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 text-gray-100">
                        <div style={{ width: "400px", float: "left"}}>
                        <div className="flex justify-between items-center">
                                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 overflow-hidden bg-green shadow-sm sm:rounded-lg text-white bg-green-800"> 
                                <span className="block text-lg font-semibold text-white-600 text-white-400">
                                    Wpływy: {incomeTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0).toFixed(2)}
                                </span></div>
                            </div>
                        <canvas id="myChartWplywy"></canvas>
                        </div>
                        <div style={{ width: "400px", float: "right"}}>
                            <div className="flex justify-between items-center">
                            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 overflow-hidden bg-red shadow-sm sm:rounded-lg text-white bg-red-800"> 
                                <span className="block text-lg font-semibold text-white-600 text-white-400">
                                    Wydatki: {expenseTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0).toFixed(2)}
                                </span></div>
                            </div>
                        <canvas id="myChartWydatki"></canvas>
                        </div>
                        
                        </div>
                    </div>
                </div>
            </div>    
        <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                {success && (
                    <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
                    {success}
                    </div>
                )}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-between items-center">
                                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 overflow-hidden bg-green shadow-sm sm:rounded-lg text-white bg-green-800"> 
                                <span className="block text-lg font-semibold text-white-600 dark:text-white-400">
                                    Wpływy: {incomeTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0).toFixed(2)}
                                </span></div>
                                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 overflow-hidden bg-red shadow-sm sm:rounded-lg text-white bg-red-800"> 
                                <span className="block text-lg font-semibold text-white-600 dark:text-white-400">
                                    Wydatki: {expenseTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0).toFixed(2)}
                                </span></div>
                            </div>
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr className="text-nowrap">
                                            <th onClick={e => sortChanged('id')} className="px-3 py-2 cursor-pointer">ID</th>
                                            <th onClick={e => sortChanged('name')} className="px-3 py-2 cursor-pointer">nazwa</th>
                                            <th onClick={e => sortChanged('description')} className="px-3 py-2 cursor-pointer">opis</th>
                                            <th onClick={e => sortChanged('type')} className="px-3 py-2 cursor-pointer">typ</th>
                                            <th onClick={e => sortChanged('amount')} className="px-3 py-2 cursor-pointer">kwota</th>
                                            <th onClick={e => sortChanged('category')} className="px-3 py-2 cursor-pointer">kategoria</th>
                                            <th onClick={e => sortChanged('date')} className="px-3 py-2 cursor-pointer">data</th>
                                            <th className="px-3 py-2 text-right">akcja</th>
                                        </tr>
                                    </thead>
                                
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr className="text-nowrap">
                                            <th className="px-3 py-2"></th>
                                            <th className="px-3 py-2">
                                            <TextInput
                                                className="w-full"
                                                placeholder="Nazwa"
                                                defaultValue={queryParams.name}
                                                onBlur={(e) =>
                                                    searchFieldChanged("name", e.target.value)
                                                }
                                                onKeyPress={(e) => onKeyPress("name", e)}
                                            />
                                            </th>
                                            <th className="px-3 py-2"></th>
                                            <th className="px-3 py-2">
                                            <SelectInput
                                                className="mx-auto"
                                                defaultValue={queryParams.type}
                                                onChange={(e) =>
                                                    searchFieldChanged("type", e.target.value)
                                                }
                                            >
                                                <option value="">Typ</option>
                                                <option value="Income">Income</option>
                                                <option value="Expense">Expense</option>
                                            </SelectInput>
                                            </th>
                                            
                                            <th className="px-3 py-2">
                                            <div className="flex flex-col space-y-2">
                                            <TextInput
                                                className="w-full"
                                                placeholder=">="
                                                defaultValue={queryParams.amountWiekszeRowne}
                                                onBlur={(e) =>
                                                    searchFieldChanged("amountWiekszeRowne", e.target.value)
                                                }
                                                onKeyPress={(e) => onKeyPress("amountWiekszeRowne", e)}
                                            />
                                            <TextInput
                                                className="w-full"
                                                placeholder="<="
                                                defaultValue={queryParams.amountMniejszeRowne}
                                                onBlur={(e) =>
                                                    searchFieldChanged("amountMniejszeRowne", e.target.value)
                                                }
                                                onKeyPress={(e) => onKeyPress("amountMniejszeRowne", e)}
                                            />
                                            </div>
                                            </th>
                                            
                                            <th className="px-3 py-2">
                                                <SelectInput
                                                    className="mx-auto"
                                                    defaultValue={queryParams.category}
                                                    onChange={(e) =>
                                                        searchFieldChanged("category", e.target.value)
                                                    }
                                                >
                                                    <option value="">Kategoria</option>
                                                    <option value="Salary">Salary</option>
                                                    <option value="Food">Food</option>
                                                    <option value="Transport">Transport</option>
                                                    <option value="Entertainment">Entertainment</option>
                                                    <option value="Education">Education</option>
                                                    <option value="Home">Home</option>
                                                    <option value="Service">Service</option>
                                                    <option value="Investment">Investment</option>
                                                    <option value="Other">Other</option>
                                                </SelectInput>
                                            </th>
                                            
                                            <th className="px-3 py-2">
                                            <div className="flex flex-col space-y-2">
                                            <TextInput
                                                className="mx-auto p-2  rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                                defaultValue={queryParams.dateFrom}
                                                placeholder="Data Od"
                                                type="date"
                                                onKeyDown={(e) => e.preventDefault()}
                                                onChange={(e) => searchFieldChanged("dateFrom", e.target.value)}
                                            />
                                                Data od
                                            <TextInput
                                                className="mx-auto p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                                defaultValue={queryParams.dateTo}
                                                placeholder="Data Do"
                                                type="date"
                                                onKeyDown={(e) => e.preventDefault()}
                                                onChange={(e) => searchFieldChanged("dateTo", e.target.value)}
                                            />
                                                Data do
                                            </div>
                                            </th>
                                            
                                            <th className="px-3 py-2 text-right">
                                                <input  className="ml-auto px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800"
                                                type="button" value="Reset" onClick={() => router.get(route("transaction.history"))} />
                                            </th>
                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                            {transactions.data.map(transaction => ( 
                                            <tr key={transaction.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <td className="px-3 py-2">{transaction.id}</td>
                                                <td className="px-3 py-2">{transaction.name}</td>
                                                <td className="px-3 py-2">{transaction.description}</td>
                                                <td className="px-3 py-2"><span className={"px-2 py-1 rounded text-white "+ TRANSACTION_TYPE_CLASS_MAP[transaction.type]}>{transaction.type}</span></td>
                                                <td className="px-3 py-2">{transaction.amount}</td>
                                                <td className="px-3 py-2"><span className={"px-2 py-1 rounded text-white "+ TRANSACTION_CATEGORY_CLASS_MAP[transaction.category]}>{transaction.category}</span></td>
                                                <td className="px-3 py-2 text-nowrap">{transaction.date}</td>
                                                <td className="px-3 py-2">
                                                {transaction.category !== 'Investment' && (
                                                    <>
                                                        <Link href={route('transaction.edit', transaction.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">
                                                            Edytuj
                                                        </Link>  
                                                        <button onClick={e => deleteTransaction(transaction)} className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1">
                                                            Usuń
                                                        </button>
                                                    </>
                                                )}
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
           
        </AuthenticatedLayout>
    );
}