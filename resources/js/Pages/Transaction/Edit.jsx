import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function Create({auth, transaction}) {
    const {data, setData, post, errors, reset} = useForm({
        name: transaction.name || 'abc',
        description: transaction.description || '',
        type: transaction.type,
        amount: transaction.amount || '',
        category: transaction.category,
        _method: "PUT",
    })
    const onSubmit = (e) => {
        e.preventDefault();
        post(route("transaction.update", transaction.id));
      };
    
    return (
    <AuthenticatedLayout
    user = {auth.user}
        header={
            <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                <span>{auth.user.name} | </span>
                <span>Saldo: {auth.user.balance.toFixed(2)}</span>
                
            </h2>
            </div>
        }> 
        <Head title="Edytowanie transakcji" />

        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <form
                onSubmit={onSubmit}
                className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
                >
                    <div>
                    <InputLabel htmlFor="transaction_name" value="Name"/>
                    <TextInput
                        id="transaction_name"
                        className="block mt-1 w-full"
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        isFocused={true}
                    />
                    <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div>
                    <InputLabel htmlFor="transaction_description" value="Description"/>
                    <TextAreaInput
                        id="transaction_description"
                        className="block mt-1 w-full"
                        type="text"
                        name="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                    />
                    <InputError message={errors.description} className="mt-2" />
                    </div>
                    <div>
                    <InputLabel htmlFor="transaction_type" value="Type"/>
                    <SelectInput
                        name="type"
                        id="transaction_type"
                        className="block mt-1 w-full"
                        onChange={(e) => setData('type', e.target.value)}
                        
                    >
                        <option value="">Select type</option>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </SelectInput>
                    <InputError message={errors.type} className="mt-2" />
                    </div>
                    <div>
                    <InputLabel htmlFor="transaction_amount" value="Amount"/>
                    <TextInput
                        id="transaction_amount"
                        className="block mt-1 w-full"
                        type="text"
                        name="name"
                        value={data.amount}
                        onChange={(e) => setData('amount', e.target.value)}
                        isFocused={true}
                    />
                    <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div>
                    <InputLabel htmlFor="transaction_category" value="Category"/>
                    <SelectInput
                        name="category"
                        id="transaction_category"
                        className="block mt-1 w-full"
                        onChange={(e) => setData('category', e.target.value)}
                    >
                        <option value="">Select category</option>
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Home">Home</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Salary">Salary</option>
                        <option value="Investment">Investment</option>
                        <option value="Service">Service</option>
                        <option value="Education">Education</option>
                        <option value="Other">Other</option>

                    </SelectInput>
                    <InputError message={errors.type} className="mt-2" />
                    </div>
                    <div className="mt-4 text-right">
                        <Link
                        href={route("transaction.index")}
                        className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                        >
                        Cancel
                        </Link>
                        <button className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
                        Submit
                        </button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
    )
}