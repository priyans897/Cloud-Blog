import React, { useState } from "react";
import api from "./api";

export default function CreateBlog({ onBlogCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitBlog = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in title and content");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) formData.append("image", image);

      await api.post("/blog", formData);
      alert(" Blog published successfully!");

      if (onBlogCreated) onBlogCreated();

      setTitle("");
      setContent("");
      setImage(null);
      setImagePreview(null);
    } catch (err) {
      console.error(err);
      alert("Error creating blog: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-blog-form">
      <div className="form-group">
        <label htmlFor="title">Blog Title</label>
        <input
          id="title"
          type="text"
          placeholder="Enter your blog title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Blog Content</label>
        <textarea
          id="content"
          placeholder="Write your blog content here..."
          value={content}
          onChange={e => setContent(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="image">Upload Image</label>
        <div className="file-input-wrapper">
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label htmlFor="image" className="file-input-label">
            {imagePreview ? "✓ Image selected" : "📸 Click to upload image"}
          </label>
        </div>
        {imagePreview && (
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <img src={imagePreview} alt="Preview" style={{ maxWidth: "200px", borderRadius: "0.5rem" }} />
          </div>
        )}
      </div>

      <button
        className="submit-btn"
        onClick={submitBlog}
        disabled={loading}
      >
        {loading ? "Publishing..." : "Publish Blog"}
      </button>
    </div>
  );
}
