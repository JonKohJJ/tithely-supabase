import { FiSun, FiMoon } from "react-icons/fi";

const ThemeSwitcherBar = ({ isDark, setIsDark }: { isDark: boolean, setIsDark: React.Dispatch<React.SetStateAction<boolean>> }) => {

    return (
        <div className="theme-switcher text-color-text-faded hover:text-color-text cursor-pointer py-[20px] border-b-color-border border-b-[1px] laptop:border-b-[0]" onClick={() => { setIsDark(!isDark) }}>
            {isDark ? <FiSun /> : <FiMoon />}
        </div>
    )

};

export default ThemeSwitcherBar;
