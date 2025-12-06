import { Routes, Route } from "react-router-dom";
import ControlCenterScreen from "../screens/ControlCenterScreen";
import HomeScreen from "../screens/HomeScreen";
import PatternIntelScreen from "../screens/PatternIntelScreen";
import VisionIntelligenceScreen from "../screens/VisionIntelligenceScreen";
import SageChatScreen from "../screens/SageChatScreen";
import PricingScreen from "../screens/PricingScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import LandingScreen from "../screens/LandingPage";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/landing" element={<LandingScreen />} />

      <Route path="/intel" element={<PatternIntelScreen />} />

      <Route path="/vision" element={<VisionIntelligenceScreen />} />

      <Route path="/sage" element={<SageChatScreen />} />
      <Route path="/control-center" element={<ControlCenterScreen />} />
      <Route path="/onboarding" element={<OnboardingScreen />} />

      <Route path="/pricing" element={<PricingScreen />} />
    </Routes>
  );
};
