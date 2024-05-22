import { TransactionType, useFetchTransactions } from "../hooks/useFetchTransactions"
import Table from "../components/Table/Table"
import { useEffect, useState } from "react"
import { referenceTypeType } from "../hooks/useFetchTypes"
import { categoriesType } from "../hooks/useFetchCategories"
import { expenseMethodType, useFetchExpenseMethod } from "../hooks/useFetchExpenseMethod"
import YearMonthFilter from "../components/Filters/YearMonthFilter"
import InsightCards, { CardType } from "../components/InsightCards/InsightCards"

const Tracker = ({
    types, 
    fetchTypesError,
    categories,
    fetchCategoriesError,
    filteredYear,
    setFilteredYear,
    filteredMonth,
    setFilteredMonth,
}:
{
    types: referenceTypeType[] | null;
    fetchTypesError: string | null;
    categories: categoriesType[] | null;
    fetchCategoriesError: string | null;
    filteredYear: number;
    setFilteredYear: React.Dispatch<React.SetStateAction<number>>;
    filteredMonth: number;
    setFilteredMonth:React.Dispatch<React.SetStateAction<number>>;
}) => {

    const [headerFilters, setHeaderFilters] = useState<HeaderFiltersType>(
      {
        filtered_type: '',
        filtered_method: '',
        filtered_show_claimables: false,
      }
    )

    // TODO: Quick Add Credit/Debit Expense feature?

    const { expenseMethods, fetchExpenseMethodError } = useFetchExpenseMethod()
    const { transactions, fetchTransactionsError } = useFetchTransactions(filteredMonth, filteredYear, getLastDayOfMonth(filteredYear, filteredMonth))

    const [cardsData, setCardsData] = useState<CardType[] | null>(null)
    const [tableData, setTableData] = useState<TrackerTableDataType[] | null>(null)

    const [AddingUpdatingID, setAddingUpdatingID] = useState<number | null>(null)

    // Middleware - Generate Table Data & Cards Data
    useEffect(() => {
      // console.log('Inside Use Effect!', transactions)
      if (types && expenseMethods && categories && transactions) {

          const allTransactionDates = getAllTransactionDates(transactions)
          setTableData(generateTableData(transactions, types, expenseMethods, categories, setCardsData, allTransactionDates, headerFilters))
          
      }
    }, [types, categories, transactions, expenseMethods, headerFilters])


    return (
      <div className="tracker flex justify-center w-full">

        <div className="mycontainer">
          
          <div className="page-header flex justify-between items-center">
              <div>
                <p className="fs-h2 mb-2">My Tracker</p>
                <p className="h3">List All Your Transactions Here</p>
              </div>
              <YearMonthFilter filteredYear={filteredYear} setFilteredYear={setFilteredYear} filteredMonth={filteredMonth} setFilteredMonth={setFilteredMonth}/>
          </div>


          {fetchTypesError && <p>{fetchTypesError}</p>}
          {fetchExpenseMethodError && <p>{fetchExpenseMethodError}</p>}
          {fetchCategoriesError && <p>{fetchCategoriesError}</p>}
          {fetchTransactionsError && <p>{fetchTransactionsError}</p>}

          <InsightCards cardsData={cardsData} />
          {tableData !== null && 
              <Table 
                  data={tableData}
                  AddingUpdatingID={AddingUpdatingID} 
                  setAddingUpdatingID={setAddingUpdatingID}
                  headerFilters={headerFilters} 
                  setHeaderFilters={setHeaderFilters}
              />
          }

        </div>

      </div>
    )
}

export default Tracker

export type TrackerTableDataType = {
  id: number;
  date: string;
  type: string;
  type_id: number;
  expense_method: string;
  expense_method_id: number;
  category: string;
  category_id: number;
  amount: number;
  details: string;
  isClaimable: boolean;
}
export type HeaderFiltersType = {
  filtered_type: string;
  filtered_method: string;
  filtered_show_claimables: boolean;
}

