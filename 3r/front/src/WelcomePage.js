// WelcomePage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './WelcomePage.css'; // Import CSS for styles

const WelcomePage = () => {
  const [typedText, setTypedText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const text = "3R - Generative Garbage Segregating App";
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setTypedText((prevText) => prevText + text[i]);
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => {
      clearInterval(typingInterval);
    };
  }, []);

  const handleProceed = () => {
    navigate("/loading"); // Navigate to the loading page
  };

  return (
    <div className="welcome-container">
      <img src={require("./images/logo.jpg")} alt="3R Logo" className="logo" />
      <div className="text-container">
        <h1 className="title">{typedText}</h1>
        <button className="proceed-button" onClick={handleProceed}>
          Proceed
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
