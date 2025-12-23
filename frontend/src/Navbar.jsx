import { Link } from "react-router-dom";
import { FiHome, FiPlusSquare } from "react-icons/fi";

export default function Navbar() {
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
        letterSpacing: '2px'
      }}>
        NEO BLOG
      </div>
      
      <div style={{ display: 'flex', gap: '2rem' }}>
        <Link to="/" style={linkStyle}>
          <FiHome /> Home
        </Link>
        <Link to="/create" style={linkStyle}>
          <FiPlusSquare /> Create
        </Link>
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
  fontFamily: 'Outfit, sans-serif'
};