const getLastDayOfMonth = (filteredYear: number, filteredMonth: number): number => {
  const year = filteredYear;
  const month = filteredMonth;
  const lastDayOfMonth = new Date(year, month, 0);
  return lastDayOfMonth.getDate();
}
const getAllTransactionDates = (transactions: TransactionType[]) => {
    const allTransactionDates = transactions.map(trans => {
      return trans.transaction_date
    })
    return allTransactionDates
}
const generateTableData = (
  transactions: TransactionType[],
  types: referenceTypeType[],
  expenseMethods: expenseMethodType[],
  categories: categoriesType[],
  setCardsData: React.Dispatch<React.SetStateAction<CardType[] | null>>,
  allTransactionDates: string[],
  headerFilters: HeaderFiltersType,
) => {

  // console.log('Inside generateTableData!', transactions)
  let totalClaims = 0
  
  let result = transactions
    .map(trans => {
      if (trans.isClaimable === true) {
          totalClaims = totalClaims + trans.transaction_amount
      }
      return {
        "id": trans.id,
        "date": new Date(trans.transaction_date).toDateString(),
        "type": getTypeNameFromID(types, trans.transaction_type),
        "type_id": trans.transaction_type,
        "expense_method": getExpenseMethodNameFromID(expenseMethods, trans.expense_method_id),
        "expense_method_id": trans.expense_method_id,
        "category": getCategoryNameFromID(categories, trans.transaction_category),
        "category_id": trans.transaction_category,
        "amount": trans.transaction_amount,
        "details": trans.transaction_details,
        "isClaimable": trans.isClaimable,
      }
    })
    .filter(trans => {
      if (headerFilters.filtered_type === '') {
        return trans
      }
      return trans.type === headerFilters.filtered_type
    })
    .filter(trans => {
      if (headerFilters.filtered_method === '') {
        return trans
      }
      return trans.expense_method === headerFilters.filtered_method
    })
    .filter(trans => {
      if (headerFilters.filtered_show_claimables === false) {
        return trans
      }
      return trans.isClaimable === headerFilters.filtered_show_claimables
    })

  setCardsData(generateCardsData(totalClaims, allTransactionDates))

  return result
}
const getTypeNameFromID = (types: referenceTypeType[], id: number) => {
    const result = types
      .filter(type => {
        return id === type.id
      }) 
      .map(type => {
          return type.type_name
      })
    return result[0]
}
const getExpenseMethodNameFromID = (expenseMethods: expenseMethodType[], id: number) => {
  const result = expenseMethods
    .filter(expenseMethod => {
      return id === expenseMethod.id
    }) 
    .map(expenseMethod => {
        return expenseMethod.expense_method
    })
  return result[0]
}
const getCategoryNameFromID = (categories: categoriesType[], id: number) => {
  const result = categories
    .filter(cat => {
      return id === cat.id
    })
    .map(cat => {
        return cat.category_name
    })
    return result[0]
}


const generateCardsData = (
  totalClaims: number,
  allTransactionDates: string[],
) => {
  // console.log('Inside generateCardsData!')

  let cardsData: CardType[] = [
      {
          "Title": "Today's Date",
          "Value": [new Date().toDateString()],
          "Description": ''
      },
      {
          "Title": "Date Of Last Transaction",
          "Value": calculateLastTransactionDate(allTransactionDates),
          "Description": ''
      },
      {
          "Title": "Total Claimables",
          "Value": [`$${totalClaims.toString()}`],
          "Description": ''
      },
  ]

  return cardsData

}
const calculateLastTransactionDate = (allTransactionDates: string[]) => {

    // console.log('Inside calculateLastTransactionDate!')
    if ( allTransactionDates?.length === 0 ) {
      return [ 'No Last Transaction Found']
    }

    if ( allTransactionDates?.length > 0 ) {

      // console.log('input: ', allTransactionDates)
      const dateObjects = allTransactionDates.map(dateString => {
        const date = new Date(dateString);
        date.setHours(0, 0, 0, 0);
        return date;
      });

      // console.log('dateObjects: ', dateObjects)

      const latestDate = new Date(Math.max(...dateObjects.map(date => date.getTime())))
      // console.log('latest Date: ', latestDate)

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const timeDiff = today.getTime() - latestDate.getTime()
      const daysSinceLatestTransaction = Math.floor(timeDiff / (1000 * 60 * 60 * 24))


      let daysSinceLatestTransaction_Description = ''
      if ( daysSinceLatestTransaction === 0 ) {
        daysSinceLatestTransaction_Description = 'You Are On Track, Good Job'
      }
      if ( daysSinceLatestTransaction < 0 ) {
        daysSinceLatestTransaction_Description = `${Math.abs(daysSinceLatestTransaction)} Days Ahead From Today`
        if ( daysSinceLatestTransaction === -1 ) {
          daysSinceLatestTransaction_Description = `${Math.abs(daysSinceLatestTransaction)} Day Ahead From Today`
        } 
      }
      if ( daysSinceLatestTransaction > 0 ) {
        daysSinceLatestTransaction_Description = `${daysSinceLatestTransaction} Days Since Your Last Transaction`
        if ( daysSinceLatestTransaction === 1 ) {
          daysSinceLatestTransaction_Description = `${daysSinceLatestTransaction} Day Since Your Last Transaction`
        } 
      }

      // console.log('returned: ', latestDate.toDateString(), daysSinceLatestTransaction_Description)
      return [latestDate.toDateString(), daysSinceLatestTransaction_Description]
    }

    return []
}