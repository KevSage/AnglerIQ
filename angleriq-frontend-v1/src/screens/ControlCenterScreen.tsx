import ExperienceLevelSelect from "../components/controlCenter/ExperienceLevelSelect";
import CoachingStyleSelect from "../components/controlCenter/CoachingStyleSelect";
import PreferredStylesGrid from "../components/controlCenter/PreferredStylesGrid";
import ConfidenceSpectrumEditor from "../components/controlCenter/ConfidenceSpectrumEditor";
import DarkModeToggle from "../components/controlCenter/DarkModeToggle";
import { useOnboardingGuard } from "../hooks/useOnboardingGuard";
import ScreenContainer from "../components/layout/ScreenContainer";

const ControlCenterScreen = () => {
  useOnboardingGuard();
  return (
    <ScreenContainer>
      <header className="mb-4">
        <h1 className="text-lg font-semibold text-gray-100">Control Center</h1>
      </header>

      <main className="space-y-4">
        <ExperienceLevelSelect />
        <CoachingStyleSelect />
        <PreferredStylesGrid />
        <ConfidenceSpectrumEditor />
        <DarkModeToggle />
      </main>
    </ScreenContainer>
  );
};

export default ControlCenterScreen;
