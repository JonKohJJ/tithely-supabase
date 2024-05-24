import { useEffect, useState } from "react"

const NotFound404 = () => {

  // Calculate Height 
  const [sectionHeight, setSectionHeight] = useState(0)
  const calculateSectionHeight = () => {
      const homeNavBar = document.querySelector(".home-navigation-section")
      const mycontainer = document.querySelector(".mycontainer")

      if (homeNavBar && mycontainer) {
          const homeNavBarHeight = homeNavBar.clientHeight
          const newHeight = window.innerHeight - homeNavBarHeight - 48;
          setSectionHeight(newHeight);
      }
  }
  useEffect(() => {
      calculateSectionHeight()
      window.addEventListener("resize", calculateSectionHeight)
      return () => { window.removeEventListener("resize", calculateSectionHeight) }
  }, [])


  return (
    <div className={`not-found-404 flex justify-center`}>
        <div className="mycontainer flex justify-center items-center" style={{ minHeight: `${sectionHeight}px` }}>
          <p>Page Not Found</p>
        </div>
    </div>
  )
}

export default NotFound404
