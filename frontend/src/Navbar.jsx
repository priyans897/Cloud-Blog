import { Link, useNavigate } from "react-router-dom";
import { FiHome, FiPlusSquare, FiLogIn, FiLogOut } from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();
  
  
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem 2rem',
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0, 243, 255, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ 
        fontSize: '1.5rem', 
        fontWeight: 'bold', 
        color: '#00f3ff',
        textShadow: '0 0 10px rgba(0,243,255,0.5)',
        letterSpacing: '2px',
        cursor: 'pointer'
      }} onClick={() => navigate("/")}>
        NEO BLOG
      </div>
      
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        
        {/* 1. Home Link */}
        <Link to="/" style={linkStyle}>
          <FiHome /> Home
        </Link>
        
        {/* 2. Create Link (Sirf Login User ke liye) */}
        {user && (
          <Link to="/create" style={linkStyle}>
            <FiPlusSquare /> Create
          </Link>
        )}

        {/* 3. Login/Logout Logic */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* User Name Display (FIXED - Ab ye crash nahi karega) */}
            <span style={{ color: '#aaa', fontSize: '0.9rem', fontFamily: 'Space Grotesk' }}>
              Welcome, <span style={{ color: '#fff' }}>
                {user?.name ? user.name.split(" ")[0] : "User"}
              </span>
            </span>
            
            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              style={{
                ...linkStyle,
                background: 'rgba(255, 0, 0, 0.1)',
                border: '1px solid #ff0055',
                padding: '8px 15px',
                borderRadius: '5px',
                cursor: 'pointer',
                color: '#ff0055',
                fontSize: '0.9rem'
              }}
            >
              <FiLogOut /> Logout
            </button>
          </div>
        ) : (
          /* Login Button */
          <Link to="/login" style={{...linkStyle, color: '#00f3ff'}}>
            <FiLogIn /> Login
          </Link>
        )}
      </div>
    </nav>
  );
}

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontSize: '1.1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: '0.3s',
  fontFamily: 'Outfit, sans-serif',
  background: 'transparent',
  border: 'none'
};