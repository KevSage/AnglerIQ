// src/routes/AppRoutes.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "../screens/LandingPage";
import HomeScreen from "../screens/HomeScreen";
import PatternIntelScreen from "../screens/PatternIntelScreen";
import VisionIntelligenceScreen from "../screens/VisionIntelligenceScreen";
import SageChatScreen from "../screens/SageChatScreen"; // <- use your actual file name
import ControlCenterScreen from "../screens/ControlCenterScreen";
import OnboardingScreen from "../screens/OnboardingScreen";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<LandingPage />} />

      {/* Onboarding */}
      <Route path="/onboarding" element={<OnboardingScreen />} />

      {/* Core app screens */}
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/pattern" element={<PatternIntelScreen />} />
      <Route path="/vision" element={<VisionIntelligenceScreen />} />
      <Route path="/sage" element={<SageChatScreen />} />
      <Route path="/control" element={<ControlCenterScreen />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
