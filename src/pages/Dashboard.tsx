import { useEffect, useState } from "react";
import { CardType } from "../components/InsightCards/InsightCards";
import { referenceTypeType } from "../hooks/useFetchTypes";
import { categoriesType } from "../hooks/useFetchCategories";
import { TransactionType } from "../hooks/useFetchTransactions";
import { expenseMethodType } from "../hooks/useFetchExpenseMethod";
import { useFetchExpenseMethod } from "../hooks/useFetchExpenseMethod";
import { useFetchTransactions } from "../hooks/useFetchTransactions";
import Table from "../components/Table/Table";
import InsightCards from "../components/InsightCards/InsightCards";
import YearMonthFilter from "../components/Filters/YearMonthFilter";

const Dashboard = ({
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

    const { expenseMethods, fetchExpenseMethodError } = useFetchExpenseMethod()
    const { transactions, fetchTransactionsError } = useFetchTransactions(filteredMonth, filteredYear, getLastDayOfMonth(filteredYear, filteredMonth))
    
    const [cardsData, setCardsData] = useState<CardType[] | null>(null)
    const [tableData, setTableData] = useState<DashboardTableDataType[] | null>(null)

    // Show Actual Expenses state
    const [showActual, setShowActual] = useState(false)

    // Middleware - Generate Table Data & Cards Data
    useEffect(() => {
      if (types && expenseMethods && categories && transactions) {

          setTableData(generateTableData(transactions, types, expenseMethods, categories, setCardsData, showActual))

      }
    }, [types, categories, transactions, expenseMethods, showActual])
  
    return (
      <div className="dashboard flex justify-center w-full">
        <div className="mycontainer">

          <div className="page-header flex justify-between items-center">
              <div>
                <p className="fs-h2 mb-2">My Dashboard</p>
                <p className="h3">An overview of your finances</p>
              </div>
              <YearMonthFilter filteredYear={filteredYear} setFilteredYear={setFilteredYear} filteredMonth={filteredMonth} setFilteredMonth={setFilteredMonth}/>
          </div>
          
          {fetchTypesError && <p>{fetchTypesError}</p>}
          {fetchExpenseMethodError && <p>{fetchExpenseMethodError}</p>}
          {fetchCategoriesError && <p>{fetchCategoriesError}</p>}
          {fetchTransactionsError && <p>{fetchTransactionsError}</p>}

          <InsightCards cardsData={cardsData} />
          <div className="tables">
              {tableData?.map(item => 
                  <Table key={item.type} 
                      data={item}
                      showActual={showActual}
                      setShowActual={setShowActual}
                  />
              )}
          </div>
        </div>
      </div>
  )
}

export default Dashboard

export type DashboardTableDataType = {
  type: string;
  categories: (CategoryInsightType|undefined)[];
  footerTotals: FooterTotalType;
}
export type CategoryInsightType = {
    category_name: string;
    tracked: number;
    budget: number;
    percentage_completed: number;
    remaining: number;
    excess: number;
}
type FooterTotalType = {
    trackedTotals: number;
    budgetTotals: number;
    percentageCompletedTotals: number;
    remainingTotals: number;
    excessTotals: number;
}


const getLastDayOfMonth = (filteredYear: number, filteredMonth: number): number => {
  const year = filteredYear;
  const month = filteredMonth;
  const lastDayOfMonth = new Date(year, month, 0);
  return lastDayOfMonth.getDate();
}
const generateTableData = (
  transactions: TransactionType[],
  types: referenceTypeType[],
  expenseMethods: expenseMethodType[],
  categories: categoriesType[],
  setCardsData: React.Dispatch<React.SetStateAction<CardType[] | null>>,
  showActual: boolean,
) => {

  let result = types.map(type => {

      // Total values for footer
      let footerTotals = {
          trackedTotals: 0,
          budgetTotals: 0,
          percentageCompletedTotals: 0,
          remainingTotals: 0,
          excessTotals: 0,
      }

      const respectiveCategories = categories
        .filter((cat) => { return cat.category_type === type.id })
        .map((cat) => {

            // If showActual checkbox is checked, only return categories that are variable, remove fixed expense categories
            if (type.type_name === 'Expenses' && showActual && cat.fixed_expense) {
                return undefined
            } else {
                const { tracked, budget, percentage_completed, remaining, excess } = calculateCategoriesInsights(cat, transactions, showActual, type.type_name)

                footerTotals.trackedTotals = footerTotals.trackedTotals + tracked
                footerTotals.budgetTotals = footerTotals.budgetTotals + budget
                footerTotals.remainingTotals = footerTotals.remainingTotals + remaining
                footerTotals.excessTotals = footerTotals.excessTotals + excess
    
                return {
                  "category_name": cat.category_name,
                  "tracked": parseFloat(tracked.toFixed(2)),
                  "budget": parseFloat(budget.toFixed(2)),
                  "percentage_completed": percentage_completed,
                  "remaining": parseFloat(remaining.toFixed(2)),
                  "excess": parseFloat(excess.toFixed(2)),
                }
            }

        })

      const { percentageCompletedTotals, remainingTotals, excessTotals } = calculateFooterTotals(footerTotals.trackedTotals, footerTotals.budgetTotals)

      footerTotals.trackedTotals = parseFloat(footerTotals.trackedTotals.toFixed(2))
      footerTotals.budgetTotals = parseFloat(footerTotals.budgetTotals.toFixed(2))
      footerTotals.percentageCompletedTotals = percentageCompletedTotals
      footerTotals.remainingTotals = remainingTotals
      footerTotals.excessTotals = excessTotals

      return {
          "type": type.type_name,
          "categories": respectiveCategories,
          "footerTotals": footerTotals,
      }
  })

  // For Cards Data
  let totalTrackedIncome = result.find(res => res.type === 'Income')?.footerTotals.trackedTotals
  let totalTrackedSavings = result.find(res => res.type === 'Savings')?.footerTotals.trackedTotals

  setCardsData(generateCardsData(expenseMethods, transactions, totalTrackedIncome, totalTrackedSavings))
  return result
}
const calculateCategoriesInsights = (cat: categoriesType, transactions: TransactionType[], showActual: boolean, type_name: string) => {

    // Calculate tracked expense for each category
    let tracked = 0
  
    // If showActual checkbox is checked, the tracked will be EXCLUDING claims
    if ( type_name === 'Expenses' && showActual ) {
      transactions.map((trans) => {
          if (trans.transaction_category === cat.id && !trans.isClaimable) {
              tracked = tracked + trans.transaction_amount
          }
      })
    } else {
      transactions.map((trans) => {
          if (trans.transaction_category === cat.id) {
              tracked = tracked + trans.transaction_amount
          }
      })
    }

    let budget = cat.category_budget

    // Calculate % completed for each category
    let percentage_completed = Math.round((tracked/budget)*100)
    if (isNaN(percentage_completed) || !isFinite(percentage_completed)) {
      percentage_completed = 0
    }

    // Calculate remaining & excess for each category
    let excess = 0
    let remaining = cat.category_budget - tracked
    if (remaining < 0) {
      remaining = 0
      excess = Math.abs(cat.category_budget - tracked)
    }

    tracked = parseFloat(tracked.toFixed(2))
    budget = parseFloat(budget.toFixed(2))
    remaining = parseFloat(remaining.toFixed(2))
    excess = parseFloat(excess.toFixed(2))

    return { tracked, budget, percentage_completed, remaining, excess }  
}
const calculateFooterTotals = (trackedTotals: number, budgetTotals: number) => {

  // Calculate total % completed for each type
  let percentageCompletedTotals = Math.round((trackedTotals/budgetTotals)*100)
  if (isNaN(percentageCompletedTotals) || !isFinite(percentageCompletedTotals)) {
      percentageCompletedTotals = 0
  }

  // Calculate remaining & excess for each type
  let excessTotals = 0
  let remainingTotals = budgetTotals - trackedTotals
  if (remainingTotals < 0) {
    remainingTotals = 0
      excessTotals = Math.abs(budgetTotals - trackedTotals)
  }

  remainingTotals = parseFloat(remainingTotals.toFixed(2))
  excessTotals = parseFloat(excessTotals.toFixed(2))

  return { percentageCompletedTotals, remainingTotals, excessTotals} 
}


const generateCardsData = (
  expenseMethods: expenseMethodType[], 
  transactions: TransactionType[],
  totalTrackedIncome: number|undefined,
  totalTrackedSavings: number|undefined,
) => {

  const { totalCreditCharges, totalDebitExpenses } = calculateCreditCardCharges_and_DebitExpenses(expenseMethods, transactions)
  const { debitAccountBalance_values, debitAccountBalance_description } = calculateDebitAccountBalance(totalTrackedIncome, totalTrackedSavings, totalDebitExpenses, totalCreditCharges)

  let cardsData: CardType[] = [
      {
          "Title": "Debit Account Balance",
          "Value": debitAccountBalance_values,
          "Description": debitAccountBalance_description,
      },
      {
          "Title": "Credit Card Charges",
          "Value": [`$${totalCreditCharges}`],
          "Description": '',
      },
  ]

  return cardsData
}
const calculateCreditCardCharges_and_DebitExpenses = (expenseMethods: expenseMethodType[], transactions: TransactionType[]) => {

    const creditExpenseMethodID = getCreditExpenseMethodID(expenseMethods)
    let totalCreditCharges = 0

    const debitExpenseMethodID = getDebitExpenseMethodID(expenseMethods)
    let totalDebitExpenses = 0

    transactions
        .filter((trans) => {return trans.expense_method_id === creditExpenseMethodID})
        .map((trans) => {
            totalCreditCharges = totalCreditCharges + trans.transaction_amount
        })

    transactions
        .filter((trans) => {return trans.expense_method_id === debitExpenseMethodID})
        .map((trans) => {
          totalDebitExpenses = totalDebitExpenses + trans.transaction_amount
        })

    totalCreditCharges = parseFloat(totalCreditCharges.toFixed(2))
    totalDebitExpenses = parseFloat(totalDebitExpenses.toFixed(2))

    return { totalCreditCharges, totalDebitExpenses }
}
export const getCreditExpenseMethodID = (expenseMethods: expenseMethodType[]) => {
    const creditExpenseMethodID = expenseMethods.find(res => res.expense_method === 'Credit')?.id
    return creditExpenseMethodID
}
export const getDebitExpenseMethodID = (expenseMethods: expenseMethodType[]) => {
  const debitExpenseMethodID = expenseMethods.find(res => res.expense_method === 'Debit')?.id
  return debitExpenseMethodID
}
const calculateDebitAccountBalance = (
  totalTrackedIncome: number|undefined,
  totalTrackedSavings: number|undefined,
  totalDebitExpenses: number|undefined,
  totalCreditCharges: number,
) => {

  let debitAccountBalance = 0
  let debitAccountBalance_values: string[] = []
  let debitAccountBalance_description: string = ""

  if (totalTrackedIncome !== undefined && totalTrackedSavings !== undefined && totalDebitExpenses !== undefined) {
    debitAccountBalance = totalTrackedIncome - totalTrackedSavings - totalDebitExpenses
    if (debitAccountBalance < 0) {
      debitAccountBalance = 0
    }
  }
  debitAccountBalance_values.push(`$${parseFloat(debitAccountBalance.toFixed(2))}`)


  let balanceLeftToPayCreditCardCharges = debitAccountBalance - totalCreditCharges
  if (balanceLeftToPayCreditCardCharges < 0) {
      debitAccountBalance_description = `$${Math.abs(parseFloat(balanceLeftToPayCreditCardCharges.toFixed(2)))} needed in your debit account to pay for your credit card bills`
  } else {
      debitAccountBalance_description = `$${parseFloat(balanceLeftToPayCreditCardCharges.toFixed(2))} left to pay for your credit card bills`
  }
  
  return { debitAccountBalance_values, debitAccountBalance_description }
}
