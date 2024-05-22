import supabase from "../config/supabaseClient"
import { useState, useEffect } from "react"

export const useFetchCategories = () => {

    const [fetchCategoriesError, setFetchError] = useState<null | string>(null)
    const [categories, setCategories] = useState<null | categoriesType[]>(null)
    const [fetchCategoriesLoading, setFetchCategoriesLoading] = useState(false)

    const fetchCategories = async () => {

        setFetchCategoriesLoading(true)

        const { data, error } = await supabase
            .from('categories')
            .select()
            .order('id', { ascending: true })
    
        if (error) {
            setFetchError('Could not fetch categories')
            setCategories(null)
            console.log(error)
            setFetchCategoriesLoading(false)
        }

        if (data) {
            setCategories(data)
            setFetchError(null)
            setFetchCategoriesLoading(false)
        }

    }

    useEffect(() => {

        fetchCategories()
        

        // realtime feature
        supabase
            .channel("realtime_planner")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "categories",
                },
                () => { fetchCategories() }
            )
            .subscribe();

    }, []) 

  return { categories, fetchCategoriesLoading, fetchCategoriesError }
}


export type categoriesType = {
    id: number;
    category_name: string;
    category_budget: number;
    category_type: number;
    fixed_expense?: boolean;
}