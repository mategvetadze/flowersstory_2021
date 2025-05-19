import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import AuthImagePattern from '../Dangs/AuthImagePattern'
import {Mail, Lock, Eye, EyeOff} from "lucide-react"
import {toast} from "react-hot-toast";

const LogIn = () => {

    const [isVisible, setIsVisible] = useState(false);

    const handleVisibility = () => {
      setIsVisible(!isVisible)
    }

    const [required, setRequired] = useState({
      email: "",
      password: "",
    })

    const handleErrors = () => {
      if(!required.email){
        return toast.error("Email is required")
      }
      if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(required.email)){
        return toast.error("Invalid email format")
      }
      if(!required.password){
        return toast.error("Password is required")
      }

      return true
    }

    const validateForm = (e) => {
      e.preventDefault();
      let success = handleErrors();
      if(success === true){
        toast.success("Loged in succesfully")
      }
    }

      return (
    <>
        <div className="signup-page">
            <div className="signup-left">
                <div className="signup-form-wrapper">
                    <div className="signup-header">
                <h1>Welcome Back</h1>
                <p>Log back to your account</p>
        </div>
      <form className="signup-form" onSubmit={validateForm}>

        <div className="form-control">
            <label className="label">
                <span className="label-text">Email</span>
            </label>
            <div className='input-wrapper'>
                <div className='input-icon'><Mail /></div>
                <input
              type="text"
              className="input"
              placeholder="example@example.com"
              onChange={(e) => setRequired({...required, email: e.target.value})}
            />
            </div>
        </div>
        <div className='form-control'>
        
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <div className='input-wrapper'>
            <div className='input-icon'><Lock /></div>
            <input
              type={!isVisible ? "password" : "text"}
              className="input"
              placeholder="********"
              onChange={(e) => setRequired({...required, password: e.target.value})}
            />
            {
                !isVisible ? 
                (
                  <Eye className="eye-icon" onClick={handleVisibility}></Eye>) : (
                  <EyeOff className="eye-icon" onClick={handleVisibility} />
                  )
            }
            
          </div>
        </div>

        <button
          type="submit"
          className="submit-btn"
          
        >
            Log In
        </button>
      </form>

      <div className="text-muted">
        Don't Have an account?{" "}
        <Link to="/signup" className="link-primary">
          Sign Up
        </Link>
      </div>
    </div>
  </div>
  <AuthImagePattern
    title={"Welcome Back to our flower shop!"}
    subtitle={"Just FYI... Flowers are gay"}
   />
</div>
    </>
  )
}

export default LogIn