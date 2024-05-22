import { useAuthContext } from "../../hooks/useAuthContext"
import { Link, useLocation, useNavigate } from "react-router-dom"
import PrimaryButton from "../Buttons/PrimaryButton"
import { useState } from "react"
import { FiMenu, FiX } from "react-icons/fi";
import ThemeSwitcherBar from "../ThemeSwitcherBar/ThemeSwitcherBar"
import { HiMiniPaperAirplane } from "react-icons/hi2";

const SideNavigation = ({ isDark, setIsDark }: { isDark: boolean, setIsDark: React.Dispatch<React.SetStateAction<boolean>> }) => {

  const { signOut } = useAuthContext()
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false)
  const { pathname } = useLocation()

  return (
    <section className="side-navigation-section
      flex
      justify-center
      sticky
      top-0
      z-[1]
      bg-color-background
      border-solid
      border-b-color-border
      border-b-[1px]

      laptop:h-[100vh]
      laptop:border-b-[0]
      laptop:border-r-[1px]
      laptop:border-r-color-border
      laptop:w-[20%]
      laptop:max-w-[150px]
    ">
      <div className="mycontainer">

        <div className="side-nav-content flex justify-between items-center laptop:flex-col h-full">

          <Link to='/' className="flex items-center w-full laptop:justify-center laptop:flex-col" onClick={() => {}}>
            <HiMiniPaperAirplane className="transform rotate-[-90deg] text-color-icon-fill h-full w-[25px]"/> 
            <p className="fs-h2">Tithely</p>
          </Link>
          

          <div className={`side-nav-links ${isActive ? 'translate-x-[0]' : 'translate-x-[100%]'}
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
              z-[9999]

              laptop:static
              laptop:w-[100%]
              laptop:h-[100%]
              laptop:mt-0
              laptop:translate-x-[0]
              laptop:pt-[30px]
          `}>

              <div className="p-[20px] laptop:px-0 flex flex-col h-[100%]">

                <div className="laptop:mb-8">
                  <p className="hidden laptop:block fs-caption">Overview</p>
                  <Link to='/dashboard' className={`fs-base text-color-text-faded py-[15px] laptop:pl-[2px] block w-full border-b-color-border border-b-[1px] laptop:border-b-0 hover:text-color-text ${pathname === '/dashboard' && '!text-color-text'}`} onClick={() => {setIsActive(!isActive)}}>Dashboard</Link>
                </div>

                <div>
                  <p className="hidden laptop:block fs-caption">Editor</p>
                  <Link to='/planner' className={`fs-base text-color-text-faded py-[15px] laptop:pl-[2px] block w-full border-b-color-border border-b-[1px] laptop:border-b-0 hover:text-color-text ${pathname === '/planner' && '!text-color-text'}`} onClick={() => {setIsActive(!isActive)}}>Planner</Link>
                  <Link to='/tracker' className={`fs-base text-color-text-faded py-[15px] laptop:pl-[2px] block w-full border-b-color-border border-b-[1px] laptop:border-b-0 hover:text-color-text ${pathname === '/tracker' && '!text-color-text'}`} onClick={() => {setIsActive(!isActive)}}>Tracker</Link>
                </div>


                <div className="flex flex-col h-full laptop:justify-end">
                  <ThemeSwitcherBar isDark={isDark} setIsDark={setIsDark}/>
                  <Link to='/settings' className={`fs-base text-color-text-faded py-[15px] border-b-color-border border-b-[1px] laptop:border-b-0 hover:text-color-text ${pathname === '/settings' && '!text-color-text'}`} onClick={() => {setIsActive(!isActive)}}>Settings</Link>
                  <PrimaryButton text="Sign Out" destination="/login" onClickFunction={() => { signOut(); navigate('/')}} additionalClasses="!py-[20px] laptop:!py-[8px] mt-auto laptop:mt-[20px]" />
                </div>


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

export default SideNavigation
