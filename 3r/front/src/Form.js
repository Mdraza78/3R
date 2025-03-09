import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import emailjs from "emailjs-com";
import "./MoneyForm.css"; // Import the updated CSS file

const Form = () => {
  const location = useLocation();
  const coinsEarned = location.state?.coinsEarned || 0; // Get coinsEarned from location state
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState((coinsEarned * 2).toFixed(2)); // Calculate amount based on coinsEarned

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare template parameters for EmailJS
    const templateParams = {
      to_name: "Admin",
      from_name: name,
      phone_number: phoneNumber,
      upi_id: upiId,
      amount: amount,
      upi_link: `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=Payment`, // Fixed template literal
    };

    // Send email using EmailJS
    emailjs
      .send(
        "service_0xpbuoo", // Replace with your EmailJS service ID
        "template_zwabsv4", // Replace with your EmailJS template ID
        templateParams,
        "ilQBkd_R4XgKhb-mF" // Replace with your EmailJS user ID
      )
      .then(
        (response) => {
          console.log("Email sent successfully!", response.status, response.text);
          alert(
            "Form submitted successfully! You will receive your amount within five minutes."
          );
        },
        (error) => {
          console.error("Failed to send email.", error);
          alert("Failed to submit form. Please try again.");
        }
      );
  };

  return (
    <div className="container">
      <div className="form-section">
        <h1 className="h1css">Moneymake Form</h1>
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            required
          />
          <label>Phone Number:</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="input-field"
            required
          />
          <label>UPI ID:</label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="input-field"
            required
          />
          <label>Amount (₹):</label>
          <input
            type="text"
            value={amount}
            className="input-field"
            readOnly
          />
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
        <div className="converted-amount">Converted Amount: ₹{amount}</div>
        <div className="message">You will receive your amount within five minutes.</div>
      </div>
      <div className="image-section">
        <img src="https://images.unsplash.com/photo-1512358958014-b651a7ee1773?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Sample Image" />
      </div>
    </div>
  );
};

export default Form;