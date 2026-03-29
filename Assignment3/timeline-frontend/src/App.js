import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';

import Signup from "./components/Signup";
import Login from "./components/Login";
import Timeline from "./components/Timeline";
import EditPost from "./components/EditPost";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Timeline user={user} setUser={setUser} /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit-post/:id"
          element={user ? <EditPost user={user} /> : <Navigate to="/login" />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
      </Routes>
    </Router>
  );
}
