import { useAuthContext } from "../../hooks/useAuthContext"
import ThemeSwitcherBar from "../ThemeSwitcherBar/ThemeSwitcherBar"
import { Link } from "react-router-dom"
import { FiMenu, FiX } from "react-icons/fi";
import PrimaryButton from "../Buttons/PrimaryButton";
import { useState } from "react";
import { HiMiniPaperAirplane } from "react-icons/hi2";

const HomeNavigation = ({ isDark, setIsDark }: { isDark: boolean, setIsDark: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const { user, session } = useAuthContext()
    const [isActive, setIsActive] = useState(false)

    return (
        <section className="home-navigation-section
            flex
            justify-center
            sticky
            top-0
            z-[1]
            bg-color-background
            border-solid
            border-b-color-border
            border-b-[1px]
        ">
            <div className="mycontainer">

                <div className="home-nav-content flex justify-between items-center laptop:items-center">

                    <Link to='/tithely-supabase' className="flex items-center" onClick={() => {setIsActive(false)}}>
                        <HiMiniPaperAirplane className="transform rotate-[-90deg] text-color-icon-fill h-full w-[25px]"/> 
                        <p className="fs-h2">Tithely</p>
                    </Link>



                    <div className={`home-nav-links ${isActive ? 'translate-x-[0]' : 'translate-x-[100%]'}
                        fixed
                        top-0
                        left-0
                        w-[100vw]
                        h-[calc(100vh-78.719px)]
                        mt-[78.719px]
                        transition-transform
                        ease-in-out 
                        duration-100
                        bg-color-background

                        laptop:static
                        laptop:w-auto
                        laptop:h-auto
                        laptop:mt-0
                        laptop:translate-x-[0]
                    `}>

                        <div className="mycontainer flex flex-col h-[100%]
                            laptop:flex-row
                            laptop:gap-[25px]
                            laptop:p-0
                            laptop:items-center
                        ">

                            {/* <Link to='/' className="fs-base py-[20px] border-b-color-border border-b-[1px] laptop:border-b-[0] laptop:p-[0]" onClick={() => {setIsActive(false)}}>About</Link>
                            <Link to='/' className="fs-base py-[20px] border-b-color-border border-b-[1px] laptop:border-b-[0] laptop:p-[0]" onClick={() => {setIsActive(false)}}>Prices</Link>
                            <Link to='/style-guide' className="fs-base py-[20px] border-b-color-border border-b-[1px] laptop:border-b-[0] laptop:p-[0]" onClick={() => {setIsActive(false)}}>Style Guide</Link> */}
                            <ThemeSwitcherBar isDark={isDark} setIsDark={setIsDark}/>


                            { !(user && session) ?
                                <PrimaryButton text="Log In To Get Started" destination="/tithely-supabase/login" onClickFunction={() => {setIsActive(false)}} additionalClasses="!py-[20px] laptop:!py-[8px] mt-auto laptop:mt-0" />
                                :
                                <PrimaryButton text="Go To Dashboard" destination="/tithely-supabase/dashboard" onClickFunction={() => {setIsActive(false)}} additionalClasses="!py-[20px] laptop:!py-[8px] mt-auto laptop:mt-0" />
                            }

                        </div>

                    </div>
                    
                    <div className="icon w-[25px] h-[25px] laptop:hidden" onClick={() => {setIsActive(!isActive)}}>
                        { isActive ? <FiX className="w-[100%] h-[100%]" /> : <FiMenu className="w-[100%] h-[100%]" /> }
                    </div>
                </div>

            </div>
        </section>
    )
}

export default HomeNavigation

// type NavigationLinksType = {
//     text: string;
//     destination: string;
//     onClickFunctionality: () => {};
// }[]

// const NavigationLinks: NavigationLinksType = [
//     {
//         text: 'About',
//         destination: '/',
//         onClickFunctionality: () => {setIsActive(false)}
//     }
// ]