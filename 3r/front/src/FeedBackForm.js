import React, { useState } from "react";
import emailjs from "emailjs-com";
import "./style.css"; // Import CSS file

function FeedBackForm() {
  const [workerId, setWorkerId] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [problem, setProblem] = useState("");
  const [comments, setComments] = useState("");

  const problemOptions = [
    "Demanded for Money",
    "Used Harsh Words",
    "Inconvenient Collection Time",
    "Demanded Festive Money (Baksheesh)",
    "Skipped Collection",
    "Partial Waste Collection",
    "Unhygienic Handling",
    "Delayed Pickup",
    "Overcharging for Extra Waste",
    "Unresponsive to Complaints",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailParams = {
      worker_id: workerId,
      user_name: userName,
      user_email: email,
      user_phone: phone,
      problem: problem,
      additional_comments: comments,
    };

    emailjs
      .send(
        "service_ivc8wrf", // Replace with your EmailJS service ID
        "template_znvcd9f", // Replace with your EmailJS template ID
        emailParams,
        "3rqTScBXD5ggpxUeA" // Replace with your EmailJS user ID
      )
      .then(
        (response) => {
          alert("Feedback sent successfully!");
          setWorkerId("");
          setUserName("");
          setEmail("");
          setPhone("");
          setProblem("");
          setComments("");
        },
        (error) => {
          alert("Failed to send feedback.");
          console.error("Error sending email:", error);
        }
      );
  };

  return (
    <div className="feedback-container">
      <h1 className="feedback-title">Worker Feedback Form</h1>
      <form className="feedback-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="feedback-input"
          placeholder="Enter Worker ID"
          value={workerId}
          onChange={(e) => setWorkerId(e.target.value)}
          required
        />
        <input
          type="text"
          className="feedback-input"
          placeholder="Enter Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <input
          type="email"
          className="feedback-input"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          className="feedback-input"
          placeholder="Enter Your Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <select
          className="feedback-select"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          required
        >
          <option value="">Select a Problem</option>
          {problemOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <textarea
          className="feedback-textarea"
          placeholder="Additional Comments (Optional)"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        ></textarea>
        <button className="feedback-submit" type="submit">
          Submit Feedback
        </button>
      </form>
    </div>
  );
}

export default FeedBackForm;