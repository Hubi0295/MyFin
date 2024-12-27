import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect } from "react";
import { INVESTMENT_CATEGORY_CLASS_MAP, INVESTMENT_TYPE_CLASS_MAP } from "../constants";
import Chart from 'chart.js/auto';
export default function Index({auth, investments, success}) {
    useEffect(() => {
        console.log(investments);
    const ctx = document.getElementById('PortfelInwestycyjny');
    const ctx2 = document.getElementById('WynikiSprzedazy');
    const labelsCategories = [];
    const labelsCategoriesSold = [];
    investments.data.forEach(element => {
        if(!labelsCategories.includes(element.type) && element.action==="Buy")
            labelsCategories.push(element.type);
        if(!labelsCategoriesSold.includes(element.type) && element.action==="Sell")
            labelsCategoriesSold.push(element.type);
    });
    labelsCategoriesSold.sort();
    const dataValue =[];
    const bordercolors=[]
    labelsCategories.forEach(element => {
        dataValue.push(investments.data.filter(i => i.action==="Buy" && i.type===element).reduce((sum, transaction) => sum + parseFloat(transaction.amount*transaction.value || 0), 0).toFixed(2));
    });
    const dataValue2 =[];
    labelsCategoriesSold.forEach(element => {
        dataValue2.push(investments.data.filter(i => i.action==="Sell" && i.type===element).reduce((sum, transaction) => sum + parseFloat(transaction.amount*transaction.value || 0), 0).toFixed(2));
        bordercolors.push('rgba(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ', 0.6)');
    });
    console.log(INVESTMENT_CATEGORY_CLASS_MAP[labelsCategories]);
    if (ctx && ctx2) {
            if (ctx.chart) ctx.chart.destroy();
            if (ctx2.chart) ctx2.chart.destroy();
            ctx.chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labelsCategories,
                    datasets: [{
                        label: 'Posiadany portfel inwestycyjny',
                        data: dataValue,
                        backgroundColor: INVESTMENT_CATEGORY_CLASS_MAP[labelsCategories],
                        hoverOffset: 4
                    }]
                  }
                });
            ctx2.chart = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: labelsCategoriesSold,
                    datasets: [{
                        label: 'Wyniki sprzedazy inwestycji',
                        data: dataValue2,
                        backgroundColor: bordercolors,
                        borderColor: bordercolors,
                        borderWidth: 1,
                        hoverOffset: 4
                    }]
                },
                options: {
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid:{
                        color: '#f1f2f4'
                    }
                    },
                    x:{
                        grid:{
                            color: '#f1f2f4'
                        }
                    }
                  }
                },
                });
        }
    }),[investments];
    const deleteInvestment = (investment) => {
        if(!window.confirm('Czy na pewno chcesz usunąć tę transakcję?')) {
            return;
        }
            router.delete(route('investment.destroy', investment.id));
        }
    return (
        <AuthenticatedLayout
        user = {auth.user}
        header={
            <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                <span>{auth.user.name} | </span>
                <span>Saldo: {auth.user.balance.toFixed(2)}</span>
            </h2>
            <Link
            href={route("investment.create")}
            className="bg-emerald-500 py-1 px-1 text-white rounded shadow transition-all hover:bg-emerald-600"
            >
                Dodaj nową Inwestycje
            </Link>
            </div>
        }>
        <Head title="Moj miesiąc" />
        <div className="py-12">
            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <div className="flex justify-between items-center">
                        <div style={{ width: "30%", marginInline: "auto" }}>
                            <canvas id="PortfelInwestycyjny"></canvas>
                        </div>
                    <div className="flex justify-between items-center">
                        <div style={{ width: "600px", marginInline: "auto", marginTop: "80px" }}>
                            <canvas id="WynikiSprzedazy"></canvas>
                        </div>
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
                                        <span className="block text-lg font-semibold text-white-600 text-white-400">
                                            Wpływy: {investments.data.filter(i => i.action==="Sell").reduce((sum, transaction) => sum + parseFloat(transaction.amount*transaction.value || 0), 0).toFixed(2)}
                                        </span></div>
                                        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 overflow-hidden bg-red shadow-sm sm:rounded-lg text-white bg-red-800"> 
                                        <span className="block text-lg font-semibold text-white-600 text-white-400">
                                            Wydatki: {investments.data.filter(i => i.action==="Buy").reduce((sum, transaction) => sum + parseFloat(transaction.amount*transaction.value || 0), 0).toFixed(2)}
                                        </span></div>
                                    </div>
                                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                                <tr>
                                                    <th className="px-3 py-2">ID</th>
                                                    <th className="px-3 py-2">Name</th>
                                                    <th className="px-3 py-2">Description</th>
                                                    <th className="px-3 py-2">Category</th>
                                                    <th className="px-3 py-2">Action</th>
                                                    <th className="px-3 py-2">Amount</th>
                                                    <th className="px-3 py-2">Value</th>
                                                    <th className="px-3 py-2">Date</th>
                                                    <th className="px-3 py-2 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {investments.data.map((investment) => (
                                                    <tr key={investment.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                        <td className="px-3 py-2">{investment.id}</td>
                                                        <td className="px-3 py-2">{investment.name}</td>
                                                        <td className="px-3 py-2">{investment.description}</td>
                                                        <td className="px-3 py-2"><span className={"px-2 py-1 rounded text-white "+ INVESTMENT_CATEGORY_CLASS_MAP[investment.type]}>{investment.type}</span></td>
                                                        <td className="px-3 py-2"><span className={"px-2 py-1 rounded text-white "+ INVESTMENT_TYPE_CLASS_MAP[investment.action]}>{investment.action}</span></td>
                                                        <td className="px-3 py-2">{investment.amount}</td>
                                                        <td className="px-3 py-2">{investment.value}</td>
                                                        <td className="px-3 py-2 text-nowrap">{investment.date_of_operation}</td>
                                                        <td className="px-3 py-2">
                                                        <Link href={route('investment.edit', investment.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">
                                                            Edit
                                                        </Link>  
                                                        <button onClick={e => deleteInvestment(investment)} className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1">
                                                            Delete
                                                        </button>
                                                        </td>
                                                    </tr>
                                                    
                                                ))}
                                            </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>    
        </AuthenticatedLayout>
    );

}