// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/register.js'; // Ensure this matches the file name
import Login from './components/Login.js'; // Ensure this path is correct

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<h1>Welcome to the Authentication App</h1>} />
            </Routes>
        </Router>
    );
};

export default App;