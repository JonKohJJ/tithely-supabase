import { Outlet } from 'react-router-dom'
import SideNavigation from '../../components/SideNavigation/SideNavigation'

const LoggedInLayout = ({ isDark, setIsDark }: { isDark: boolean, setIsDark: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
        <div className='logged-in-layout laptop:flex'>
            <SideNavigation isDark={isDark} setIsDark={setIsDark} />
            <Outlet />
        </div>
  )
}

export default LoggedInLayout
