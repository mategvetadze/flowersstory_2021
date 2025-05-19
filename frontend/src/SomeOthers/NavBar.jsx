import React from 'react'
import {Home, LogOut} from 'lucide-react'
import './NavBar.css'
import {Link } from 'react-router-dom'
import { FaLeaf } from 'react-icons/fa'
const NavBar = () => {
  return (
    <div className='Container'>
        <header className='header' >
            <Link to='/' className='Link Link2'>
                <FaLeaf />
                <span>Flowers</span>
            </Link>
            <div className='Home'>
                <Link to='/' className='Link'>
                    <div className='HomeIcon'>
                        <span>Home</span>
                    </div>
                </Link>
                <Link to={"/products"} className='Link'  >
                    <div className='Products'>
                        <span>Products</span>
                    </div>
                </Link>
                <Link to='/aboutUs' className='Link'>
                    <div className='AboutUs'>
                        <span>About</span>
                    </div>  
                </Link>
            </div>
            <div className='logOut'>
                <Link to={"/login"}>
                    <button className='lg ss'>LogIn</button>
                </Link>
                <Link to={'/signup'}>
                <button className='sg ss'>SignUp</button>
                </Link>
                <LogOut className='logOutIcon' />
            </div>
        </header>
    </div>
  )
}
export default NavBar