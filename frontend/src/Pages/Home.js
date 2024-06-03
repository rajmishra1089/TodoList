import React, { useState } from 'react';
import './Home.css'; // Import CSS file for styling
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useUser } from '../user-context';
import { FaEye, FaEyeSlash} from 'react-icons/fa'; // Import eye icons from react-icons library
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const { login } = useUser();
    const navigate=useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [isSignup, setIsSignup] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSignup) {
            // Perform sign-up form submission logic here
            console.log('Signup form submitted:', formData);
            try {
                const signupEndPoint=`${apiBaseUrl}/user/signup`
                axios.post(signupEndPoint,{ name:formData.name ,email:formData.email, password:formData.password },{withCredentials:true})
                .then((result)=>{
                    if(result.data.success === true) {
                        toast.success("User registered successfully");
                    }
                    else{
                        toast.error(result.data.message);
                    }
                })    
            } 
            catch (error) {
                console.error('Signup error:', error);
                toast.error(error);
            }
        } else {
            // Perform login form submission logic here
            console.log('Login form submitted:', formData);
            try {
                const loginEndPoint=`${apiBaseUrl}/user/login`
                axios.post(loginEndPoint,{ email:formData.email, password:formData.password },{withCredentials:true})
                .then((result)=>{
                    if(result.data.success === true) {
                        const LoggedInUser={
                            _id:result.data.user._id,
                            name:result.data.user.name,
                            email:result.data.user.email,
                            token:result.data.token
                        }
                        login(LoggedInUser);
                        toast.success("User Logged In  successfully", { duration: 2000 });
                        navigate("/userhome");
                    }
                    else{
                        toast.error(result.data.message);
                    }
                })  
            } catch (error) {
                console.error('Login error:', error);
                toast.error(error);
            }
        }
    };

    return (
        <div className="container">
            <Toaster/>
            <div className="form-container">
                <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <div className="form-group">
                            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                        </div>
                    )}
                    <div className="form-group">
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                        <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? (
                                <FaEyeSlash />
                            ) : (
                                <FaEye />
                            )}
                        </span>
                    </div>
                    <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
                </form>
                <button onClick={() => setIsSignup(!isSignup)}>{isSignup ? 'Already have an account? Login' : 'Create an account'}</button>
            </div>
        </div>
    );
}
