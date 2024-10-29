// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [tc, setTc] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/user/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
                tc,
            });
            setSuccess('Registration successful! You can now log in.');
            setError('');
        } catch (err) {
            // Check if the error response exists and set the error message
            if (err.response && err.response.data) {
                setError(err.response.data.message); // Display the error message from backend
            } else {
                setError('Registration failed. Please try again.');
            }
            setSuccess('');
            console.error('Error registering user:', err);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleRegister}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} placeholder="Confirm Password" required />
                <label>
                    <input type="checkbox" checked={tc} onChange={(e) => setTc(e.target.checked)} required />
                    I agree to the terms and conditions
                </label>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;