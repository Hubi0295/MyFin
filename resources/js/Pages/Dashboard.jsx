import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import Chart from 'chart.js/auto';
// 'balance' => $balance,
// 'inwestycjeKupioneWCiaguRoku' => TransactionResource::collection($inwestycjeKupioneWCiaguRoku),
// 'inwestycjeSprzedaneWCiaguRoku' => TransactionResource::collection($inwestycjeSprzedaneWCiaguRoku),
// 'wydatkiWCiaguRoku' => TransactionResource::collection($wydatkiWCiaguRoku),
// 'wplywyWCiaguRoku' => TransactionResource::collection($wplywyWCiaguRoku),
export default function Dashboard({ auth, balance, transakcjeRoczne }) {
    useEffect(() => {
        // const categoryExpenses = categories.map(category => 
        //     transactions.data
        //         .filter(transaction => transaction.category === category && transaction.type === "Expense")
        //         .reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0)
        // );

            const getLastThreeMonths = () => {
              const monthNames = [
                "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
                "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
              ];
              const today = new Date();
              const lastThreeMonths = [];
          
              for (let i = 1; i <= 3; i++) {
                const date = new Date(today.getFullYear(), today.getMonth() - i+1, 1);
                lastThreeMonths.push(monthNames[date.getMonth()]);
                lastThreeMonths.push(monthNames[date.getMonth()]);
              }
          
              return lastThreeMonths;
            };

            
        const x = document.getElementById('1');
        const y = document.getElementById('2');
        const z = document.getElementById('3');
        const a = document.getElementById('4');
        x.innerHTML = transakcjeRoczne.data.filter(t=>t.type==="Income").reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0);
        y.innerHTML = transakcjeRoczne.data.filter(t=>t.type==="Expense").reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0);
        z.innerHTML = transakcjeRoczne.data.filter(t=>(t.type==="Income" && t.category==="Investment")).reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0);
        a.innerHTML = transakcjeRoczne.data.filter(t=>(t.type==="Expense" && t.category==="Investment")).reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0);
        
        const ctx = document.getElementById('myChart1');
        const ctx2 = document.getElementById('myChart2');
        const ctx3 = document.getElementById('myChart3');
        const ctx4 = document.getElementById('myChart4');
        const labels = getLastThreeMonths().reverse();
        const today = new Date();

        // Funkcja obliczająca datę początku miesiąca w przeszłości
        const getMonthStartDate = (year, month) => new Date(year, month, 1);
        const startDates = [getMonthStartDate(today.getFullYear(), today.getMonth() - 3),getMonthStartDate(today.getFullYear(), today.getMonth() - 2),getMonthStartDate(today.getFullYear(), today.getMonth() - 1),];
        const endDates = [getMonthStartDate(today.getFullYear(), today.getMonth() - 2),getMonthStartDate(today.getFullYear(), today.getMonth() - 1),today,];
        const monthlyExpenses = [0, 0, 0];
        const monthlyIncomes = [0, 0, 0];
        transakcjeRoczne.data
          .forEach(transaction => {
            const transactionDate = new Date(transaction.date);
            for (let i = 0; i < 3; i++) {
              if (transactionDate >= startDates[i] && transactionDate < endDates[i]) {
                if(transaction.type === "Expense")
                    monthlyExpenses[i] += parseFloat(transaction.amount);
                if(transaction.type === "Income")
                    monthlyIncomes[i] += parseFloat(transaction.amount);
                break;
              }
            }
          });
        const monthlyExpensesAndIncomes = [];
        for(let i = 0; i < 3; i++) {
            monthlyExpensesAndIncomes.push(monthlyExpenses[i]);
            monthlyExpensesAndIncomes.push(monthlyIncomes[i]);
        }
        const data = {
            labels: labels,
            datasets: [{
                label: 'Bilans wydatków i przychodów w ostatnich 3 miesiącach',
                data: monthlyExpensesAndIncomes,
                backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                ],
                borderWidth: 1
            }]
        };

        const label2 = [];
        for(let i = 0; i < 5; i++) {
            const pomoc = new Date(today.getFullYear()-i, today.getMonth()+1,today.getDate(), 1);
            for(let j=0;j<4;j++){
                label2.push(new Date(pomoc.getFullYear(), pomoc.getMonth()-j*3));
            }
        }
        const quartalInvestmentExpenses = new Array(19).fill(0);
        const quartalInvestmentIncomes = new Array(19).fill(0);
        label2.reverse();
        const odnosnik = new Date(today.getFullYear()-5, today.getMonth(),today.getDate(), 1);
        
        // Filtrowanie i przetwarzanie transakcji
        transakcjeRoczne.data
            .filter(t => t.category === "Investment" && new Date(t.date) >= odnosnik)
            .forEach(transaction => {
                const transactionDate = new Date(transaction.date);
        
                for (let i = 0; i < 19; i++) {
                    // Jeśli data transakcji pasuje do zakresu
                    if (transactionDate > label2[i] && transactionDate <= label2[i + 1]) {
                        if (transaction.type === "Expense") {
                            quartalInvestmentExpenses[i] += parseFloat(transaction.amount);
                        }
                        if (transaction.type === "Income") {
                            quartalInvestmentIncomes[i] += parseFloat(transaction.amount);
                        }
                        break; // Po przetworzeniu transakcji przerywamy pętlę
                    }
                }
            });
        
        // Przepisywanie wartości do pustych przedziałów
        for (let i = 1; i < 19; i++) {
            if (quartalInvestmentExpenses[i] === 0) {
                quartalInvestmentExpenses[i] = quartalInvestmentExpenses[i - 1];
            }
            if (quartalInvestmentIncomes[i] === 0) {
                quartalInvestmentIncomes[i] = quartalInvestmentIncomes[i - 1];
            }
        }
        console.log("Wydatki",quartalInvestmentExpenses);
        console.log("Przychody",quartalInvestmentIncomes);
        const data2 = {
        labels: label2,
        datasets: [
            {
            label: 'Dataset 1',
            data: quartalInvestmentExpenses,
            borderColor: 'rgba(255, 99, 132, 0.2)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            },
            {
            label: 'Dataset 2',
            data: quartalInvestmentIncomes,
            borderColor: 'rgba(255, 99, 132, 0.2)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            }
        ]
        };
        if (ctx && ctx2 && ctx3 && ctx4) {
            // Usuń istniejący wykres, jeśli istnieje
            if (ctx.chart) ctx.chart.destroy();
            if (ctx2.chart) ctx2.chart.destroy();    
            if (ctx3.chart) ctx3.chart.destroy();
            if (ctx4.chart) ctx4.chart.destroy();  

            // Utwórz nowy wykres
            ctx.chart = new Chart(ctx, {
                type: 'bar',
                data: data,
                options: {
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                },
            });
            ctx2.chart = new Chart(ctx2, {
                type: 'line',
                data: data2,
                options: {
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Chart.js Line Chart'
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                  
                },
            });
            ctx3.chart = new Chart(ctx3, {
                type: 'bar',
                data: data,
                options: {
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                },
            });
            ctx4.chart = new Chart(ctx4, {
                type: 'bar',
                data: data,
                options: {
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                },
            });
        }
    });
    return (
        <AuthenticatedLayout
            user = {auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Witaj! {auth.user.name}
                </h2>
            }
        >
            <Head title="Dashboard" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-4 gap-2">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h3 className="text-green-500 text-2xl font-semibold">
                        Wpływy w ciągu roku
                    </h3>
                    <p className="text-xl mt-4">
                        <span id='1' className="mr-2"></span>
                    </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h3 className="text-red-500 text-2xl font-semibold">
                        Wydatki w ciągu roku
                    </h3>
                    <p className="text-xl mt-4">
                        <span id='2' className="mr-2"></span>
                    </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h3 className="text-green-500 text-2xl font-semibold">
                        Wpływy w ciągu roku z inwestycji
                    </h3>
                    <p className="text-xl mt-4">
                        <span id='3' className="mr-2"></span>
                    </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h3 className="text-red-500 text-2xl font-semibold">
                        Wydatki w ciągu roku na inwestycje
                    </h3>
                    <p className="text-xl mt-4">
                        <span id='4' className="mr-2"></span>
                    </p>
                    </div>
                </div>
                </div>
            </div>
            <div className="py-12">
                <div className="mx-auto ml-100 max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 grid grid-cols-1 text-gray-900 dark:text-gray-100"> 
                        <div style={{ width: "700px", float: "left"}}>
                            <canvas id="myChart1"></canvas>
                        </div>
                        
                        <div style={{ width: "700px", float: "right"}}>
                            <canvas id="myChart2"></canvas>
                        </div>
                        <div style={{ width: "700px", float: "right"}}>
                            <canvas id="myChart3"></canvas>
                        </div>
                        <div style={{ width: "700px", float: "right"}}>
                            <canvas id="myChart4"></canvas>
                        </div>
                        </div>
                    </div>
                </div>
            </div>    
        </AuthenticatedLayout>
    );
}
