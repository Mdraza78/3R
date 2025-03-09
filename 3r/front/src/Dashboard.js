import React, { useState } from "react";
import "./Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRupeeSign } from "@fortawesome/free-solid-svg-icons";
import aiService from "./services/aiService";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [imagesData, setImagesData] = useState({});
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isUnclassified, setIsUnclassified] = useState(false);
  const [suggestedName, setSuggestedName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [nonBiodegradableType, setNonBiodegradableType] = useState("");
  const [weight, setWeight] = useState(0);
  const [bonusCoins, setBonusCoins] = useState(0);

  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;

  const imageCount = Object.values(imagesData).flat().length;
  const totalCoins = imageCount * 0.2 + bonusCoins;

  const handleDateSelect = (date) => {
    if (date === todayString) {
      setSelectedDate(date);
      resetStates();
    }
  };

  const resetStates = () => {
    setUploadedImage(null);
    setAnalysisResult(null);
    setIsUnclassified(false);
    setSuggestedName("");
    setSelectedCategory("");
    setNonBiodegradableType("");
    setWeight(0);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);

      const img = new Image();
      img.src = imageUrl;
      img.onload = async () => {
        try {
          const result = await aiService.analyzeImage(img);
          setAnalysisResult(result);

          if (result?.category === "Unclassified") {
            setIsUnclassified(true);
          }

          setImagesData((prev) => ({
            ...prev,
            [selectedDate]: [...(prev[selectedDate] || []), { imageUrl, analysis: result }],
          }));
        } catch (error) {
          console.error("Error analyzing image:", error);
        }
      };
    }
  };

  const getCategoryType = (category) => {
    const degradableCategories = [
      "fruit",
      "vegetable",
      "peel",
      "organic",
      "leaf",
      "plant",
      "compostable",
      "natural",
      "food waste",
    ];
    return degradableCategories.includes(category) ? "Degradable" : "Non-Degradable";
  };

  const handleSuggestionSubmit = () => {
    if (!selectedCategory) return;

    const newCategory = getCategoryType(selectedCategory);

    const updatedResult = {
      ...analysisResult,
      description: `This item is classified as "${suggestedName}" and marked as ${newCategory}.`,
      category: newCategory,
    };

    setAnalysisResult(updatedResult);
    setIsUnclassified(false);
    setImagesData((prev) => ({
      ...prev,
      [selectedDate]: prev[selectedDate].map((item) =>
        item.imageUrl === uploadedImage ? { ...item, analysis: updatedResult } : item
      ),
    }));

    if (newCategory === "Non-Degradable" || newCategory.includes("Non-Biodegradable")) {
      setNonBiodegradableType("");
      setWeight(0);
    }
  };

  const handleNonBiodegradableTypeSelect = (type) => {
    setNonBiodegradableType(type);
    if (type === "o") {
      setBonusCoins((prevBonusCoins) => prevBonusCoins + 0.1);
    }
  };

  const handleWeightSubmit = () => {
    if (weight <= 0) {
      alert("Please enter a valid weight.");
      return;
    }

    let bonus = 0;
    if (nonBiodegradableType === "p") {
      bonus = (weight / 100) * 4;
    } else if (nonBiodegradableType === "g") {
      bonus = (weight / 100) * 8;
    } else if (nonBiodegradableType === "m") {
      bonus = (weight / 100) * 20;
    }
    setBonusCoins((prevBonusCoins) => prevBonusCoins + bonus);
  };

  const handleMonthChange = (direction) => {
    setCurrentMonth((prevMonth) => {
      let newMonth = direction === "prev" ? prevMonth - 1 : prevMonth + 1;
      if (newMonth < 0) {
        setCurrentYear((prevYear) => prevYear - 1);
        return 11;
      } else if (newMonth > 11) {
        setCurrentYear((prevYear) => prevYear + 1);
        return 0;
      }
      return newMonth;
    });
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  return (
    <div className="dashboard-container">
      <div className="taskbar">
        <div className="logo2"></div>
        <div className="app-name">3R - Generative Garbage Segregation App</div>
        <div className="welcome-message">
          <span>Welcome, {user ? user : "Guest"}</span>
        </div>
      </div>

      {!selectedDate ? (
        <div className="calendar-container">
          <div className="month-navigation">
            <button onClick={() => handleMonthChange("prev")}>{"<"}</button>
            <span>
              {new Date(currentYear, currentMonth).toLocaleString("default", {
                month: "long",
              })}{" "}
              {currentYear}
            </span>
            <button onClick={() => handleMonthChange("next")}>{">"}</button>
          </div>

          {[...Array(daysInMonth)].map((_, index) => {
            const date = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(
              index + 1
            ).padStart(2, "0")}`;
            const isToday = date === todayString;
            const isPast = new Date(date) < today;

            return (
              <div
                key={index}
                className={`calendar-day ${isToday ? "today" : isPast ? "inactive" : "future"}`}
                onClick={() => handleDateSelect(date)}
                style={{
                  pointerEvents: isToday ? "auto" : "none",
                  backgroundColor: isToday ? "#4CAF50" : isPast ? "#ccc" : "#eee",
                  cursor: isToday ? "pointer" : "not-allowed",
                }}
              >
                <div className="date-number">{index + 1}</div>
                <div className="image-count">{imagesData[date] ? imagesData[date].length : 0}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="date-details">
          <h3>Selected Date: {selectedDate}</h3>
          <div className="button-container">
            <label htmlFor="imageUpload" className="upload-button">
              Upload Picture
            </label>
            <input
              type="file"
              id="imageUpload"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </div>

          {uploadedImage && (
            <div className="image-preview">
              <img src={uploadedImage} alt="Uploaded" />
              <p>Description: {analysisResult?.description}</p>
              <p>Category: {analysisResult?.category}</p>

              {isUnclassified && (
                <div className="unclassified-container">
                  <label htmlFor="suggestedName">Suggest a name:</label>
                  <input
                    id="suggestedName"
                    type="text"
                    value={suggestedName}
                    onChange={(e) => setSuggestedName(e.target.value)}
                  />

                  <label htmlFor="categorySelect">Select category:</label>
                  <select
                    id="categorySelect"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">-- Select Category --</option>
                    <option value="fruit">Fruit</option>
                    <option value="vegetable">Vegetable</option>
                    <option value="peel">Peel</option>
                    <option value="organic">Organic</option>
                    <option value="leaf">Leaf</option>
                    <option value="plant">Plant</option>
                    <option value="compostable">Compostable</option>
                    <option value="natural">Natural</option>
                    <option value="food waste">Food Waste</option>
                    <option value="plastic">Plastic</option>
                    <option value="metal">Metal</option>
                    <option value="glass">Glass</option>
                    <option value="bottle">Bottle</option>
                    <option value="can">Can</option>
                    <option value="styrofoam">Styrofoam</option>
                    <option value="rubber">Rubber</option>
                    <option value="electronics">Electronics</option>
                    <option value="wire">Wire</option>
                    <option value="iron">Iron</option>
                    <option value="steel">Steel</option>
                    <option value="screw">Screw</option>
                  </select>

                  <button onClick={handleSuggestionSubmit}>Submit</button>
                </div>
              )}

              {(analysisResult?.category.includes("Non-Degradable") ||
                analysisResult?.category.includes("Non-Biodegradable")) && (
                <div className="non-degradable-container">
                  <label htmlFor="nonBiodegradableType">Select type:</label>
                  <select
                    id="nonBiodegradableType"
                    value={nonBiodegradableType}
                    onChange={(e) => handleNonBiodegradableTypeSelect(e.target.value)}
                  >
                    <option value="">-- Select Type --</option>
                    <option value="o">Type O</option>
                    <option value="p">Type P</option>
                    <option value="g">Type G</option>
                    <option value="m">Type M</option>
                  </select>

                  {(nonBiodegradableType === "p" ||
                    nonBiodegradableType === "g" ||
                    nonBiodegradableType === "m") && (
                    <div>
                      <label htmlFor="weight">Weight (grams):</label>
                      <input
                        id="weight"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                      />
                      <button onClick={handleWeightSubmit}>Calculate Bonus</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <button onClick={() => setSelectedDate(null)}>Back to Calendar</button>
        </div>
      )}

      <div className="rewards-container">
        <div className="reward-info">
          <FontAwesomeIcon icon={faRupeeSign} className="rotating-icon" />
          <span className="reward-text">Coins Earned: {totalCoins.toFixed(2)}</span>
        </div>
        <div className="reward-buttons">
          <button
            className="moneymake-btn"
            onClick={() => navigate("/form", { state: { coinsEarned: totalCoins } })}
          >
            Moneymake
          </button>
          <button
            className="taxredemption-btn"
            onClick={() => navigate("/feedback")}
          >
            Feed Back on Services
          </button>
        </div>
      </div>

      <div className="recycling-center">
        <button onClick={() => navigate("/location-map")}>Find Which Municipality You Are In ???</button>
      </div>
    </div>
  );
};

export default Dashboard;