// src/components/Register.tsx
import React, { useState } from 'react';
import { auth } from '../firebase/firebaseconfig'
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState<string>('');


  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username,
          location,
          password,
        }),
      });
  
      const text = await response.text();
      console.log('Raw response:', text);
  
      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = JSON.parse(text);
        setMessage(`Registration successful: ${data.message}`);
      } else {
        setMessage(`Unexpected response: ${text}`);
      }
    } catch (error) {
      setMessage(`Registration failed: ${(error as Error).message}`);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Location:</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Register</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Register;
