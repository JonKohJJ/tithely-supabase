import { Link } from "react-router-dom"

const PrimaryButton = (
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
            className={`primary-button ${additionalClasses}
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
            `}
            to={destination ? destination : ''} 
            onClick={onClickFunction ? onClickFunction : () => {}}
        >
            {text}
        </Link>
  )
}

export default PrimaryButton
