import { Outlet } from "react-router-dom"
import HomeNavigation from "../../components/HomeNavigation/HomeNavigation"
import Footer from "../../components/Footer/Footer"

const NotLoggedInLayout = ({ isDark, setIsDark }: { isDark: boolean, setIsDark: React.Dispatch<React.SetStateAction<boolean>> }) => {
    return (
        <div className='not-logged-in-layout flex flex-col min-h-[100vh]'>
            <HomeNavigation isDark={isDark} setIsDark={setIsDark} />
            <Outlet />
            <Footer />
        </div>
    )
}

export default NotLoggedInLayout
