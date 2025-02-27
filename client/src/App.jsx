import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/auth/login'
import Register from './pages/auth/register'

function App() {
  return (
    <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} /> 
        <Route path='/home' element={<Home />} />
        <Route path='/register' element={<Register />} />
    </Routes>
  )
}

export default App;