import { Link, useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { authToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logout Clicked");
    logout();
    navigate('/');
  }
  return (
    <nav className="navbar flex justify-between items-center py-4 px-8 bg-dark-100 text-white">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-2xl font-bold custom-title">
          CritiqueYourfavMovie
        </Link>
      </div>
      <div className="flex gap-6">
        <Link to="/" className="text-base text-light-100 hover:text-white">Home</Link>
        {authToken ? (
          <button 
          onClick={handleLogout}
          className="text-base text-light-100 hover:text-white">
            Logout
          </button>
          
        ):(
          <>
        <Link to="/login" className="text-base text-light-100 hover:text-white">Login</Link>
        <Link to="/signUp" className="text-base text-light-100 hover:text-white">Sign Up</Link>
        </>
        )}
        
        

      </div>
    </nav>
  );
}


export default Navbar;


