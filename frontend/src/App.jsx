import './App.css'
import NavBar from './SomeOthers/NavBar'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import AboutUs from './components/AboutUs'
import LogIn from './components/LogIn'
import SignUp from './components/SignUp'
import Products from './components/Products'


function App() {


  return (
    <>
      <NavBar />
      <Routes>
        <Route path={"/"} element={<Home />} />   
        <Route path='/aboutus' element={<AboutUs />} />     
        <Route path='/products' element={<Products />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/signup' element={<SignUp />}></Route>
      </Routes>
    </>
  )
}

export default App
