import { useState } from "react";

const InsightCards = ({ 
    cardsData
} : { 
    cardsData: CardType[] | null;
}) => {

    const [isLoading, setIsLoading] = useState(false)

    return (
        <div className="insight-cards 
            my-8
            laptop:flex 
            laptop:gap-[20px]
        ">
            {cardsData?.map(card => {
                return (
                    <div key={card.Title} className={`insight-card 
                        mb-4 laptop:mb-0 
                        p-4 laptop:p-[20px]
                        border-color-border 
                        border-solid 
                        border-[1px]
                        rounded
                        bg-color-card-background
                        flex
                        flex-col
                        w-full
                        min-h-[100px] laptop:min-h-[150px]
                        ${isLoading && 'justify-center items-center'}
                    `}>
                        {isLoading ? 
                            <p className="mb-2">Loading...</p> 
                        :
                            <>
                                <p className="mb-2">{card.Title}</p>
                                {card.Value.map((value, index) => {
                                    return <p key={index} className='fs-h3 font-medium mb-2'>{value}</p>
                                })}
                                <p className='fs-caption laptop:mt-auto'>{card.Description}</p>
                            </>
                        }
                    </div>
                )
            })}
        </div>
    )
}

export default InsightCards


export type CardType = {
    "Title": string;
    "Value": string[];
    "Description": string;
}