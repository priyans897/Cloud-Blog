import React, { useState, useEffect } from "react";
import api from "./api";
import toast from "react-hot-toast";
import { FiSend, FiEdit3, FiImage, FiSave } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

export default function CreateBlog() {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.state?.blog ? true : false;
  const existingBlog = location.state?.blog;

 
  const user = JSON.parse(localStorage.getItem("user"));

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
   
    if (isEditMode && existingBlog && user?.id !== existingBlog.userId) {
       toast.error("Unauthorized Access! 🚫");
       navigate("/");
    }

    if (isEditMode && existingBlog) {
      setTitle(existingBlog.title);
      setContent(existingBlog.content);
    }
  }, [isEditMode, existingBlog, user, navigate]);

  const handleSubmit = async () => {
    if (!title || !content) {
      toast.error("Data Fields Empty!");
      return;
    }

    
    if (!user) {
      toast.error("Access Denied! You must Login first. 🔒");
      navigate("/login");
      return;
    }

    const loadingToast = toast.loading(isEditMode ? "Updating Matrix..." : "Uploading to Cloud...");
    
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      
      
      formData.append("userId", user.id);     
      formData.append("userName", user.name); 

      if (image) formData.append("image", image);

      if (isEditMode) {
        await api.put(`/blog/${existingBlog.id}`, formData); 
        toast.success("Blog Updated Successfully!", { id: loadingToast });
      } else {
        await api.post("/blog", formData);
        toast.success("Blog Published!", { id: loadingToast });
      }
      navigate("/");
    } catch (e) { 
      console.error(e);
      toast.error("System Failure", { id: loadingToast }); 
    }
  };

  return (
    <div className="glass-panel" style={{ 
        maxWidth: '800px', 
        margin: '2rem auto', 
        paddingBottom: '3rem' 
    }}>
      <div className="section-title">
        {isEditMode ? <FiSave /> : <FiEdit3 />} 
        {isEditMode ? "Update Neural Link" : "Transmit New Data"}
      </div>
      
      
      {user && (
        <div style={{ textAlign: 'center', color: '#aaa', marginBottom: '20px', fontSize: '0.9rem' }}>
          Posting as: <span style={{ color: '#00f3ff', fontWeight: 'bold' }}>{user.name}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Title Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{color: '#00f3ff', fontSize: '0.9rem', fontWeight: 'bold'}}>TITLE</label>
          <input 
            className="input-glow" 
            placeholder="Enter Title..." 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        {/* Content Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{color: '#00f3ff', fontSize: '0.9rem', fontWeight: 'bold'}}>CONTENT</label>
          <textarea 
            className="input-glow" 
            rows="8"
            placeholder="Write your story..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label className="input-glow" style={{ 
              cursor: 'pointer', display: 'flex', alignItems: 'center', 
              gap: '10px', width: '100%', justifyContent: 'center', 
              borderStyle: 'dashed' 
          }}>
            <FiImage size={20} /> 
            {image ? " New Image Selected" : "Click to Upload Image"}
            <input type="file" hidden onChange={(e) => setImage(e.target.files[0])} />
          </label>
        </div>

        <button 
          onClick={handleSubmit}
          className="submit-btn"
          style={{
             marginTop: '20px',       
             marginBottom: '20px',    
             padding: '1.2rem',       
             fontSize: '1.1rem',
             fontWeight: 'bold',
             width: '100%',
             cursor: 'pointer',
             borderRadius: '10px',
             border: 'none',
             color: '#fff',
             background: isEditMode 
                ? 'linear-gradient(90deg, #ff9900, #ff0000)' 
                : 'linear-gradient(90deg, #00f3ff, #0066ff)',
             boxShadow: isEditMode 
                ? '0 0 20px rgba(255, 153, 0, 0.4)' 
                : '0 0 20px rgba(0, 243, 255, 0.4)',
             transition: 'transform 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isEditMode ? <><FiSave style={{marginRight: 8}}/> UPDATE BLOG</> : <><FiSend style={{marginRight: 8}}/> PUBLISH BLOG</>}
        </button>

      </div>
    </div>
  );
}