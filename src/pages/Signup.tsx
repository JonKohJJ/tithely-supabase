import LoginSignupForm from '../components/Forms/LoginSignupForm'
import { useState, useEffect } from 'react'

const Signup = ({ isDark } : { isDark: boolean }) => {

  // Calculate Height 
  const [sectionHeight, setSectionHeight] = useState(0)
  const calculateSectionHeight = () => {
      const homeNavBar = document.querySelector(".home-navigation-section")
      const mycontainer = document.querySelector(".mycontainer")

      if (homeNavBar && mycontainer) {
          const homeNavBarHeight = homeNavBar.clientHeight
          const newHeight = window.innerHeight - homeNavBarHeight;
          setSectionHeight(newHeight);
      }
  }
  useEffect(() => {
      calculateSectionHeight()
      window.addEventListener("resize", calculateSectionHeight)
      return () => { window.removeEventListener("resize", calculateSectionHeight) }
  }, [])

  return (
    <div className="Signup-Page flex justify-center" style={{ height: `${sectionHeight}px` }}>
      <div className="mycontainer flex flex-col items-center justify-center">

        <LoginSignupForm isDark={isDark}/>

      </div>
    </div>
  )
}

export default Signup
