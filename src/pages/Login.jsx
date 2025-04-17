import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/features/authSlice';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const res = await dispatch(loginUser(formData));
        if (res.meta.requestStatus === 'fulfilled') {
            navigate('/');
        }
    };

    return (
        <div className='h-[100vh] w-full bg-gray-900 flex items-center justify-center' style={{
            backgroundImage: 'url(./login3.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            
        }}>
            <div className='w-[500px] h-[300px] rounded' >
                <div className=" flex flex-col items-center justify-center p-6 bg-gray-950 text-gray-200 rounded-4xl" >
                    <h1 className="text-4xl font-bold mb-4 mt-3">Welcome Back!</h1>
                    <form className="w-full max-w-xs space-y-4" onSubmit={handleSubmit}>
                        <label htmlFor="email">Email:</label>
                        <input className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-white/30 focus:outline-none" type="email" placeholder="Email" name="email" onChange={handleChange} value={formData.email} required />
                        <label htmlFor="password">Password:</label>
                        <input className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-white/30 focus:outline-none" type="password" placeholder="Password" name="password" onChange={handleChange} value={formData.password} required />

                        <button type="submit" className="w-full py-3 text-lg font-semibold bg-violet-700 text-white rounded-lg shadow-md hover:bg-violet-900 hover:scale-110 cursor-pointer  transition">Log In</button>
                    </form>
                    <p className="text-lg mt-2 mb-6 text-center">Don't have an account? <Link to="/register" className="w-full max-w-xs">
                        <span className="w-full py-3 text-lg font-semibold rounded-lg text-violet-700  underline transition cursor-pointer 
                        hover:text-violet-900 hover:text-xl">register</span>
                    </Link></p>
                </div>
            </div>
        </div>

    );
}

export default Login;


