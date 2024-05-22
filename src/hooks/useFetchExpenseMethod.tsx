import supabase from "../config/supabaseClient"
import { useState, useEffect } from "react"

export const useFetchExpenseMethod = () => {

  const [fetchExpenseMethodError, setFetchError] = useState<null | string>(null)
  const [expenseMethods, setExpenseMethods] = useState<null | expenseMethodType[]>(null)
  
  const fetchTypes = async () => {
      const { data, error } = await supabase
          .from('reference_expense_method')
          .select()
      
      if (error) {
        setFetchError('Could not fetch expense methods')
        setExpenseMethods(null)
        console.log(error)
      }

      if (data) {
        setExpenseMethods(data)
        setFetchError(null)
      }
  }

  useEffect(() => {
      fetchTypes()
  }, [])

  return { expenseMethods, fetchExpenseMethodError }
}


export type expenseMethodType = {
  id: number;
  expense_method: string;
}