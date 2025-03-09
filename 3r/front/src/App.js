import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomePage from "./WelcomePage";
import LoadingPage from "./LoadingPage";
import Register from "./Register";
import Forgot from "./Forgot";
import Login from "./Login";
import Dashboard from "./Dashboard";
import AdminLogin from "./AdminLogin";
import LocationMap from "./LocationMap";
import Form from "./Form";
import TaxRedemptionForm from "./TaxRedemptionForm";
import Profile from "./Profile";
import FeedBackForm from "./FeedBackForm";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<Forgot />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/location-map" element={<LocationMap />} />
        <Route path="/form" element={<Form />} />
        <Route path="/tax-redemption-form" element={<TaxRedemptionForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/feedback" element={<FeedBackForm />} />
      </Routes>
    </Router>
  );
};

export default App;