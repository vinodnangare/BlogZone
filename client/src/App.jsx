import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import "./index.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Blogs from "./pages/Blogs";
import CreateBlog from "./pages/CreateBlog";
import EditBlog from "./pages/EditBlog";
import DetailedBlog from "./pages/DetailedBlog";
import Navbar from "./components/Navbar";

function App() {
  const [publishedBlogs, setPublishedBlogs] = useState([]);
  const navigate = useNavigate();
  console.log(`${import.meta.env.VITE_DB_URL}/published`);
  const fetchPublishedBlogs = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_DB_URL}/published`
      );
      console.log(response.data);
      if (response.data.sucess) {
        setPublishedBlogs(response.data.data);
      } else {
        alert("Failed to fetch published blogs");
      }
    } catch (e) {
      console.log("Failed to fetch published blogs");
    }
  };

  useEffect(() => {
    fetchPublishedBlogs();
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/create" element={<CreateBlog />} />
        <Route path="/edit/:id" element={<EditBlog />} />
        <Route path="/blog/:slug" element={<DetailedBlog />} />
      </Routes>
    </>
  );
}

export default App;
