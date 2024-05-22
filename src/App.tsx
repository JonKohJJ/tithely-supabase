import { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

// Custom Hooks
import { useAuthContext } from "./hooks/useAuthContext"
import { useFetchTypes } from "./hooks/useFetchTypes"
import { useFetchCategories } from "./hooks/useFetchCategories"

// Styles
import './App.css'

// Components
import LoggedInLayout from "./layouts/LoggedInLayout.tsx/LoggedInLayout"
import NotLoggedInLayout from "./layouts/NotLoggedInLayout.tsx/NotLoggedInLayout"
import Home from "./pages/Home"
import Planner from "./pages/Planner"
import Tracker from "./pages/Tracker"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import StyleGuide from "./pages/StyleGuide"
import Settings from "./pages/Settings"
import Signup from "./pages/Signup"

function App() {
  console.log('Rendering App component');
  const { user, session } = useAuthContext()
  console.log('User:', user);
  console.log('Session:', session);

  const { types, fetchTypesError } = useFetchTypes()
  const { categories, fetchCategoriesError } = useFetchCategories()

  const [filteredYear, setFilteredYear] = useState<number>(new Date().getFullYear())
  const [filteredMonth, setFilteredMonth] = useState<number>(new Date().getMonth() + 1)

  useEffect(() => {
    const storedYear = window.localStorage.getItem('TITHELY_SELECTED_YEAR')
    const storedMonth = window.localStorage.getItem('TITHELY_SELECTED_MONTH')
    const storedIsDark = window.localStorage.getItem('TITHELY_IS_DARK')
    if (storedYear !== null && storedMonth !== null && storedIsDark !== null) {
      setFilteredYear(JSON.parse(storedYear))
      setFilteredMonth(JSON.parse(storedMonth))
      setIsDark(JSON.parse(storedIsDark))
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('TITHELY_SELECTED_YEAR', JSON.stringify(filteredYear))
    window.localStorage.setItem('TITHELY_SELECTED_MONTH', JSON.stringify(filteredMonth))
  }, [filteredYear, filteredMonth])

  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    window.localStorage.setItem('TITHELY_IS_DARK', JSON.stringify(isDark))
  }, [isDark])

  return (
    <div className="app min-h-[100vh] bg-color-background text-color-text" data-theme={isDark ? 'dark' : 'light'}>
      <Router>
        <Routes>
          { (user && session) ? (
            <>
              <Route element={<LoggedInLayout isDark={isDark} setIsDark={setIsDark} />}>
                <Route path="tithely-supabase/planner" element={<Planner types={types} fetchTypesError={fetchTypesError} categories={categories} fetchCategoriesError={fetchCategoriesError} />} />
                <Route path="tithely-supabase/tracker" element={<Tracker types={types} fetchTypesError={fetchTypesError} categories={categories} fetchCategoriesError={fetchCategoriesError} filteredYear={filteredYear} setFilteredYear={setFilteredYear} filteredMonth={filteredMonth} setFilteredMonth={setFilteredMonth} />} />
                <Route path="tithely-supabase/dashboard" element={<Dashboard types={types} fetchTypesError={fetchTypesError} categories={categories} fetchCategoriesError={fetchCategoriesError} filteredYear={filteredYear} setFilteredYear={setFilteredYear} filteredMonth={filteredMonth} setFilteredMonth={setFilteredMonth} />} />
                <Route path="tithely-supabase/settings" element={<Settings />} />
                <Route path="tithely-supabase/style-guide" element={<StyleGuide />} />
                <Route path="tithely-supabase/" element={<Home />} />
              </Route>
            </>
          ) : (
            <Route element={<NotLoggedInLayout isDark={isDark} setIsDark={setIsDark} />}>
              <Route path="tithely-supabase/login" element={<Login isDark={isDark} />} />
              <Route path="tithely-supabase/signup" element={<Signup isDark={isDark} />} />
              <Route path="tithely-supabase/" element={<Home />} />
              <Route path="tithely-supabase/style-guide" element={<StyleGuide />} />
              <Route path="*" element={<Navigate to="tithely-supabase/login" />} />
            </Route>
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
