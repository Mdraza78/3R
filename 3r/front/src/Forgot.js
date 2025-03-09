// Forgot.js
import React, { useState } from 'react';
import './Forgot.css';

const Forgot = () => {
  const [username, setUsername] = useState('');
  const [retrievedPassword, setRetrievedPassword] = useState('');
  const [isPasswordRetrieved, setIsPasswordRetrieved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate password retrieval (you can replace this with actual logic)
    setRetrievedPassword("examplePassword123"); // Simulate password retrieval
    setIsPasswordRetrieved(true);
  };

  return (
    <div className="forgot-container">
      {/* App Bar */}
      <div className="forgot-app-bar">
        <div className="forgot-app-name">
          <marquee behavior="scroll" direction="left" className="forgot-app-name-marquee">
            3R - Generative Garbage Segregation App
          </marquee>
        </div>
      </div>

      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} className="forgot-form-container">
        <div className="forgot-form-group">
          <label htmlFor="username" className="forgot-form-label">Enter Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="forgot-form-input"
          />
        </div>
        <button type="submit" className="forgot-submit-button">Retrieve Password</button>
      </form>

      {isPasswordRetrieved && (
        <div className="forgot-password-display">
          <p>Your password is: {retrievedPassword}</p>
          <button className="forgot-back-button" onClick={() => window.history.back()}>
            Go Back
          </button>
        </div>
      )}
    </div>
  );
};

export default Forgot;
