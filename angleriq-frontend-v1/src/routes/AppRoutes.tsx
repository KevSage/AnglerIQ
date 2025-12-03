import { Routes, Route } from "react-router-dom";
import ControlCenterScreen from "../screens/ControlCenterScreen";
import HomeScreen from "../screens/HomeScreen";
import PatternIntelScreen from "../screens/PatternIntelScreen";
import VisionIntelligenceScreen from "../screens/VisionIntelligenceScreen";
import SageChatScreen from "../screens/SageChatScreen";
import PricingScreen from "../screens/PricingScreen";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />

      <Route path="/intel" element={<PatternIntelScreen />} />

      <Route path="/vision" element={<VisionIntelligenceScreen />} />

      <Route path="/sage" element={<SageChatScreen />} />
      <Route path="/control-center" element={<ControlCenterScreen />} />
      <Route
        path="/onboarding"
        element={
          <div className="min-h-screen px-4 py-4 text-gray-100">
            Onboarding (placeholder)
          </div>
        }
      />
      <Route path="/pricing" element={<PricingScreen />} />
    </Routes>
  );
};
