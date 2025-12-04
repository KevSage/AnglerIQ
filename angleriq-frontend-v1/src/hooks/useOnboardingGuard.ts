import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useOnboardingGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simple localStorage flag set by Onboarding
    const complete =
      typeof window !== "undefined" &&
      localStorage.getItem("aiq_onboarding_complete") === "true";

    if (!complete) {
      navigate("/onboarding", { replace: true });
    }
  }, [navigate]);
};
