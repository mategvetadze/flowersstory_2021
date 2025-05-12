import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, User, Mail, Eye, EyeOff, Lock } from 'lucide-react'
import './SignUp.css'
import AuthImagePattern from '../Dangs/AuthImagePattern'

const SignUp = () => {

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

  return (
    <>
        <div className="signup-page">
            <div className="signup-left">
                <div className="signup-form-wrapper">
                    <div className="signup-header">
                <h1>Create Account</h1>
                <p>Get started with your free account</p>
        </div>
      <form className="signup-form">
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
    subtitle={"Your journey begins here."}
   />
</div>
    </>
  )
}

export default SignUp