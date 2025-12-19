import { useState, useEffect } from "react";
import api from "./api";

export default function BlogList({ refresh }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/blogs")
      .then(res => {
        setBlogs(res.data || []);
      })
      .catch(err => {
        console.error("Error fetching blogs:", err);
        setBlogs([]);
      })
      .finally(() => setLoading(false));
  }, [refresh]);

  if (loading) {
    return <div className="empty-state"><p>⏳ Loading blogs...</p></div>;
  }

  return (
    <div className="blog-list">
      {blogs.length === 0 ? (
        <div className="empty-state">
          <p>No blogs yet. Create your first one!</p>
        </div>
      ) : (
        blogs.map(blog => (
          <div key={blog.id} className="blog-item">
            <h3>{blog.title}</h3>
            <p>{blog.content}</p>
            {blog.imageUrl && (
              <img src={blog.imageUrl} alt={blog.title} />
            )}
            <small style={{ color: "#9ca3af" }}>
              📅 {new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </small>
          </div>
        ))
      )}
    </div>
  );
}
