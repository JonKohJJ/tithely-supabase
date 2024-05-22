import supabase from "../config/supabaseClient"
import { useEffect, useState } from "react"

export const useFetchTransactions = (filteredMonth: number, filteredYear: number, lastDayOfMonth: number) => {

    const [fetchTransactionsError, setFetchError] = useState<null | string>(null)
    const [transactions, setTransactions] = useState<TransactionType[] | null>(null)

    const fetchTransactions = async () => {

        const { data, error } = await supabase
            .from('transactions')
            .select()
            .gte('transaction_date', `${filteredYear}-${filteredMonth}-01`)
            .lte('transaction_date', `${filteredYear}-${filteredMonth}-${lastDayOfMonth}`)
            .order('transaction_date', { ascending: false })
            .order('id', { ascending: false })

        if (error) {
            setFetchError('Could not fetch transactions')
            setTransactions(null)
            console.log(error)
        }

        if (data) {
            setTransactions(data)
            setFetchError(null)
        }
    }

    useEffect(() => {

        fetchTransactions()

        // realtime feature
        supabase
        .channel("realtime_tracker")
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "transactions",
            },
            () => { fetchTransactions() }
        )
        .subscribe()
        
    }, [filteredMonth, filteredYear])
    
    return { transactions, fetchTransactionsError }
}

export type TransactionType = {
    id: number;
    transaction_date: string;
    transaction_type: number;
    expense_method_id: number;
    transaction_category: number;
    transaction_amount: number;
    transaction_details: string;
    isClaimable: boolean;
}