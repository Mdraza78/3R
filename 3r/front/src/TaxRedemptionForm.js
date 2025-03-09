// import React, { useState } from "react";
// //import { saveAs } from "file-saver";
// import * as XLSX from "xlsx"; // For processing Excel data
// import html2canvas from "html2canvas"; // For capturing styled divs as images
// import { jsPDF } from "jspdf"; // For generating the PDF
// import { useLocation } from "react-router-dom";
// import "./style.css"; // Import the CSS file for styles

// function TaxRedemptionForm() {
//   const location = useLocation();
//   const coins = location.state?.coinsEarned || 0; // Get coinsEarned from state
//   const [taxId, setTaxId] = useState("");
//   const [payerName, setPayerName] = useState("");
//   const [amount, setAmount] = useState(null);

//   const handleSubmit = async () => {
//     try {
//       // Fetch the Excel file from the public folder
//       const file = await fetch("/Tax_Data.xlsx").then((res) => res.blob());
//       const data = await file.arrayBuffer();
//       const workbook = XLSX.read(data);
//       const sheet = workbook.Sheets[workbook.SheetNames[0]];
//       const json = XLSX.utils.sheet_to_json(sheet);

//       // Find the tax record by Tax ID
//       const taxRecord = json.find((row) => row["Tax ID"] === taxId);

//       if (taxRecord) {
//         // Assuming the column name for the tax amount is "1-Year Tax Paid Amount"
//         const totalAmount = parseFloat(taxRecord["1-Year Tax Paid Amount"]);
//         const reduction = (coins / 1000) * 50; // 1000 coins = ₹50 reduction
//         const newAmount = totalAmount - reduction;

//         setAmount(newAmount);
//         console.log(`Calculated Amount: ₹${newAmount}`);
//       } else {
//         alert("Tax ID not found!");
//       }
//     } catch (err) {
//       console.error("Error processing Excel file:", err);
//       alert("Failed to process the Excel file.");
//     }
//   };

//   const handleDownloadPDF = async () => {
//     const doc = new jsPDF();

//     // Add title to the PDF
//     doc.setFontSize(20);
//     doc.text("Tax Redemption Details", 20, 20);

//     // Add Tax Details
//     doc.setFontSize(12);
//     const lineHeight = 10;
//     let yPosition = 40;

//     doc.text(`TaxID: ${taxId}`, 20, yPosition);
//     yPosition += lineHeight;
//     doc.text(`Taxpayer Name: ${payerName}`, 20, yPosition);
//     yPosition += lineHeight;
//     doc.text(`Amount to be Paid: ₹${amount}`, 20, yPosition);
//     yPosition += lineHeight;
//     doc.text(`Amount Reduced: ₹${(coins / 1000) * 50}`, 20, yPosition);
//     yPosition += lineHeight;
//     doc.text(`New Amount: ₹${amount}`, 20, yPosition);
//     yPosition += lineHeight;

//     // Add description
//     const description = `
//       The Municipal Corporation of India plays a vital role in the development and maintenance
//       of your local community. Your property tax payments contribute directly to essential
//       public services, including road maintenance, sanitation, waste management, and water supply.
      
//       By paying your taxes on time, you support local healthcare, education, and emergency
//       services that benefit all residents. Remember, paying taxes is not just a legal responsibility,
//       but a civic duty that strengthens our community and supports its growth.
//     `;
//     const pageWidth = doc.internal.pageSize.width - 40;
//     doc.setFontSize(10);
//     doc.text(description, 20, yPosition, { maxWidth: pageWidth });

//     // Capture the styled div as an image
//     const stampDiv = document.querySelector(".tax-stamp-container");
//     if (stampDiv) {
//       try {
//         const canvas = await html2canvas(stampDiv);
//         const imgData = canvas.toDataURL("image/jpeg");
//         doc.addImage(imgData, "JPEG", 150, 240, 30, 30); // Adjust position and size
//       } catch (err) {
//         console.error("Failed to capture image from CSS-styled element:", err);
//       }
//     }

//     // Save the PDF
//     doc.save("tax_redemption_details.pdf");
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h1>Tax Redemption</h1>
//       <input
//         type="text"
//         placeholder="Enter Tax ID"
//         value={taxId}
//         onChange={(e) => setTaxId(e.target.value)}
//       />
//       <br />
//       <input
//         type="text"
//         placeholder="Enter Payer Name"
//         value={payerName}
//         onChange={(e) => setPayerName(e.target.value)}
//       />
//       <br />
//       <button onClick={handleSubmit}>Calculate Amount</button>
//       {amount !== null && (
//         <>
//           <p>AmountToBePaid: {amount}rs</p>
//           <p>AmountReduced: {(coins / 1000) * 50}rs</p>
//           <p>NewAmount: {amount}rs</p>

