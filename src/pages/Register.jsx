import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser, registerUser } from '../redux/features/authSlice';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ fullname: '', email: '', username: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
        const res = await dispatch(registerUser(formData));
        if (res.meta.requestStatus === 'fulfilled') {
          navigate('/login');
        }
    } catch (err) {
        if (err.response && err.response.status >= 400 && err.response.status <= 500) {
            handleError('All field are req')
            setError(err.response.data.message);
        }
        console.log(error);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-900" style={{
      backgroundImage: 'url(./login3.jpg)',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      
  }} >
            <div className="w-full max-w-xl flex flex-col  bg-gray-950 rounded-4xl  overflow-hidden ro">
                <div className="flex flex-col items-center justify-center p-6 bg-gray-950 text-gray-100">
                <h1 className="text-4xl font-bold mb-4 mt-7">Register</h1>
                    <form className="w-full max-w-xs space-y-4" onSubmit={handleSubmit}>
                        <label htmlFor="name">Name:</label>
                        <input className="w-full p-3 rounded-lg bg-gray-800 focus:outline-none" type="text" placeholder="Name" name="fullname" onChange={handleChange} value={formData.fullname} required />

                        <label htmlFor="">Username</label>

                        <input className="w-full p-3 rounded-lg bg-gray-800 focus:outline-none" type="text" placeholder="Username" name="username" onChange={handleChange} value={formData.username} required />

                        <label htmlFor="email">Email:</label>
                        <input className="w-full p-3 rounded-lg bg-gray-800  focus:outline-none" type="email" placeholder="Email" name="email" onChange={handleChange} value={formData.email} required />

                        <label htmlFor="password">Password:</label>
                        <input className="w-full p-3 rounded-lg bg-gray-800  focus:outline-none" type="password" placeholder="Password" name="password" onChange={handleChange} value={formData.password} required />
                        {error && 
                            <div className="w-full p-3 bg-red-400 text-white text-center rounded-lg">{error}</div>
                        }
                        <button type="submit" className="w-full py-3 text-lg font-semibold bg-violet-700 text-white rounded-lg shadow-md hover:bg-violet-900 hover:scale-110 cursor-pointer  transition">Register</button>
                    </form>
                    <p className="text-lg mt-2 mb-6 text-center">Already have an account? <Link to="/login" className="w-full max-w-xs">
                        <span className="w-full py-3 text-lg font-semibold rounded-lg text-violet-700  underline transition cursor-pointer 
                        hover:text-violet-900 hover:text-xl">Login</span>
                    </Link></p>
                </div>
            </div>
        </div>
  );
}

export default Register;
