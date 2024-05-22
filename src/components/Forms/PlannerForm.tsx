import { useEffect, useState } from 'react';
import supabase from '../../config/supabaseClient';
import SecondaryButton from '../Buttons/SecondaryButton';

const PlannerForm = (
    {
        type,
        type_id,
        method,
        setAddingUpdatingID,
        updating_cat_id,
        updating_cat_name,
        updating_cat_budget,
    } 
    : 
    {
        type: string;
        type_id: number;
        method: string;
        setAddingUpdatingID: React.Dispatch<React.SetStateAction<number | null>>;
        updating_cat_id?: number;
        updating_cat_name?: string;
        updating_cat_budget?: number;
    }
) => {

    const [formData, setFormData] = useState<PlannerFormDataType>({ category_name: '', category_budget: 0,  category_type: 0 });
    const [formError, setFormError] = useState<string | null>(null);

    // Set Updating Fields
    useEffect(() => {
        if (updating_cat_name !== undefined && updating_cat_budget !== undefined) {
            setFormData({ ...formData, category_name: updating_cat_name, category_budget: updating_cat_budget})
        }
    }, [updating_cat_name, updating_cat_budget])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.category_name || !formData.category_budget) {
            setFormError('Missing Fields!')
            return
        }

        if (method === 'Adding') {

            if (type === 'Expenses') {
                const { data, error } = await supabase
                    .from('categories')
                    .insert([{ ...formData, category_type: type_id, fixed_expense: false }])
                    .select()

                if (error !== null) {
                    setFormError('Error Creating New Category!')
                    return
                }
    
                if (data !== null) {
                    setFormError(null)
                }
            } else {
                const { data, error } = await supabase
                    .from('categories')
                    .insert([{ ...formData, category_type: type_id }])
                    .select()

                if (error !== null) {
                    setFormError('Error Creating New Category!')
                    return
                }
    
                if (data !== null) {
                    setFormError(null)
                }
            }
            
        }

        if (method === 'Updating') {
            const { data, error } = await supabase
                .from('categories')
                .update([{ ...formData, category_type: type_id }])
                .eq('id', updating_cat_id)
                .select()
        
            if (error !== null) {
                setFormError('Error Updating Category!')
                return
            }

            if (data !== null) {
                setFormError(null)
            }
        }


        setFormData({ category_name: '', category_budget: 0,  category_type: 0 });
        setFormError(null)
        setAddingUpdatingID(null)
    };

    return (
        <div className="planner-form-div bg-color-background rounded p-[20px] my-4">
            <form className="planner-form" onSubmit={handleSubmit}>
                <div className='flex gap-2'>
                    <input 
                        type="text" 
                        id="category_name" 
                        name="category_name"
                        value={formData.category_name} 
                        onChange={handleChange} 
                        className={`bg-[transparent] border-b-[1px] border-color-border py-2 w-[76%] focus:outline-none`}
                        placeholder='Add New Category'
                    />
                    <input 
                        type="number" 
                        id="category_budget" 
                        name="category_budget" 
                        value={formData.category_budget} 
                        onChange={handleChange}
                        className={`bg-[transparent] border-b-[1px] border-color-border py-2 w-[24%] focus:outline-none`}
                    />
                </div>
                <div className='mt-4 text-right flex justify-between items-center'>
                    {formError && <p className='w-full'>{formError}</p>}
                    <div className='w-full flex justify-end'>
                        {/* Couldnt get the PrimaryButton component to work sian */}
                        <button className='
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
                        <SecondaryButton text='Close' onClickFunction={() => {setAddingUpdatingID(null)}}/>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default PlannerForm


type PlannerFormDataType = {
    category_name: string;
    category_budget: number;
    category_type: number;
    fixed_expense?: boolean;
}