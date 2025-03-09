// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import './LoadingPage.css'; // Import CSS for styles

// const LoadingPage = () => {
//   const [progress, setProgress] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     let timer;
//     if (progress < 100) {
//       timer = setInterval(() => {
//         setProgress((prev) => prev + 1);
//       }, 50); // Increase progress every 50ms
//     } else {
//       // Once 100% is reached, navigate to the SignLog page
//       clearInterval(timer);
//       setTimeout(() => {
//         navigate("/login");
//       }, 500); // Wait for a short duration before navigation
//     }
//     return () => clearInterval(timer);
//   }, [progress, navigate]);

//   return (
//     <div className="loading-container">
//       <div className="logo-container">
//         <img
//           src={require("./images/logo.jpg")}
//           alt="Logo"
//           className={`logo ${progress === 100 ? "flicker" : ""}`}
//         />
//       </div>
//       <div className="progress-container">
//         <div className="progress-bar">
//           <div
//             className="progress-fill"
//             style={{ width: `${progress}%` }}
//           ></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoadingPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './LoadingPage.css'; // Import CSS for styles

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (progress < 100) {
      timer = setInterval(() => {
        setProgress((prev) => prev + 1);
      }, 50); // Increase progress every 50ms
    } else {
      // Once 100% is reached, navigate to the login page
      clearInterval(timer);
      setTimeout(() => {
        navigate("/login");
      }, 500); // Wait for a short duration before navigation
    }
    return () => clearInterval(timer);
  }, [progress, navigate]);

  return (
    <div className="loading-container">

      {/* Circular Loading Spinner */}
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>

      {/* Optional Progress Bar */}
      <div className="progress-container" style={{ position: 'absolute', bottom: '10%' }}>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;

