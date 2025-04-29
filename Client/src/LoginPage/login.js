import React, { useState } from 'react';
import './login.css';
import estLogo from '../assets/ESTLOGO.webp'; // Adjust the path if needed

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt with:', { email, password, rememberMe });
  };

  return (
    <div className="login-container">
      <div className="background-image"></div>
      <div className="login-card">
        <div className="logo-section">
          <div className="logo-container">
            <img src={estLogo} alt="EST Logo" className="est-logo" />
            {/* School info div removed as requested */}
          </div>
        </div>
        
        <div className="form-section">
          <h1 className="app-title">
            UNI<span className="budget-part">BUDGET</span>
          </h1>
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <div className="input-container">
                <span className="input-icon">✉️</span>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="example@gmail.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <span className="input-icon">🔑</span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  placeholder="••••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️"}
                </button>
              </div>
            </div>
            
            <div className="form-footer">
              <div className="remember-me">
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>
            
            <button type="submit" className="login-button">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;