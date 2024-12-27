import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Create({auth}) {
    const {data, setData, post, errors, reset} = useForm({
        name: '',
        description: '',
        type: '',
        action: '',
        value: '',
        amount: '',
    })
    const onSubmit = (e) => {
        e.preventDefault()
        post(route('investment.store'))
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
            </div>
        }>
        <Head title="Tworzenie Inwestycji" />

        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <form
                onSubmit={onSubmit}
                className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
                >
                    <div>
                    <InputLabel htmlFor="investment_name" value="Name"/>
                    <TextInput
                        id="investment_name"
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
                    <InputLabel htmlFor="investment_description" value="Description"/>
                    {/* $table->enum('type', ['Stock', 'Bond', 'Futures', 'Precious Metals', 'Real Estate', 'Cryptocurrency','Other']);
                    $table->enum('action', ['Buy', 'Sell']); */}
                    <TextAreaInput
                        id="investment_description"
                        className="block mt-1 w-full"
                        type="text"
                        name="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                    />
                    <InputError message={errors.description} className="mt-2" />
                    </div>
                    <div>
                    <InputLabel htmlFor="investment_type" value="Type"/>
                    <SelectInput
                        name="type"
                        id="investment_type"
                        className="block mt-1 w-full"
                        onChange={(e) => setData('type', e.target.value)}
                    >
                        <option value="">Select category</option>
                        <option value="Stock">Stock</option>
                        <option value="Bond">Bond</option>
                        <option value="Futures">Futures</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Precious Metals">Precious Metals</option>
                        <option value="Cryptocurrency">Cryptocurrency</option>
                        <option value="Other">Other</option>
                    </SelectInput>
                    <InputError message={errors.type} className="mt-2" />
                    </div>
                    <div>
                    <InputLabel htmlFor="investment_action" value="Action"/>
                    <SelectInput
                        name="action"
                        id="investment_action"
                        className="block mt-1 w-full"
                        onChange={(e) => setData('action', e.target.value)}
                    >
                        <option value="">Select category</option>
                        <option value="Sell">Sell</option>
                        <option value="Buy">Buy</option>
                    </SelectInput>
                    <InputError message={errors.type} className="mt-2" />
                    </div>
                    <div>
                    <InputLabel htmlFor="investment_amount" value="Amount"/>
                    <TextInput
                        id="investment_amount"
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
                    <InputLabel htmlFor="investment_value" value="Value"/>
                    <TextInput
                        id="investment_value"
                        className="block mt-1 w-full"
                        type="text"
                        name="name"
                        value={data.value}
                        onChange={(e) => setData('value', e.target.value)}
                        isFocused={true}
                    />
                    <InputError message={errors.name} className="mt-2" />
                    </div>
                    
                    <div className="mt-4 text-right">
                        <Link
                        href={route("investment.index")}
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