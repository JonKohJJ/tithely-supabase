import { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

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
import NotFound404 from "./pages/NotFound404"


function App() {

  const { user, session } = useAuthContext()

  // fetching common data that a few component need
  const { types, fetchTypesError } = useFetchTypes()
  const { categories, fetchCategoriesError } = useFetchCategories()

  // Filters states for tracker & dashboard component
  const [filteredYear, setFilteredYear] = useState<number>(new Date().getFullYear())
  const [filteredMonth, setFilteredMonth] = useState<number>(new Date().getMonth() + 1)
  // Get Filtered Year and Month, and isDark from Local Storage
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
  // Store Filtered Year and Month In Local Storage
  useEffect(() => {
      window.localStorage.setItem('TITHELY_SELECTED_YEAR', JSON.stringify(filteredYear))
      window.localStorage.setItem('TITHELY_SELECTED_MONTH', JSON.stringify(filteredMonth))
  }, [filteredYear, filteredMonth])

  // Light/Dark mode
  const [isDark, setIsDark] = useState(true)
    // Store isDark Boolean In Local Storage
    useEffect(() => {
      window.localStorage.setItem('TITHELY_IS_DARK', JSON.stringify(isDark))
  }, [isDark])


  // Base URL
  const BASE_URL = "/tithely-supabase/"


  return (
    <div className="app min-h-[100vh] bg-color-background text-color-text" data-theme={isDark ? 'dark' : 'light'}>

      <Router>
        <Routes>
          {( user && session ) &&
            <>
              <Route element={<NotLoggedInLayout isDark={isDark} setIsDark={setIsDark} />}>
                <Route path={`${BASE_URL}`} element={<Home />}/>
                <Route path={`${BASE_URL}/style-guide`} element={<StyleGuide />}/>
                <Route path="*" element={<NotFound404 />}/>
              </Route>
              <Route element={<LoggedInLayout isDark={isDark} setIsDark={setIsDark} />}>
                <Route path={`${BASE_URL}/login`} element={ <Dashboard types={types} fetchTypesError={fetchTypesError} categories={categories} fetchCategoriesError={fetchCategoriesError} filteredYear={filteredYear} setFilteredYear={setFilteredYear} filteredMonth={filteredMonth} setFilteredMonth={setFilteredMonth} /> }/>
                <Route path={`${BASE_URL}/signup`} element={ <Dashboard types={types} fetchTypesError={fetchTypesError} categories={categories} fetchCategoriesError={fetchCategoriesError} filteredYear={filteredYear} setFilteredYear={setFilteredYear} filteredMonth={filteredMonth} setFilteredMonth={setFilteredMonth} /> }/>
                <Route path={`${BASE_URL}/planner`} element={ <Planner types={types} fetchTypesError={fetchTypesError} categories={categories} fetchCategoriesError={fetchCategoriesError} /> }/>
                <Route path={`${BASE_URL}/tracker`} element={ <Tracker types={types} fetchTypesError={fetchTypesError} categories={categories} fetchCategoriesError={fetchCategoriesError} filteredYear={filteredYear} setFilteredYear={setFilteredYear} filteredMonth={filteredMonth} setFilteredMonth={setFilteredMonth} /> }/>
                <Route path={`${BASE_URL}/dashboard`} element={ <Dashboard types={types} fetchTypesError={fetchTypesError} categories={categories} fetchCategoriesError={fetchCategoriesError} filteredYear={filteredYear} setFilteredYear={setFilteredYear} filteredMonth={filteredMonth} setFilteredMonth={setFilteredMonth} /> }/>
                <Route path={`${BASE_URL}/settings`} element={<Settings />}/>
                <Route path={`${BASE_URL}/style-guide`} element={<StyleGuide />}/>
                <Route path="*" element={<NotFound404 />}/>
              </Route>
              
            </>
          }

          { !( user && session ) &&
            <Route element={<NotLoggedInLayout isDark={isDark} setIsDark={setIsDark} />}>
              <Route path={`${BASE_URL}/planner`} element={<Home />}/>
              <Route path={`${BASE_URL}/login`} element={<Login isDark={isDark} />}/>
              <Route path={`${BASE_URL}/signup`} element={<Signup isDark={isDark} />}/>
              <Route path={`${BASE_URL}/planner`} element={ <Login isDark={isDark} /> }/>
              <Route path={`${BASE_URL}/tracker`} element={ <Login isDark={isDark} /> }/>
              <Route path={`${BASE_URL}/dashboard`} element={ <Login isDark={isDark} /> }/>
              <Route path={`${BASE_URL}/settings`} element={ <Login isDark={isDark} /> }/>
              <Route path={`${BASE_URL}/style-guide`} element={<StyleGuide />}/>
              <Route path="*" element={<NotFound404 />}/>
            </Route>
          }
      
        </Routes>
      </Router>

    </div>
  )
}

export default App
