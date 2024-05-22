import supabase from '../../config/supabaseClient'
import { useLocation } from "react-router-dom"
import PrimaryButton from "../Buttons/PrimaryButton"
import PlannerForm from '../Forms/PlannerForm'
import { useState } from 'react'
import { HeaderFiltersType, TrackerTableDataType } from '../../pages/Tracker'
import TrackerForm from '../Forms/TrackerForm'
import { DashboardTableDataType } from '../../pages/Dashboard'
import { PlannerTableDataType } from '../../pages/Planner'
import { FiEdit, FiTrash } from "react-icons/fi";
import SecondaryButton from '../Buttons/SecondaryButton'
import { BsUnlock, BsLockFill } from "react-icons/bs";
import { HiMiniReceiptRefund } from "react-icons/hi2";
import { MdRestartAlt } from "react-icons/md";

const Table = ({ 
    data, 
    AddingUpdatingID,
    setAddingUpdatingID,
    showActual,
    setShowActual,
    headerFilters,
    setHeaderFilters,
} : { 
    data: PlannerTableDataType | TrackerTableDataType[] | DashboardTableDataType;
    AddingUpdatingID?: number | null;
    setAddingUpdatingID?: React.Dispatch<React.SetStateAction<number | null>>;
    showActual?: boolean;
    setShowActual?: React.Dispatch<React.SetStateAction<boolean>>;
    headerFilters?: HeaderFiltersType;
    setHeaderFilters?: React.Dispatch<React.SetStateAction<HeaderFiltersType>>;
}) => {

    // Type Assertions
    const plannerData = data as PlannerTableDataType
    const trackerData = data as TrackerTableDataType[]
    const dashboardData = data as DashboardTableDataType

    const { pathname } = useLocation()
    
    const [deleteID, setDeleteID] = useState<number | null>(null)
    const [NChildTransactions, setNChildTransactions] = useState<number>(0)
    let TABLE = ''
    if (pathname === '/planner') { TABLE = 'categories' }
    if (pathname === '/tracker') { TABLE = 'transactions' }
  
    // Generic Necessary Delete Logic
    const handleDelete = async (id: number) => {
        await supabase
          .from(TABLE)
          .delete()
          .eq('id', id)
    }

    // Planner Necessary CRUD Logic
    const onDelete = async (id: number) => {
        setAddingUpdatingID && setAddingUpdatingID(null)
        setDeleteID(id); 
        const { count, error } = await fetchNChildTransactions(id)
        if ( count !== null ) {
            setNChildTransactions(count)
        }
        
        if (error !== null) {
            console.log(error)
        }
    }
    const handleFixedExpenseChange = async (id: number, fixed_expense_status: boolean | undefined) => {

        if (fixed_expense_status !== undefined) {
            const { error } = await supabase
                .from('categories')
                .update({ fixed_expense: !fixed_expense_status })
                .eq('id', id)

            if (error !== null) {
                console.log('Error Updating Category!')
                return
            }
        }
        

    }

    // Tracker Necessary CRUD Logic
    const [isAdding, setIsAdding] = useState<boolean>(false)
    const [quickCredit, setQuickCredit] = useState<boolean>(false)
    const [quickDebit, setQuickDebit] = useState<boolean>(false)

    return (
        
        <table className={`table-component ${pathname.slice(1)} w-full mb-4 border-solid border-[1px] border-color-border bg-color-card-background rounded block`}>
            {(pathname === '/planner') &&
                <>
                    <thead className={`table-header block px-[20px]`}>
                        <tr className={`flex justify-between items-center py-[20px]`}> 
                            <td><p className="fs-h3 font-medium">{plannerData.type}</p></td>
                            <td className={`hidden laptop:block`}>
                                <PrimaryButton 
                                    text='Add Category' 
                                    onClickFunction={() => { setAddingUpdatingID && setAddingUpdatingID(plannerData.type_id); setDeleteID(null) }}
                                />
                            </td>
                        </tr>
                        <tr className={`flex fs-caption text-color-text-faded mb-4`}>
                            <td className={`w-[75%]`}>Categories</td>
                            <td className={`w-[25%] text-right laptop:w-[15%] laptop:text-left`}>Budget</td>
                            <td className={`hidden laptop:block laptop:w-[9%] laptop:text-right`}>Actions</td>
                        </tr>
                    </thead>
                    <tbody className={`table-body block px-[20px]`}>
                        {plannerData.categories.length !== 0?
                            (
                                plannerData.categories.map(cat => {
                                    return (
                                        (AddingUpdatingID === cat.id && setAddingUpdatingID) ?
                                            <tr key={cat.id} className='block'>
                                                <PlannerForm type={plannerData.type} type_id={plannerData.type_id} method='Updating' setAddingUpdatingID={setAddingUpdatingID} updating_cat_id={cat.id} updating_cat_name={cat.category_name} updating_cat_budget={cat.category_budget}/>
                                            </tr>
                                        :
                                            deleteID === cat.id ?
                                                <tr key={cat.id} className='w-full block my-4'>
                                                    <div className='w-full bg-red-600 p-[20px] rounded flex justify-between items-center'>
                                                        <div>
                                                            <p className='font-bold !text-white'>Deleting '{cat.category_name}'' from {plannerData.type}. Are you sure?</p>
                                                            <p className='font-medium !text-white'>You will also delete {NChildTransactions === 1 ? `${NChildTransactions} transaction` : `${NChildTransactions} transactions`} under this category.</p>
                                                        </div>
                                                        <div>
                                                            <PrimaryButton text='Yes, Delete' onClickFunction={() => { handleDelete(cat.id) }} additionalClasses='mr-2'/>
                                                            <SecondaryButton text='Back' onClickFunction={() => { setDeleteID(null) }}/>
                                                        </div>
                                                    </div>
                                                </tr>
                                            :
                                                <tr key={cat.id} className={`border-solid border-color-border border-b-[1px] py-[10px] flex items-center`}>
                                                    <td className={`w-[75%] laptop:flex laptop:items-center`}>
                                                        {plannerData.type === 'Expenses' ?
                                                            <span onClick={() => {handleFixedExpenseChange(cat.id, cat.fixed_expense)}} className='hidden cursor-pointer laptop:block laptop:mr-2'>
                                                                {
                                                                    (cat.fixed_expense !== undefined && cat.fixed_expense) ?
                                                                    <BsLockFill />
                                                                    :
                                                                    <BsUnlock />
                                                                }
                                                            </span>
                                                        :
                                                            ''
                                                        }
                                                        <p className='line-clamp-1'>{cat.category_name}</p>
                                                    </td> 
                                                    <td className={`w-[25%] text-right laptop:w-[15%] laptop:text-left`}>${cat.category_budget}</td>
                                                    <td className={`hidden laptop:block laptop:w-[9%] laptop:text-right`}>
                                                        <button onClick={() => { setAddingUpdatingID && setAddingUpdatingID(cat.id); setDeleteID(null) }} className='p-2'><FiEdit className='w-5 h-5 hover:fill-color-icon-fill' /></button>
                                                        <button onClick={() => { onDelete(cat.id) }} className='p-2 pr-0'><FiTrash className='w-5 h-5 hover:fill-color-icon-fill' /></button>
                                                    </td>
                                                </tr>
                                    )
                                })
                            )
                            :
                            <tr><td><p>No Categories Found</p></td></tr>
                        }
                        {(AddingUpdatingID === plannerData.type_id && setAddingUpdatingID) &&
                            <PlannerForm type={plannerData.type} type_id={plannerData.type_id} method='Adding' setAddingUpdatingID={setAddingUpdatingID}/>
                        }
                    </tbody>
                    <tfoot className={`table-footer block px-[20px]`}> 
                        <tr className='flex items-center py-[20px] font-medium'>
                            <td className={`w-[50%] laptop:w-[75%]`}>Total</td>
                            <td className={`w-[50%] text-right laptop:w-[15%] laptop:text-left`}>
                                <span>
                                    <p>${plannerData.total}</p>
                                    <p className='fs-caption'>{plannerData.footerDescription}</p>
                                </span>
                            </td>
                        </tr>
                    </tfoot>
                </>
            }


            {( pathname === '/tracker') &&
                <>
                    <thead className='table-header block px-[20px]'>
                        <tr className='flex justify-between items-center py-[20px]'>
                            <td><p className="fs-h3 font-medium">Transactions</p></td>
                            <td className='hidden laptop:flex gap-2'>
                                {isAdding && 
                                    <>
                                        <SecondaryButton 
                                            text='Add Credit' 
                                            onClickFunction={() => {setQuickCredit(true); setQuickDebit(false);}}
                                        />
                                        <SecondaryButton 
                                            text='Add Debit' 
                                            onClickFunction={() => {setQuickDebit(true); setQuickCredit(false);}}
                                        />
                                    </>
                                }

                                <PrimaryButton 
                                    text='Add Transaction' 
                                    onClickFunction={() => {setIsAdding(true); setAddingUpdatingID && setAddingUpdatingID(null); setQuickCredit(false); setQuickDebit(false); }}
                                />
                            </td>
                        </tr>
                        <tr className='flex fs-caption text-color-text-faded mb-2'>
                            <td className={`w-[30%] laptop:w-[13%]`}>Date</td>
                            <td className={`hidden laptop:block laptop:w-[8%]`}>Type</td>
                            <td className={`hidden laptop:block laptop:w-[8%]`}>Method</td>
                            <td className={`w-[50%] laptop:w-[26%]`}>Category</td>
                            <td className={`w-[20%] text-right laptop:w-[8%] laptop:text-left`}>Amount</td>
                            <td className={`hidden laptop:block laptop:w-[32%]`}>Details</td>
                            <td className={`hidden laptop:block laptop:w-[5%] laptop:text-right`}>Actions</td>
                        </tr>
                        <tr className='laptop:flex fs-caption mb-4 hidden text-color-text-faded'>
                            <td className={`w-[30%] laptop:w-[13%]`}></td>
                            <td className={`hidden laptop:flex laptop:items-center laptop:w-[8%] hover:cursor-pointer hover:text-color-text`} 
                                onClick={() => { 
                                    if (setHeaderFilters) {
                                        setHeaderFilters(prevState => ({
                                            ...prevState,
                                            filtered_type: (headerFilters?.filtered_type === '' ? 'Income' : (headerFilters?.filtered_type === 'Income' ? 'Savings' : (headerFilters?.filtered_type === 'Savings' ? 'Expenses' : '')))
                                        }))
                                    }
                                }}
                            >
                                    {headerFilters?.filtered_type === '' && 'All'}
                                    {headerFilters?.filtered_type === 'Income' && 'Income'}
                                    {headerFilters?.filtered_type === 'Savings' && 'Savings'}
                                    {headerFilters?.filtered_type === 'Expenses' && 'Expenses'}
                                    <MdRestartAlt className='ml-[2px]' />
                            </td>
                            <td className={`hidden laptop:flex laptop:items-center laptop:w-[8%] hover:cursor-pointer hover:text-color-text`}
                                onClick={() => {
                                    if (setHeaderFilters) {
                                        setHeaderFilters(prevState => ({
                                            ...prevState,
                                            filtered_method: (headerFilters?.filtered_method === '' ? 'Credit' : (headerFilters?.filtered_method === 'Credit' ? 'Debit' : ''))
                                        }))
                                    }
                                }}
                            >
                                    {headerFilters?.filtered_method === '' && 'All'}
                                    {headerFilters?.filtered_method === 'Credit' && 'Credit'}
                                    {headerFilters?.filtered_method === 'Debit' && 'Debit'}
                                    <MdRestartAlt className='ml-[2px]' />
                            </td>
                            <td className={`w-[50%] laptop:w-[26%]`}></td>
                            <td className={`w-[20%] text-right laptop:w-[8%] laptop:text-left`}></td>
                            <td className={`hidden laptop:flex laptop:w-[32%]`}>
                                <input
                                    type="checkbox"
                                    id="filtered_isClaimable"
                                    name="isClaimable"
                                    checked={headerFilters?.filtered_show_claimables}
                                    onChange={() => { 
                                        if (setHeaderFilters) {
                                            setHeaderFilters(prevState => ({
                                                ...prevState,
                                                filtered_show_claimables: !prevState.filtered_show_claimables
                                            }))
                                        }
                                    }}
                                    className='hover:cursor-pointer'
                                />
                                <p className='ml-1'>Show Claimables</p>
                            </td>
                            <td className={`hidden laptop:block laptop:w-[5%] laptop:text-right`}></td>
                        </tr>
                    </thead>
                    <tbody className='table-body block px-[20px] pb-[20px]'>
                            <>
                                {(isAdding && setAddingUpdatingID) ? 
                                    <TrackerForm method={'Adding'} setAddingUpdatingID={setAddingUpdatingID} setIsAdding={setIsAdding} quickCredit={quickCredit} quickDebit={quickDebit} />
                                    :
                                    <></>
                                }

                                {( trackerData.length !== 0 ) ? 
                                    trackerData.map((trans: TrackerTableDataType) => {
                                        if (trans.id === AddingUpdatingID) {
                                            if (setAddingUpdatingID) {
                                                return (
                                                    <div key={trans.id}>
                                                        <TrackerForm method={'Updating'} setAddingUpdatingID={setAddingUpdatingID} updatingTransactionObject={trans}/>
                                                    </div>
                                                )
                                            }
                                        } 
                                        else {
                                            return (
                                                <tr key={trans.id} className='border-solid border-color-border border-b-[1px] last:border-b-[0] py-[5px] flex items-center'>

                                                    <td className={`w-[30%] laptop:w-[13%]`}>
                                                        <p className='line-clamp-1 pr-2 '>{trans.date}</p>
                                                    </td>

                                                    <td className={`hidden laptop:block laptop:w-[8%]`}>
                                                        <p className='pr-2 line-clamp-1'>{trans.type}</p>
                                                    </td>

                                                    <td className={`hidden laptop:block laptop:w-[8%]`}>
                                                        {trans.expense_method ? 
                                                            <p className='pr-2 line-clamp-1'>{trans.expense_method}</p> 
                                                            : 
                                                            <p className='pr-2 line-clamp-1 text-color-text-faded'>-</p>}
                                                    </td>

                                                    <td className={`w-[50%] laptop:w-[26%]`}>
                                                        <p className='line-clamp-1 pr-2 '>{trans.category}</p>
                                                    </td>

                                                    <td className={`w-[20%] text-right laptop:text-left laptop:w-[8%]`}>
                                                        <p className='line-clamp-1'>${trans.amount}</p>
                                                    </td>

                                                    <td className={`hidden laptop:block laptop:w-[32%]`}>
                                                        {trans.isClaimable ? 
                                                            <div className='flex items-center gap-2'>
                                                                <HiMiniReceiptRefund />
                                                                <p className='pr-2 line-clamp-1'>{trans.details}</p>
                                                            </div>
                                                            : 
                                                            <p className='pr-2 line-clamp-1'>{trans.details}</p>
                                                        }
                                                    </td>

                                                    <td className={`hidden laptop:flex laptop:justify-end laptop:w-[5%]`}>
                                                        <button onClick={() => {setAddingUpdatingID && setAddingUpdatingID(trans.id); setIsAdding(false);}} className='p-2'><FiEdit className='w-5 h-5 hover:fill-color-icon-fill' /></button>
                                                        <button onClick={() => {handleDelete(trans.id)}} className='p-2 pr-0'><FiTrash className='w-5 h-5 hover:fill-color-icon-fill' /></button>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    })
                                    : 
                                    <tr><td>No Transactions Found</td></tr>
                                }
                            </>
                    </tbody>
                </>
            }


            {( pathname === '/dashboard') &&
                <>
                    <thead className='table-header block px-[20px]'>
                        <tr className='flex justify-between items-center py-[20px]'>
                            <td><p className="fs-h3">{dashboardData.type}</p></td>
                            {dashboardData.type === 'Expenses' &&
                                <td className='hidden laptop:flex gap-[5px]'>
                                    <input 
                                        type="checkbox"
                                        checked={showActual}
                                        onChange={() => {setShowActual && setShowActual(!showActual)}}
                                    />
                                    <p className='fs-caption'>Show Actual Expenses</p>
                                </td>
                            }
                        </tr>
                        <tr className='flex fs-caption text-color-text-faded mb-4'>
                            <td className='w-[50%] laptop:w-[25%]'>Category</td>
                            <td className={`hidden laptop:block laptop:w-[9%]`}>Tracked</td>
                            <td className={`hidden laptop:block laptop:w-[9%]`}>Budget</td>
                            <td className='w-[50%] text-center laptop:w-[39%]'>% Completed</td>
                            <td className={`hidden laptop:block laptop:w-[9%] laptop:text-right`}>Remaining</td>
                            <td className={`hidden laptop:block laptop:w-[9%] laptop:text-right`}>Excess</td>
                        </tr>
                    </thead>
                    <tbody className='table-body block px-[20px] pb-[20px]'>
                        {dashboardData.categories.length !== 0 ?
                            (
                                dashboardData.categories.map(cat => {
                                    if ( cat !== undefined ) {
                                        return (
                                            <tr key={cat.category_name} className='border-solid border-color-border border-b-[1px] py-[15px] flex items-center'>
                                                <td className='w-[50%] laptop:w-[25%] pr-4'><p className='pr-2 line-clamp-1'>{cat.category_name}</p></td>
                                                <td className={`hidden laptop:block laptop:w-[9%]`}>${cat.tracked}</td>
                                                <td className={`hidden laptop:block laptop:w-[9%]`}>${cat.budget}</td>
                                                <td className='w-[50%] laptop:w-[39%] text-center relative overflow-hidden rounded-xl bg-color-border'>
                                                    <div style={{width: `${cat.percentage_completed}%`}} 
                                                        className={`progress absolute top-0 left-0 h-full ${cat.percentage_completed > 100 ? (dashboardData.type === 'Expenses' ? 'bg-color-icon-fill-red' : 'bg-color-icon-fill') : 'bg-color-icon-fill' }`}
                                                    >
                                                    </div>
                                                    <p className='fs-caption text-white relative !text-[8px]'>{cat.percentage_completed}%</p>
                                                </td>
                                                <td className={`hidden laptop:block laptop:w-[9%] laptop:text-right`}>${cat.remaining}</td>
                                                <td className={`hidden laptop:block laptop:w-[9%] laptop:text-right`}>${cat.excess}</td>
                                            </tr>
                                        )
                                    }
                                })
                            )
                            :
                            <tr><td><p>No Categories Found</p></td></tr>
                        }   
                    </tbody>
                    <tfoot className='table-footer block px-[20px]'> 
                        <tr className='flex items-center py-[20px] font-medium'>
                            <td className={`w-[50%] laptop:w-[25%]`}>Total</td>
                            <td className={`hidden laptop:block laptop:w-[9%]`}>${dashboardData.footerTotals.trackedTotals}</td>
                            <td className={`hidden laptop:block laptop:w-[9%]`}>${dashboardData.footerTotals.budgetTotals}</td>
                            <td className='w-[50%] laptop:w-[39%] relative overflow-hidden rounded-xl bg-color-border'> 
                                <div style={{width: `${dashboardData.footerTotals.percentageCompletedTotals}%`}} 
                                    className={`progress absolute top-0 left-0 h-full ${dashboardData.footerTotals.percentageCompletedTotals > 100 ? (dashboardData.type === 'Expenses' ? 'bg-color-icon-fill-red' : 'bg-color-icon-fill') : 'bg-color-icon-fill' }`}
                                >
                                </div>
                                <p className='fs-caption relative text-center text-white !text-[8px]'>{dashboardData.footerTotals.percentageCompletedTotals}%</p>
                            </td>
                            <td className={`hidden laptop:block laptop:w-[9%] laptop:text-right`}>${dashboardData.footerTotals.remainingTotals}</td>
                            <td className={`hidden laptop:block laptop:w-[9%] laptop:text-right`}>${dashboardData.footerTotals.excessTotals}</td>
                        </tr>
                    </tfoot>
                      
                </>
            }
        </table>
        
    )
}

export default Table

const fetchNChildTransactions = async (cat_id: number) => {
    const { count, error } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('transaction_category', cat_id)
    return { count, error }
}

