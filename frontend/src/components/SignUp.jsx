import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, User, Mail, Eye, EyeOff, Lock } from 'lucide-react'
import './SignUp.css'
import AuthImagePattern from '../Dangs/AuthImagePattern'
import toast from "react-hot-toast"

const SignUp = () => {

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const [person, setPerson] = useState(
      {
        fullName: "",
        email: "",
        password: "",
      }
    )

    const handleErrors = () => {
      if(!person.fullName.trim()){
        return toast.error("Full name is required")
      }
      if(!/^[\p{L}]+(?:[ '-][\p{L}]+)*$/u.test(person.fullName)){
        return toast.error("Invalid full name format")
      }
      if(!person.email.trim()){
        return toast.error("Email is required")
      }
      if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(person.email)){
        return toast.error("Email is not valid")
      }
      if(!person.password.trim()){
        return toast.error("Password is required")
      }
      if(person.password.length < 8){
        return toast.error("Password must be at least 8 characters long")
      }
  
      return true
    }

    const onSum = (e) => {
      e.preventDefault();
      const errs = handleErrors();
      if(errs === true){
        toast.success("Account Created Succesfully")
      }
    }

  return (
    <>
        <div className="signup-page">
            <div className="signup-left">
                <div className="signup-form-wrapper">
                    <div className="signup-header">
                <h1>Create Account</h1>
                <p>Get started with your free account</p>
        </div>
      <form className="signup-form" onSubmit={onSum}>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Full Name</span>
          </label>
          <div className="input-wrapper">
            <div className="input-icon"><User /></div>
            <input
              type="text"
              className="input"
              placeholder="John Doe"
              onChange={(e) => setPerson({...person, fullName:e.target.value})}
            />
          </div>
        </div>

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
              onChange={(e) => setPerson({...person, email:e.target.value})}
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
              type={showPassword ? "text" : "password"}
              className="input"
              placeholder="********"
              onChange={(e) => setPerson({...person, password:e.target.value})}
            />
            {
                showPassword ? (
                    <EyeOff className="eye-icon" onClick={togglePasswordVisibility} />
                ) : (
                    <Eye className="eye-icon" onClick={togglePasswordVisibility} />
                )
            }
            
          </div>
        </div>

        <button
          type="submit"
          className="submit-btn"
          
        >
            Submit
        </button>
      </form>

      <div className="text-muted">
        Already have an account?{" "}
        <Link to="/login" className="link-primary">
          Log In
        </Link>
      </div>
    </div>
  </div>
  <AuthImagePattern
    title={"Welcome to Our Flower Shop!"}
    subtitle={"Just FYI... Flowers are gay"}
   />
</div>
    </>
  )
}

export default SignUp