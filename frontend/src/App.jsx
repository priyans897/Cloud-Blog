import { useState } from "react";
import CreateBlog from "./CreateBlog.jsx";
import BlogList from "./BlogList.jsx";
import "./App.css";

export default function App() {
  const [refresh, setRefresh] = useState(false);

  // Function to trigger BlogList refresh after creating a blog
  const handleBlogCreated = () => {
    setRefresh(prev => !prev);
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <h1> Cloud Blog System</h1>
        <p>Share your thoughts with the world</p>
      </div>

      <section className="section">
        <h2 className="section-title">Create a New Blog</h2>
        <CreateBlog onBlogCreated={handleBlogCreated} />
      </section>

      <section className="section">
        <h2 className="section-title">All Blogs</h2>
        <BlogList refresh={refresh} />
      </section>
    </div>
  );
}