//           <div
//             style={{
//               marginTop: "30px",
//               textAlign: "left",
//               padding: "20px",
//               border: "1px solid #ddd",
//               width: "80%",
//               margin: "0 auto",
//             }}
//           >
//             <h2>Description</h2>
//             <p>
//               The Municipal Corporation of India plays a vital role in the
//               development and maintenance of your local community. Your property
//               tax payments contribute directly to essential public services,
//               including road maintenance, sanitation, waste management, and water
//               supply.
//             </p>
//           </div>
//  <div className="tax-stamp-container"></div>
//           <button
//             style={{
//               marginTop: "20px",
//               padding: "10px 20px",
//               backgroundColor: "#4CAF50",
//               color: "white",
//               border: "none",
//               cursor: "pointer",
//             }}
//             onClick={handleDownloadPDF}
//           >
//             Download PDF
//           </button>
//         </>
//       )}
//     </div>
//   );
// }

// export default TaxRedemptionForm;


import React, { useState } from "react";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useLocation } from "react-router-dom";
import "./style.css";
import TaxRedemption from "./images/TaxRedemption.webp";

function TaxRedemptionForm() {
  const location = useLocation();
  const coins = location.state?.coinsEarned || 0;
  const [taxId, setTaxId] = useState("");
  const [payerName, setPayerName] = useState("");
  const [amount, setAmount] = useState(null);

  const handleSubmit = async () => {
    try {
      const file = await fetch("/Tax_Data.xlsx").then((res) => res.blob());
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      const taxRecord = json.find((row) => row["Tax ID"] === taxId);
      if (taxRecord) {
        const totalAmount = parseFloat(taxRecord["1-Year Tax Paid Amount"]);
        const reduction = (coins / 1000) * 50;
        const newAmount = totalAmount - reduction;

        setAmount(newAmount);
      } else {
        alert("Tax ID not found!");
      }
    } catch (err) {
      console.error("Error processing Excel file:", err);
      alert("Failed to process the Excel file.");
    }
  };

  const handleDownloadPDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Tax Redemption Details", 20, 20);
    doc.setFontSize(12);
    const lineHeight = 10;
    let yPosition = 40;

    doc.text(`TaxID: ${taxId}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Taxpayer Name: ${payerName}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Amount to be Paid: ₹${amount + (coins / 1000) * 50}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Amount Reduced: ₹${(coins / 1000) * 50}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`New Amount: ₹${amount}`, 20, yPosition);

    const stampDiv = document.querySelector(".tax-stamp-container");
    if (stampDiv) {
      try {
        const canvas = await html2canvas(stampDiv);
        const imgData = canvas.toDataURL("image/jpeg");
        doc.addImage(imgData, "JPEG", 150, 240, 30, 30);
      } catch (err) {
        console.error("Failed to capture image from CSS-styled element:", err);
      }
    }

    doc.save("tax_redemption_details.pdf");
  };

  return (
    <div className="form-container">
      <div className="form-content">
        <h1 className="form-title">Tax Redemption</h1>
        <input
          type="text"
          placeholder="Enter Tax ID"
          value={taxId}
          onChange={(e) => setTaxId(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Enter Payer Name"
          value={payerName}
          onChange={(e) => setPayerName(e.target.value)}
          className="input-field"
        />
        <button onClick={handleSubmit} className="submit-btn">
          Calculate Amount
        </button>
        {amount !== null && (
          <>
            <p className="amount-text">Amount to be Paid: ₹{amount+(coins / 1000) * 50}</p>
            <p className="amount-text">
              Amount Reduced: ₹{(coins / 1000) * 50}
            </p>
            <p className="amount-text">New Amount: ₹{amount}</p>
            <button onClick={handleDownloadPDF} className="download-btn">
              Download PDF
            </button>
          </>
        )}
      </div>
      <div className="image-container">
        <img
          src={TaxRedemption} // Replace with the correct path
          alt="Tax Redemption AI"
          className="tax-image"
        />
      </div>
    </div>
  );
}

export default TaxRedemptionForm;
