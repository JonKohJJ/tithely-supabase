import supabase from "../config/supabaseClient"
import { useState, useEffect } from "react"

export const useFetchTypes = () => {

  const [fetchTypesError, setFetchError] = useState<null | string>(null)
  const [types, setTypes] = useState<null | referenceTypeType[]>(null)
  const [fetchTypesLoading, setFetchTypesLoading] = useState(false)
  
  const fetchTypes = async () => {

      setFetchTypesLoading(true)

      const { data, error } = await supabase
          .from('reference_type')
          .select()
      
      if (error) {
        setFetchError('Could not fetch types')
        setTypes(null)
        console.log(error)
        setFetchTypesLoading(false)
      }

      if (data) {
        setTypes(data)
        setFetchError(null)
        setFetchTypesLoading(false)
      }
  }

  useEffect(() => {
      fetchTypes()
  }, [])

  return { types, fetchTypesLoading, fetchTypesError }
}


export type referenceTypeType = {
  id: number;
  type_name: string;
}