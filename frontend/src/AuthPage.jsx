import React, { useState } from "react";
import api from "./api"; 
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiUser, FiMail, FiLock } from "react-icons/fi";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const loadingToast = toast.loading(isLogin ? "Decrypting..." : "Creating Identity & Logging in...");

    try {
      if (isLogin) {
       
        const res = await api.post("/auth/login", formData);
        
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        toast.success("Access Granted! 🔓", { id: loadingToast });
        navigate("/");
        window.location.reload();
        
      } else {
        
        await api.post("/auth/register", formData);
        
        
        const loginRes = await api.post("/auth/login", formData);

       
        localStorage.setItem("token", loginRes.data.token);
        localStorage.setItem("user", JSON.stringify(loginRes.data.user));

        toast.success("Identity Created! Welcome. 🚀", { id: loadingToast });
        
        
        navigate("/");
        window.location.reload();
      }
      
    } catch (err) {
      console.error("Auth Error:", err);
      
      const errorMsg = err.response?.data?.message || "Operation Failed ❌";
      toast.error(errorMsg, { id: loadingToast });
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem', padding: '0 20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', textAlign: 'center', padding: '2.5rem' }}>
        
        <h2 className="section-title" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
          {isLogin ? "SYSTEM LOGIN" : "NEW IDENTITY"}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {!isLogin && (
            <div className="input-group" style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <FiUser style={{ color: '#00f3ff', marginRight: '10px' }} />
              <input 
                name="name" 
                placeholder="Codename" 
                className="input-glow" 
                onChange={handleChange} 
                style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }}
              />
            </div>
          )}

          <div className="input-group" style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <FiMail style={{ color: '#00f3ff', marginRight: '10px' }} />
            <input 
              name="email" 
              type="email" 
              placeholder="Email Address" 
              className="input-glow" 
              onChange={handleChange} 
              style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }}
            />
          </div>

          <div className="input-group" style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <FiLock style={{ color: '#00f3ff', marginRight: '10px' }} />
            <input 
              name="password" 
              type="password" 
              placeholder="Password" 
              className="input-glow" 
              onChange={handleChange} 
              style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }}
            />
          </div>

         
          <button 
            type="submit"
            style={{ 
              background: 'linear-gradient(90deg, #00f3ff, #0066ff)',
              marginTop: '1.5rem',
              color: '#fff',
              border: 'none',
              padding: '14px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '10px',
              width: '100%',
              boxShadow: '0 0 20px rgba(0, 243, 255, 0.4)', // Neon Glow
              transition: 'transform 0.2s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isLogin ? "ENTER MATRIX" : "INITIALIZE"} <FiArrowRight />
          </button>
        </form>

        <p style={{ marginTop: '2rem', color: '#aaa', fontSize: '0.9rem' }}>
          {isLogin ? "New here? " : "Already have an ID? "}
          <span 
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: '#00f3ff', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
          >
            {isLogin ? "Create Identity" : "Login Now"}
          </span>
        </p>

      </div>
    </div>
  );
}