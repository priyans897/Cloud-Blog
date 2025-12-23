import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiClock } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

export default function BlogDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const blog = location.state?.blog; 

 
  if (!blog) {
    navigate("/");
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel"
      style={{ maxWidth: '900px', margin: '2rem auto', padding: '0', overflow: 'hidden' }}
    >
      {/* Full Width Image */}
      <div style={{ width: '100%', height: '400px', overflow: 'hidden', position: 'relative' }}>
        <img 
          src={blog.imageUrl} 
          alt={blog.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div style={{
            position: 'absolute', bottom: 0, left: 0, width: '100%',
            background: 'linear-gradient(to top, #000, transparent)',
            height: '150px'
        }}></div>
      </div>

      {/* Content Area */}
      <div style={{ padding: '3rem' }}>
        {/* Back Button */}
        <button 
          onClick={() => navigate("/")}
          style={{
            background: 'transparent', border: '1px solid #00f3ff', color: '#00f3ff',
            padding: '8px 15px', borderRadius: '20px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem'
          }}
        >
          <FiArrowLeft /> Back to Feed
        </button>

        <h1 style={{ 
            fontSize: '3rem', color: '#fff', marginBottom: '1rem',
            fontFamily: 'Outfit, sans-serif', textShadow: '0 0 20px rgba(0, 243, 255, 0.3)'
        }}>
          {blog.title}
        </h1>

        <div style={{ display: 'flex', gap: '20px', color: '#aaa', marginBottom: '2rem', fontSize: '0.9rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FiCalendar /> {formatDistanceToNow(new Date(blog.createdAt))} ago
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
             <FiClock /> {new Date(blog.createdAt).toLocaleTimeString()}
          </span>
        </div>

        {/* Full Content */}
        <p style={{ 
            color: '#ddd', fontSize: '1.1rem', lineHeight: '1.8', 
            whiteSpace: 'pre-wrap', fontFamily: 'Inter, sans-serif' 
        }}>
          {blog.content}
        </p>
      </div>
    </motion.div>
  );
}