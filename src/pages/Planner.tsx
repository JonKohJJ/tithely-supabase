import { categoriesType } from "../hooks/useFetchCategories"
import { referenceTypeType } from "../hooks/useFetchTypes"
import { useEffect, useState } from "react"
import Table from "../components/Table/Table"
import InsightCards, { CardType } from "../components/InsightCards/InsightCards"

const Planner = ({
    types, 
    fetchTypesError,
    categories,
    fetchCategoriesError,
}:
{
    types: referenceTypeType[] | null;
    fetchTypesError: string | null;
    categories: categoriesType[] | null;
    fetchCategoriesError: string | null;
}) => {
    
    const [cardsData, setCardsData] = useState<CardType[] | null>(null)
    const [tableData, setTableData] = useState<PlannerTableDataType[] | null>(null)
    
    const [AddingUpdatingID, setAddingUpdatingID] = useState<number | null>(null)

    // Middleware - Generate Table Data & Cards Data
    useEffect(() => {
        if (types && categories) { 
            setTableData(generateTableData(types, categories, setCardsData))
        }
    }, [types, categories])

    
    return (
        <div className="planner flex justify-center w-full">
            <div className="mycontainer">

                <div className="page-header">
                    <div>
                        <p className="fs-h2 mb-2">My Planner</p>
                        <p className="h3">Budget Your Income, Savings & Expenses Categories Here</p>
                    </div>
                </div>

                {fetchTypesError && <p>{fetchTypesError}</p>}
                {fetchCategoriesError && <p>{fetchCategoriesError}</p>}
                <InsightCards cardsData={cardsData} />
                <div className="tables">
                    {tableData?.map(item => 
                        <Table key={item.type} 
                            data={item}
                            AddingUpdatingID={AddingUpdatingID}
                            setAddingUpdatingID={setAddingUpdatingID} 
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Planner

export type PlannerTableDataType = {
    type: string;
    type_id: number;
    categories: categoriesType[];
    total: number;
    footerDescription: string;
}


const generateTableData = ( 
    types: referenceTypeType[], 
    categories: categoriesType[],
    setCardsData: React.Dispatch<React.SetStateAction<CardType[] | null>>
) => {

    let result = types.map(type => {

        let typesTotal = 0
        
        const filteredCategories = categories
            .filter(cat => cat.category_type === type.id)
            .map(cat => {
                typesTotal = typesTotal + cat.category_budget
                return cat
            })
        

        if (type.type_name === 'Expenses') {

            let fixed = 0
            let variable = 0

            categories
                .filter(cat => cat.category_type === type.id)
                .map(cat => {
                    if (cat.fixed_expense) {
                        fixed = fixed + cat.category_budget
                    }
                    else {
                        variable = variable + cat.category_budget
                    }
                })

            return {
                "type": type.type_name,
                "type_id": type.id,
                "categories": filteredCategories,
                "total": typesTotal,
                "fixed": fixed,
                "variable": variable,
            }
        }

        return {
            "type": type.type_name,
            "type_id": type.id,
            "categories": filteredCategories,
            "total": typesTotal
        }

    })

    let totalIncome = result.find(res => res.type === 'Income')?.total
    let totalSavings = result.find(res => res.type === 'Savings')?.total
    let totalExpenses = result.find(res => res.type === 'Expenses')?.total
    let totalExpensesFixed = result.find(res => res.type === 'Expenses')?.fixed
    let totalExpensesVariable = result.find(res => res.type === 'Expenses')?.variable

    setCardsData(generateCardsData(totalIncome, totalSavings, totalExpenses, totalExpensesFixed, totalExpensesVariable))

    let finalResult = result.map(res => {
        if (res.type === 'Income') {
            return {
                ...res,
                "footerDescription": "Keep up the good work!"
            }
        }
        if (res.type === 'Savings') {
            return {
                ...res,
                "footerDescription": `You on track to save ${totalIncome && ((res.total/totalIncome)*100).toFixed(2)}% of your income!`
            }
        }
        if (res.type === 'Expenses') {
            return {
                ...res,
                "footerDescription": `You plan to spend ${totalIncome && ((res.total/totalIncome)*100).toFixed(2)}% of your income!`
            }
        }
        return {
            ...res,
            "footerDescription": ""
        }
    })

    return finalResult
}

const generateCardsData = (
    totalIncome: number|undefined, 
    totalSavings: number|undefined, 
    totalExpenses: number|undefined,
    totalExpensesFixed: number|undefined,
    totalExpensesVariable: number|undefined,
) => {

    const {zerobase_values, zerobase_description} = calculateZeroBaseIndicator(totalIncome, totalSavings, totalExpenses)
    const {fixedvariable_values, fixedvariable_description} = calculateFixedVariableExpenses(totalExpenses, totalExpensesFixed, totalExpensesVariable)

    let cardsData: CardType[] = [
        {
            "Title": "Zero-Based Indicator",
            "Value": zerobase_values,
            "Description": zerobase_description
        },
        {
            "Title": "Fixed/Variable Expenses",
            "Value": fixedvariable_values,
            "Description": fixedvariable_description
        },
    ]

    return cardsData

}
const calculateZeroBaseIndicator = (
    totalIncome: number|undefined, 
    totalSavings: number|undefined, 
    totalExpenses: number|undefined,
) => {

    let differences = 0
    let zerobase_values: string[] = []
    let zerobase_description: string = ""

    if (totalIncome !== undefined && totalSavings !== undefined && totalExpenses !== undefined) {
        differences = totalIncome - (totalSavings + totalExpenses)  
    }
    
    switch (true) {
        case differences < 0:
            zerobase_values.push(`$${Math.abs(differences)} Exceeded!`)
            zerobase_description = "Double check your budgets!"
            break;
        case differences > 0:
            zerobase_values.push(`$${differences} Not Allocated!`)
            zerobase_description = "Double check your budgets!"
            break;    
        default:
            zerobase_values.push("All Funds Allocated!")
            zerobase_description = "You're all set!"
            break;
    }

    return { zerobase_values, zerobase_description }
}
const calculateFixedVariableExpenses = (
    totalExpenses: number|undefined,
    totalExpensesFixed: number|undefined,
    totalExpensesVariable: number|undefined,
) => {

    let fixedvariable_values: string[] = []
    let fixedvariable_description: string = ""

    let fixedPercentage = 0
    let variablePercentage = 0

    if (totalExpenses && totalExpensesFixed && totalExpensesVariable) {
        fixedPercentage = ((totalExpensesFixed/totalExpenses)*100)
        variablePercentage = ((totalExpensesVariable/totalExpenses)*100)
    }

    fixedvariable_values.push(`Fixed ∙ $${totalExpensesFixed} ∙ ${fixedPercentage.toFixed(2)}%`)
    fixedvariable_values.push(`Variable ∙ $${totalExpensesVariable} ∙ ${variablePercentage.toFixed(2)}%`)

    return { fixedvariable_values, fixedvariable_description }
}