import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthContextProvider } from './context/AuthContext.tsx'

console.log('Rendering App component');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
)
