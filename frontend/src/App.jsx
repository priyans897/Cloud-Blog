import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import BackgroundParticles from "./BackgroundParticles"; 
import CreateBlog from "./CreateBlog";
import BlogList from "./BlogList";
import Navbar from "./Navbar"; 
import { Toaster } from "react-hot-toast";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <BackgroundParticles /> 
      
      <div className="app-container">
        <Toaster position="bottom-right" toastOptions={{
          style: { background: '#333', color: '#fff', border: '1px solid #00f3ff' }
        }}/>
        
        <Navbar />

        <Routes>
          
          <Route path="/" element={<BlogList />} />
          
         
          <Route path="/create" element={<CreateBlog />} />

          
          <Route path="/edit/:id" element={<CreateBlog />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;