import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail]= useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try{
            const response = await axios.post('https://movie-review-q7ef.onrender.com/api/login',{ email, password});
            const token = response.data.token;
            console.log('Login successful:', response.data);
            login(response.data.token);
            setSuccess('Login Successful');

            setTimeout(() => {
              navigate("/");
            },1000);
        } catch (error) {
            console.log('Login Failed:',error.response?.data?.message || error.message);
            setError(error.response?.data?.message || 'Login Failed');
        }
    };
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-dark-100 text-white">
          <h2 className="text-3xl font-bold mb-8">Login</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80">
            <input
              type="email"
              placeholder="Email"
              className="p-3 rounded bg-dark-200 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="p-3 rounded bg-dark-200 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded"
            >
              Log In
            </button>
          </form>
          {success && (
            <div className="mt-4 text-green-400 font-semibold">{success}</div>
          )}

          {error && (
            <div className="mt-4 text-red-400 font-semibold">{error}</div>
          )}
        </div>
      );
    };
    
    export default Login;
