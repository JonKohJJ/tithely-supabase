import { useState, useEffect } from "react"
import Select from 'react-select';
import supabase from "../../config/supabaseClient";
import { categoriesType } from "../../hooks/useFetchCategories";
import { referenceTypeType } from "../../hooks/useFetchTypes";
import { expenseMethodType } from "../../hooks/useFetchExpenseMethod";
import { TrackerTableDataType } from "../../pages/Tracker";
import SecondaryButton from "../Buttons/SecondaryButton";

const TrackerForm = (
    {
        method,
        setAddingUpdatingID,
        setIsAdding,
        updatingTransactionObject,
        quickCredit,
        setQuickCredit,
        quickDebit,
        setQuickDebit,
    }:
    {
        method: string;
        setAddingUpdatingID: React.Dispatch<React.SetStateAction<number | null>>;
        setIsAdding?: React.Dispatch<React.SetStateAction<boolean>>;
        updatingTransactionObject?: TrackerTableDataType;
        quickCredit?: boolean;
        setQuickCredit?: React.Dispatch<React.SetStateAction<boolean>>;
        quickDebit?: boolean;
        setQuickDebit?: React.Dispatch<React.SetStateAction<boolean>>;
    }
) => {

    // Initial Form Values
    const InitialTrackerFormValues = {
        transaction_date: '',
        transaction_type: 0,
        expense_method_id: null,
        transaction_category: 0,
        transaction_amount: 0,
        transaction_details: '',
        isClaimable: null,
    }

    // All States
    const [allTypes, setAllTypes] = useState<SelectDropDownType[]>([])                          // all types and format it for drop down options
    const [allExpenseMethods, setAllExpenseMethods] = useState<SelectDropDownType[]>([])        // all expense methods and format it for drop down options
    const [selectedType, setSelectedType] = useState<number | null>(null)                       // the id of the selected type
    const [selectedCategories, setSelectedCategories] = useState<SelectDropDownType[]>([])      // all respective categories of the type selected
    const [expenseTypeSelected, setExpenseTypeSelected] = useState(false)                       // When expense type is selected - display the expense method and isClaimable input to user

    const [formData, setFormData] = useState<TrackerFormDataType>(InitialTrackerFormValues)     // form states
    const [formError, setFormError] = useState<string | null>(null)                             // any form errors


    // Fetch all types and expense methods and format it to SelectDropDown type
    const fetchAllTypes = async () => {
        const { data:allTypes, error } = await supabase
            .from('reference_type')
            .select()

        if (error) {
            setAllTypes([])
            console.log(error)
        }
        if (allTypes) {
            const formattedTypes: SelectDropDownType[] = allTypes.map((type: referenceTypeType) => {
                return {'value': type.id, 'label': type.type_name}
            })
            setAllTypes(formattedTypes)
        }
    }
    const fetchAllExpenseMethods = async () => {
        const { data:allExpenseMethods, error } = await supabase
            .from('reference_expense_method')
            .select()

        if (error) {
            setAllExpenseMethods([])
            console.log(error)
        }
        if (allExpenseMethods) {
            const formattedTypes: SelectDropDownType[] = allExpenseMethods.map((method: expenseMethodType) => {
                return {'value': method.id, 'label': method.expense_method}
            })
            setAllExpenseMethods(formattedTypes)
        }
    }
    useEffect(() => {
        fetchAllTypes()
        fetchAllExpenseMethods()
    }, [])

    // Fetch categories dynamically based on the selected transaction type
    const fetchCategoriesBasedOnTypeID = async (type_id: number) => {
        const { data:categories, error } = await supabase
            .from('categories')
            .select()
            .eq('category_type', type_id)
            .order('id', { ascending: true })

        if (error) {
            setSelectedCategories([])
            console.log(error)
        }
        if (categories) {
            const formattedCategories: SelectDropDownType[] = categories.map((cat: categoriesType) => {
                return {'value': cat.id, 'label': cat.category_name}
            })
            setSelectedCategories(formattedCategories)
        }
    }
    useEffect(() => {
        if (selectedType) {
            setExpenseTypeSelected(false)
            fetchCategoriesBasedOnTypeID(selectedType)

            // Reset form data when 'income' and 'savings' are selected
            setFormData({
                ...formData,
                'transaction_category': 0,
                'expense_method_id': null,
                'isClaimable': null,
            });

            // When 'expenses' is choosen
            const value = getExpensesTypeID(allTypes)
            if ( selectedType === value ) {
                setExpenseTypeSelected(true)
                setFormData({ ...formData, isClaimable: false })
            }
        }
    }, [selectedType])


    // Set updating transaction object
    useEffect(() => {
        if (method === 'Updating' && updatingTransactionObject !== undefined) {
            const formatted = formatUpdatingTransaction(updatingTransactionObject)
            
            // When 'expenses' is choosen to be updated - 
            if ( allTypes.length !== 0 ) {
                const value = getExpensesTypeID(allTypes)
                if (formatted.transaction_type === value) {
                    setExpenseTypeSelected(true)
                }
            }
            fetchCategoriesBasedOnTypeID(formatted.transaction_type)
            setFormData(formatted)
        }
    }, [allTypes])


    // Form Actions
    const handleChange = (selectedOption: any, fieldName: string) => {

        if (fieldName === 'transaction_type') {
            setSelectedType(selectedOption)
        }

        setFormData({
            ...formData,
            [fieldName]: selectedOption,
        })

    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if ( 
            formData.transaction_date === '' ||
            formData.transaction_type === 0 ||
            formData.transaction_category === 0 ||
            formData.transaction_amount === 0 ||
            formData.transaction_details === ''
        ) {
            setFormError('Missing Fields!')
            return
        }

        // Dynamically get expense type id
        const value = getExpensesTypeID(allTypes)
        if ( formData.transaction_type === value ) {
            if (formData.expense_method_id === null || formData.isClaimable === null) {
                setFormError('`Expenses Method` / `Claimables` Missing Fields!')
                console.log(formData)
                return
            }
        }

        if (method === 'Adding') {
            const { data, error } = await supabase
                .from('transactions')
                .insert(formData)
                .select()

            if (error !== null) {
                setFormError('Error Adding New Transaction!')
                return
            }

            // Reset form data and error state
            if (data !== null) {
                setFormData(InitialTrackerFormValues);
                setFormError(null);
                setIsAdding && setIsAdding(false);
            }

        }

        if (method === 'Updating') {

            const { data, error } = await supabase
                .from('transactions')
                .update([formData])
                .eq('id', updatingTransactionObject?.id)
                .select()

            if (error !== null) {
                setFormError('Error Updating Transaction!')
                return
            }

            // Reset form data and error state
            if (data !== null) {
                setFormData(InitialTrackerFormValues);
                setFormError(null);
                setAddingUpdatingID(null);
            }

        }

    }
    const handleClose = () => {
        setAddingUpdatingID(null)
        if ( setIsAdding !== undefined) {
            setIsAdding(false)
        }
        if ( setQuickCredit !== undefined) {
            setQuickCredit(false)
        }
        if ( setQuickDebit !== undefined) {
            setQuickDebit(false)
        }
    }

    // handle form values if its quickCredit or quickDebit
    useEffect(() => {
        if (allTypes.length > 0 && allExpenseMethods.length > 0 && method === 'Adding') {

            if (!quickCredit && !quickDebit) {
                setExpenseTypeSelected(false)
                setSelectedCategories([])
                setFormData({
                    ...formData,
                    transaction_type: 0,
                    expense_method_id: null,
                    isClaimable: null,
                })
            }

            if (quickCredit) {
                setExpenseTypeSelected(true)
                fetchCategoriesBasedOnTypeID(getExpensesTypeID(allTypes))
                setFormData({
                    ...formData,
                    transaction_type: getExpensesTypeID(allTypes),
                    expense_method_id: getCreditExpenseMethodID(allExpenseMethods),
                    isClaimable: false,
                })
            }

            if (quickDebit) {
                setExpenseTypeSelected(true)
                fetchCategoriesBasedOnTypeID(getExpensesTypeID(allTypes))
                setFormData({
                    ...formData,
                    transaction_type: getExpensesTypeID(allTypes),
                    expense_method_id: getDebitExpenseMethodID(allExpenseMethods),
                    isClaimable: false,
                })
            }
        }
    }, [quickCredit, quickDebit, allTypes])

    
    return (
        <div className="tracker-form-div bg-color-background rounded p-[20px] my-4">
            <form className="tracker-form flex" onSubmit={handleSubmit}>
                <div className="w-[12%] flex items-start pr-2">
                    <input
                        type="date"
                        id="transaction_date"
                        name="transaction_date"
                        value={formData.transaction_date}
                        onChange={(e) => handleChange(e.target.value, 'transaction_date')}
                        className="bg-transparent py-2 border-b-[1px] border-color-border focus:outline-none"
                    />
                </div>
                <div className="w-[16%] flex flex-col gap-2 pr-2">
                    <Select
                        id="transaction_type"
                        name="transaction_type"
                        value={allTypes.filter((type) => {return type.value === formData.transaction_type})}
                        onChange={(selectedOption: any) => handleChange(selectedOption.value, 'transaction_type')}
                        options={allTypes}
                        className="react-select-dropdown"
                    />
                    {expenseTypeSelected && 
                        <Select
                            id="expense_method_id"
                            name="expense_method_id"
                            value={allExpenseMethods.filter((method) => {return method.value === formData.expense_method_id})}
                            onChange={(selectedOption: any) => handleChange(selectedOption.value, 'expense_method_id')}
                            options={allExpenseMethods}
                            className="react-select-dropdown"
                        />
                    }
                </div>
                <div className="w-[24%] flex flex-col pr-2">
                    <Select
                        id="transaction_category"
                        name="transaction_category"
                        value={selectedCategories.filter((cat) => {return cat.value === formData.transaction_category})}
                        onChange={(selectedOption: any) => handleChange(selectedOption.value, 'transaction_category')}
                        options={selectedCategories}
                        className="react-select-dropdown"
                    />
                </div>
                <div className="w-[8%] flex flex-col pr-2">
                    <input
                        type="number"
                        id="transaction_amount"
                        name="transaction_amount"
                        value={formData.transaction_amount}
                        onChange={(e) => handleChange(Number(e.target.value), 'transaction_amount')}
                        className="bg-transparent py-2 border-b-[1px] border-color-border focus:outline-none"
                    />
                </div>
                <div className="w-[27%] flex flex-col gap-2 pr-4">
                    <input
                        id="transaction_details"
                        name="transaction_details"
                        value={formData.transaction_details}
                        onChange={(e) => handleChange(e.target.value, 'transaction_details')}
                        className="bg-transparent py-2 border-b-[1px] border-color-border focus:outline-none"
                        placeholder="Enter Transaction Details"
                    />
                    {expenseTypeSelected &&
                        <div>
                            <input
                                type="checkbox"
                                id="isClaimable"
                                name="isClaimable"
                                checked={formData.isClaimable || false}
                                onChange={(e) => handleChange(e.target.checked, 'isClaimable')}
                            />
                            <label htmlFor="isClaimable" className="ml-2">Is Claimable</label>
                        </div>
                    }
                </div>
                <div className="w-[13%] flex items-start justify-center">
                    <button type="submit" className='
                        inline-block
                        px-[16px]
                        py-[8px]
                        bg-color-icon-fill
                        text-white
                        border-solid
                        border-[1px]
                        border-color-icon-fill
                        rounded
                        text-center
                        mr-2
                    '>
                        {method === 'Adding' ? 'Add' : 'Update'}
                    </button>
                    <SecondaryButton text='Close' onClickFunction={handleClose}/>
                </div>
            </form>
            {formError && <p className="mt-2 flex justify-end">{formError}</p>}
        </div>
    )
}

