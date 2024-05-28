import { Auth } from '@supabase/auth-ui-react'
import supabase from '../../config/supabaseClient'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {
    ThemeSupa,
  } from '@supabase/auth-ui-shared'


const LoginSignupForm = ({ isDark } : { isDark: boolean }) => {

    const { pathname } = useLocation()

  return (
    <div className='w-full max-w-[500px] p-10 rounded border-color-border border-solid border-[1px]'>
        <div className='text-center mb-8'>
            <p className="fs-h2 mb-2">
                {pathname === '/login' && 'Welcome Back'}
                {pathname === '/signup' && 'Create Account'}
            </p>
            <p className='fs-base'>
                {pathname === '/login' && <> Don't have an account yet? <Link to='/signup' className='underline'>Sign Up</Link> </>}
                {pathname === '/signup' && <> Already have an account? <Link to='/login' className='underline'>Log In</Link> </>}
            </p>
        </div>

        <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme={`${isDark ? 'dark' : 'light'}`}
            providers={['google', 'github']}
            onlyThirdPartyProviders
            redirectTo='https://jonkohjj.github.io/tithely-supabase/dashboard'
            // redirectTo='http://localhost:5173/dashboard'
        />
  </div>
  )
}

export default LoginSignupForm
