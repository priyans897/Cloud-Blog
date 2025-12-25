import { useState, useEffect } from "react";
import api from "./api";
import Tilt from "react-parallax-tilt";
import { formatDistanceToNow } from "date-fns";
import { FiCalendar, FiEdit, FiTrash2, FiExternalLink, FiUser } from "react-icons/fi"; 
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  // Current Login User
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    api.get("/blogs").then(res => setBlogs(res.data || []));
  }, []);

  const handleEdit = (blog) => {
    navigate("/create", { state: { blog: blog } });
    navigate(`/edit/${blog.id}`, { state: { blog: blog } });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Hologram?")) return;
    const loadingToast = toast.loading("Deleting Data...");

    try {
      await api.delete(`/blog/${id}`);
      setBlogs((prevBlogs) => prevBlogs.filter(blog => blog.id !== id));
      toast.success("Hologram Deleted!", { id: loadingToast });
    } catch (err) {
      console.error(err);
      toast.error("Delete Failed", { id: loadingToast });
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <div className="section-title">🚀 Holographic Stories</div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        {blogs.map(blog => {
            
          
          const isOwner = user && (user.id === blog.userId);

          return (
            <Tilt
              key={blog.id}
              glareEnable={true}
              glareMaxOpacity={0.45}
              scale={1.02}
              transitionSpeed={2500}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="blog-item" style={{ position: 'relative' }}>

                {/* Image */}
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ color: '#00f3ff', margin: '0 0 10px 0' }}>{blog.title}</h3>
                  
                  {/* Author Name Display */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#888', fontSize: '0.8rem', marginBottom: '10px' }}>
                    <FiUser /> By: <span style={{ color: '#fff' }}>{blog.userName || "Unknown"}</span>
                  </div>

                  <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
                     {blog.content?.length > 80 
                       ? blog.content.substring(0, 80) + "..." 
                       : blog.content || "No content available"}
                  </p>

                  <button
                    onClick={() => navigate(`/blog/${blog.id}`, { state: { blog } })}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#00f3ff',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      marginTop: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    Read Full Story <FiExternalLink />
                  </button>

                  <div style={{
                    marginTop: '20px',
                    paddingTop: '15px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    color: '#666'
                  }}>
                    <span><FiCalendar /> {formatDistanceToNow(new Date(blog.createdAt))} ago</span>

                    
                    {isOwner && (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(blog);
                          }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid #00f3ff',
                            color: '#00f3ff',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(blog.id);
                          }}
                          style={{
                            background: 'rgba(255, 0, 0, 0.1)',
                            border: '1px solid #ff0055',
                            color: '#ff0055',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    )}
                   
                    
                  </div>
                </div>
              </div>
            </Tilt>
          );
        })}
      </div>
    </div>
  );
}