export default TrackerForm

type TrackerFormDataType = {
    transaction_date: string;
    transaction_type: number;
    expense_method_id: number | null;
    transaction_category: number;
    transaction_amount: number;
    transaction_details: string;
    isClaimable: boolean | null;
}

type SelectDropDownType = {
    value: number;
    label: string;
}

const getExpensesTypeID = (allTypes: SelectDropDownType[]) => {
    const expenseTypeID = allTypes.filter(type => {return type.label === 'Expenses'})
    const [{ value }] = expenseTypeID;
    return value
}
const getCreditExpenseMethodID = (allExpenseMethods: SelectDropDownType[]) => {
    const creditExpenseMethodID = allExpenseMethods.filter(method => {return method.label === 'Credit'})
    const [{ value }] = creditExpenseMethodID;
    return value
}
const getDebitExpenseMethodID = (allExpenseMethods: SelectDropDownType[]) => {
    const debitExpenseMethodID = allExpenseMethods.filter(method => {return method.label === 'Debit'})
    const [{ value }] = debitExpenseMethodID;
    return value
}

const formatUpdatingTransaction = (updatingTransactionObject: TrackerTableDataType) => {

    // Format date
    const dateObject = new Date(updatingTransactionObject.date)
    const dateObject_Year = dateObject.getFullYear()
    const dateObject_Month = ("0" + (dateObject.getMonth() + 1).toString()).slice(-2)
    const dateObject_Date = ("0" + (dateObject.getDate()).toString()).slice(-2)
    const formatedDate = dateObject_Year + "-" + dateObject_Month + "-" + dateObject_Date

    return {
        transaction_date: formatedDate,
        transaction_type: updatingTransactionObject.type_id,
        expense_method_id: updatingTransactionObject.expense_method_id,
        transaction_category: updatingTransactionObject.category_id,
        transaction_amount: updatingTransactionObject.amount,
        transaction_details: updatingTransactionObject.details,
        isClaimable: updatingTransactionObject.isClaimable,
    }
}