import { Link } from "react-router-dom"

const SecondaryButton = (
    {   text,
        destination,
        onClickFunction,
        additionalClasses,
    }
    :
    { 
        text: string;
        destination?: string;
        onClickFunction?: () => void;
        additionalClasses?: string;
    }
) => {
  return (
        <Link 
            className={`secondary-button ${additionalClasses}
                inline-block
                px-[16px]
                py-[8px]
                bg-white
                text-[#0000ff]
                border-solid
                border-[1px]
                border-[#0000ff]
                rounded
                text-center
            `}
            to={destination ? destination : ''} 
            onClick={onClickFunction ? onClickFunction : () => {}}
        >
            {text}
        </Link>
  )
}

export default SecondaryButton
